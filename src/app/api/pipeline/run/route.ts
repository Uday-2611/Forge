import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/lib/db'
import { rawPosts, painPoints, industryEnum, difficultyEnum } from '@/lib/schema'
import { stripMarkdownFences } from '@/lib/utils'
import { inArray } from 'drizzle-orm'

const HN_QUERIES = [
  'frustrated with software',
  'wish there was a tool',
  'annoying problem startup',
  'pain point workflow',
  'nobody has solved this',
]

type Industry = typeof industryEnum.enumValues[number]
type Difficulty = typeof difficultyEnum.enumValues[number]

type HNHit = {
  objectID: string
  title?: string
  story_text?: string
  comment_text?: string
  url?: string
  points?: number
}

type GeminiPainPoint = {
  problem: string
  industry: Industry
  painScore: number
  buildDifficulty: Difficulty
  targetUser: string
  suggestedSolution: string
  keywords: string[]
}

type RawPost = {
  postId: string
  title: string
  body: string
  url: string
  upvotes: number
}

function safeEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a)
    const bb = Buffer.from(b)
    return ba.length === bb.length && timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}

function isValidIndustry(v: unknown): v is Industry {
  return typeof v === 'string' && (industryEnum.enumValues as readonly string[]).includes(v)
}

function isValidDifficulty(v: unknown): v is Difficulty {
  return typeof v === 'string' && (difficultyEnum.enumValues as readonly string[]).includes(v)
}

async function fetchHNPosts(query: string): Promise<RawPost[]> {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=30`
  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) return []
  const data = await res.json()
  return (data.hits ?? []).map((h: HNHit) => ({
    postId: h.objectID,
    title: h.title ?? '',
    body: h.story_text ?? h.comment_text ?? '',
    url: h.url ?? `https://news.ycombinator.com/item?id=${h.objectID}`,
    upvotes: h.points ?? 0,
  }))
}

function buildGeminiPrompt(posts: Pick<RawPost, 'title' | 'body' | 'upvotes'>[]): string {
  const postList = posts
    .map((p, i) => `[${i + 1}] Title: ${p.title}\nUpvotes: ${p.upvotes}\nBody: ${p.body?.slice(0, 300) ?? ''}`)
    .join('\n\n')

  return `You are a startup analyst. Given these Hacker News posts, extract real pain points that could be turned into software products.

For each genuine pain point found, return a JSON object. If a post has no clear pain point, skip it.

Return ONLY a JSON array, no markdown, no explanation:
[
  {
    "problem": "one sentence describing the pain point",
    "industry": one of ${JSON.stringify(industryEnum.enumValues)},
    "painScore": integer 1-100 (how painful/common),
    "buildDifficulty": one of ${JSON.stringify(difficultyEnum.enumValues)},
    "targetUser": "who suffers from this",
    "suggestedSolution": "one sentence product idea",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
]

Posts:
${postList}`
}

async function processWithGemini(
  genai: GoogleGenerativeAI,
  posts: Pick<RawPost, 'title' | 'body' | 'upvotes'>[]
): Promise<GeminiPainPoint[]> {
  const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(buildGeminiPrompt(posts))
  const text = stripMarkdownFences(result.response.text())
  try {
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (p): p is GeminiPainPoint =>
        typeof p.problem === 'string' &&
        isValidIndustry(p.industry) &&
        typeof p.painScore === 'number' &&
        isValidDifficulty(p.buildDifficulty)
    )
  } catch {
    return []
  }
}

async function runPipeline(): Promise<{ inserted: number; processed: number; message: string }> {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set')
  const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

  const fetched = await Promise.all(HN_QUERIES.map(fetchHNPosts))
  const allFetched = fetched.flat()

  const seen = new Set<string>()
  const uniqueFetched = allFetched.filter((p) => {
    if (seen.has(p.postId)) return false
    seen.add(p.postId)
    return true
  })

  if (uniqueFetched.length === 0) {
    return { inserted: 0, processed: 0, message: 'No posts fetched' }
  }

  const fetchedIds = uniqueFetched.map((p) => p.postId)
  const existing = await db
    .select({ postId: rawPosts.postId })
    .from(rawPosts)
    .where(inArray(rawPosts.postId, fetchedIds))
  const existingIds = new Set(existing.map((r) => r.postId))
  const newPosts = uniqueFetched.filter((p) => !existingIds.has(p.postId))

  if (newPosts.length === 0) {
    return { inserted: 0, processed: 0, message: 'No new posts' }
  }

  await db.insert(rawPosts).values(
    newPosts.map((p) => ({
      postId: p.postId,
      source: 'hn',
      title: p.title,
      body: p.body,
      url: p.url,
      upvotes: p.upvotes,
      isProcessed: false,
    }))
  )

  const BATCH_SIZE = 10
  let totalPainPoints = 0
  const processedIds: string[] = []

  for (let i = 0; i < newPosts.length; i += BATCH_SIZE) {
    const batch = newPosts.slice(i, i + BATCH_SIZE)
    const extracted = await processWithGemini(genai, batch)

    if (extracted.length > 0) {
      await db.insert(painPoints).values(
        extracted.map((p) => ({
          problem: p.problem,
          industry: p.industry,
          painScore: Math.min(100, Math.max(1, p.painScore)),
          buildDifficulty: p.buildDifficulty,
          targetUser: p.targetUser,
          suggestedSolution: p.suggestedSolution,
          keywords: p.keywords,
          sourceType: 'hn',
          sourcePostIds: batch.map((b) => b.postId),
          isPublished: true,
          trendingScore: 0,
          builderCount: 0,
        }))
      )
      totalPainPoints += extracted.length
    }

    processedIds.push(...batch.map((b) => b.postId))
  }

  if (processedIds.length > 0) {
    await db
      .update(rawPosts)
      .set({ isProcessed: true })
      .where(inArray(rawPosts.postId, processedIds))
  }

  return {
    inserted: newPosts.length,
    processed: totalPainPoints,
    message: `Inserted ${newPosts.length} raw posts, extracted ${totalPainPoints} pain points`,
  }
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-pipeline-secret') ?? ''
  if (!safeEqual(secret, process.env.PIPELINE_SECRET ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await runPipeline()
  return NextResponse.json(result)
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? ''
  if (!safeEqual(authHeader, `Bearer ${process.env.CRON_SECRET ?? ''}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await runPipeline()
  return NextResponse.json(result)
}
