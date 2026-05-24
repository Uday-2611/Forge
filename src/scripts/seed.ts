import "dotenv/config"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { painPoints } from "../lib/schema"
import { PAIN_POINTS } from "../lib/data"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function seed() {
  console.log("Seeding pain_points...")

  await db.delete(painPoints)

  for (const p of PAIN_POINTS) {
    await db.insert(painPoints).values({
      problem: p.title,
      industry: p.industry as any,
      painScore: Math.round(p.score * 10),
      buildDifficulty: p.difficulty as any,
      targetUser: p.target,
      suggestedSolution: p.solution,
      keywords: p.keywords,
      sourceType: p.source,
      sourceDetail: p.sourceDetail as any,
      builderCount: p.builders,
      trendingScore: p.builders,
      isPublished: true,
    })
  }

  console.log(`Seeded ${PAIN_POINTS.length} pain points.`)
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
