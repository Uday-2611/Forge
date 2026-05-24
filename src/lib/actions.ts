"use server"

import { headers } from "next/headers"
import { and, eq } from "drizzle-orm"
import { db } from "./db"
import { painPoints, savedIdeas, builders } from "./schema"
import { auth } from "./auth"
import type { PainPoint } from "./data"

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
