import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  boolean,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core'

export type SourceDetail = {
  sub: string
  title: string
  upvotes: number | null
}

export const industryEnum = pgEnum('industry', [
  'Finance',
  'Healthcare', 
  'Productivity',
  'Education',
  'Ecommerce',
  'Creator Economy',
  'Recruiting',
  'Analytics',
  'Other'
])

export const difficultyEnum = pgEnum('difficulty', [
  'Weekend',
  'Solo',
  'Team'
])

export const painPoints = pgTable('pain_points', {
  id: uuid('id').defaultRandom().primaryKey(),
  problem: text('problem').notNull(),
  industry: industryEnum('industry').notNull(),
  painScore: integer('pain_score').notNull(),
  buildDifficulty: difficultyEnum('build_difficulty').notNull(),
  targetUser: text('target_user'),
  suggestedSolution: text('suggested_solution'),
  keywords: text('keywords').array(),
  sourceType: text('source_type').notNull(), // 'reddit' | 'hn' | 'yc' | 'user'
  sourcePostIds: text('source_post_ids').array(),
  trendingScore: integer('trending_score').default(0),
  builderCount: integer('builder_count').default(0),
  isPublished: boolean('is_published').default(false),
  sourceDetail: jsonb('source_detail').$type<SourceDetail[]>(),
  submittedBy: text('submitted_by'), // Better Auth user ID, null if scraped
  createdAt: timestamp('created_at').defaultNow(),
})

export const rawPosts = pgTable('raw_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: text('post_id').notNull().unique(), // original Reddit/HN ID
  source: text('source').notNull(), // 'reddit' | 'hn' | 'yc'
  title: text('title'),
  body: text('body'),
  url: text('url'),
  upvotes: integer('upvotes').default(0),
  isProcessed: boolean('is_processed').default(false),
  fetchedAt: timestamp('fetched_at').defaultNow(),
})

export const savedIdeas = pgTable('saved_ideas', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Better Auth user ID
  painPointId: uuid('pain_point_id')
    .notNull()
    .references(() => painPoints.id),
  savedAt: timestamp('saved_at').defaultNow(),
})

export const builders = pgTable('builders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Better Auth user ID
  painPointId: uuid('pain_point_id')
    .notNull()
    .references(() => painPoints.id),
  claimedAt: timestamp('claimed_at').defaultNow(),
})