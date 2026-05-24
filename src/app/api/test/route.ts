import { db } from '@/lib/db'
import { painPoints } from '@/lib/schema'

export async function GET() {
  const result = await db.select().from(painPoints).limit(5)
  return Response.json({ success: true, data: result })
}