"use server"

import { headers } from "next/headers"
import { and, eq } from "drizzle-orm"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { db } from "./db"
import { painPoints, savedIdeas, builders, industryEnum, difficultyEnum } from "./schema"
import { auth } from "./auth"
import { stripMarkdownFences } from "./utils"
import type { PainPoint } from "./data"

type Industry = typeof industryEnum.enumValues[number]
type Difficulty = typeof difficultyEnum.enumValues[number]

function isValidIndustry(v: unknown): v is Industry {
  return typeof v === "string" && (industryEnum.enumValues as readonly string[]).includes(v)
}

function isValidDifficulty(v: unknown): v is Difficulty {
  return typeof v === "string" && (difficultyEnum.enumValues as readonly string[]).includes(v)
}

type PainPointRow = typeof painPoints.$inferSelect

function rowToPainPoint(r: PainPointRow): PainPoint {
  return {
    id: r.id,
    score: r.painScore / 10,
    title: r.problem,
    industry: r.industry,
    difficulty: r.buildDifficulty,
    source: r.sourceType,
    sourceDetail: (r.sourceDetail as PainPoint["sourceDetail"]) ?? [],
    target: r.targetUser ?? "",
    solution: r.suggestedSolution ?? "",
    keywords: r.keywords ?? [],
    builders: r.builderCount ?? 0,
  }
}

export async function getPainPoints(): Promise<PainPoint[]> {
  const rows = await db
    .select()
    .from(painPoints)
    .where(eq(painPoints.isPublished, true))
    .orderBy(painPoints.createdAt)

  return rows.map(rowToPainPoint)
}

export async function savePainPoint(painPointId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Not authenticated")

  await db
    .insert(savedIdeas)
    .values({ userId: session.user.id, painPointId })
    .onConflictDoNothing()
}

export async function unsavePainPoint(painPointId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Not authenticated")

  await db
    .delete(savedIdeas)
    .where(
      and(
        eq(savedIdeas.userId, session.user.id),
        eq(savedIdeas.painPointId, painPointId)
      )
    )
}

export async function claimBuilding(painPointId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Not authenticated")

  await db
    .insert(builders)
    .values({ userId: session.user.id, painPointId })
    .onConflictDoNothing()
}

export async function getSavedIds(): Promise<string[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return []

  const rows = await db
    .select({ painPointId: savedIdeas.painPointId })
    .from(savedIdeas)
    .where(eq(savedIdeas.userId, session.user.id))

  return rows.map((r) => r.painPointId)
}

export async function getBuildingIds(): Promise<string[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return []

  const rows = await db
    .select({ painPointId: builders.painPointId })
    .from(builders)
    .where(eq(builders.userId, session.user.id))

  return rows.map((r) => r.painPointId)
}

export async function getSavedPainPoints(): Promise<PainPoint[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return []

  const rows = await db
    .select({ pain: painPoints })
    .from(savedIdeas)
    .innerJoin(painPoints, eq(savedIdeas.painPointId, painPoints.id))
    .where(eq(savedIdeas.userId, session.user.id))

  return rows.map((r) => rowToPainPoint(r.pain))
}

export async function getBuildingPainPoints(): Promise<PainPoint[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return []

  const rows = await db
    .select({ pain: painPoints })
    .from(builders)
    .innerJoin(painPoints, eq(builders.painPointId, painPoints.id))
    .where(eq(builders.userId, session.user.id))

  return rows.map((r) => rowToPainPoint(r.pain))
}

export async function getSubmittedPainPoints(): Promise<PainPoint[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return []

  const rows = await db
    .select()
    .from(painPoints)
    .where(and(eq(painPoints.submittedBy, session.user.id), eq(painPoints.isPublished, true)))
    .orderBy(painPoints.createdAt)

  return rows.map(rowToPainPoint)
}

export async function submitPainPoint(text: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Not authenticated")

  const cleaned = text.trim()
  const wordCount = cleaned ? cleaned.split(/\s+/).length : 0
  if (wordCount < 6) throw new Error("Please describe the problem in at least 6 words")
  if (cleaned.length > 2000) throw new Error("Submission is too long")

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set")

  const genai = new GoogleGenerativeAI(apiKey)
  const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `You are a startup analyst. A user submitted this pain point description:

"${cleaned}"

Extract the core pain point and return ONLY a JSON object, no markdown, no explanation:
{
  "problem": "one sentence describing the pain point",
  "industry": one of ${JSON.stringify(industryEnum.enumValues)},
  "painScore": integer 1-100 (how painful/common),
  "buildDifficulty": one of ${JSON.stringify(difficultyEnum.enumValues)},
  "targetUser": "who suffers from this",
  "suggestedSolution": "one sentence product idea",
  "keywords": ["keyword1", "keyword2", "keyword3"]
}`

  const result = await model.generateContent(prompt)
  const raw = stripMarkdownFences(result.response.text())

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error("AI returned invalid JSON")
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).problem !== "string" ||
    !isValidIndustry((parsed as Record<string, unknown>).industry) ||
    typeof (parsed as Record<string, unknown>).painScore !== "number" ||
    !isValidDifficulty((parsed as Record<string, unknown>).buildDifficulty)
  ) {
    throw new Error("AI returned unexpected structure")
  }

  const p = parsed as {
    problem: string
    industry: Industry
    painScore: number
    buildDifficulty: Difficulty
    targetUser?: string
    suggestedSolution?: string
    keywords?: string[]
  }

  await db.insert(painPoints).values({
    problem: p.problem,
    industry: p.industry,
    painScore: Math.min(100, Math.max(1, Math.round(p.painScore))),
    buildDifficulty: p.buildDifficulty,
    targetUser: p.targetUser ?? null,
    suggestedSolution: p.suggestedSolution ?? null,
    keywords: Array.isArray(p.keywords) ? p.keywords.filter((k): k is string => typeof k === 'string') : [],
    sourceType: "user",
    sourcePostIds: [],
    isPublished: true,
    trendingScore: 0,
    builderCount: 0,
    submittedBy: session.user.id,
  })
}
