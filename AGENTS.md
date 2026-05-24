# Forge — Project Brief

## What It Is
A startup pain point discovery engine. Scrapes Reddit, HN, YC 
for real pain points, processes them with Gemini AI into 
structured ideas, displays them in a clean discovery feed.

## Tech Stack
- Next.js 14
- Neon (serverless Postgres) + Drizzle ORM
- better-auth (auth — Google OAuth only)
- Gemini API (gemini-1.5-flash for bulk, pro for expansions)
- shadcn/ui + Tailwind
- Vercel (deployment)

## Core Pages
- Feed (main) — pain point cards, search, filters
- Idea Detail — full AI brief + source links + "I'm building this"
- Submit Modal — single textarea, AI structures it
- Profile — saved, submitted, building

## Data Sources
- Reddit Search API (keyword queries, no subreddit targeting)
- HN Algolia API
- YC RFS page (Cheerio scrape)

## Data Flow
Weekly cron (Vercel Cron) → fetch raw posts → deduplicate by postId → 
Gemini processes into structured painPoints → published to feed

## Database Tables (Drizzle schema)
- rawPosts: id, source, url, title, body, upvotes, fetchedAt, postId
- painPoints: id, problem, industry, painScore, buildDifficulty,
  keywords, sourcePostIds[], trendDirection, submittedBy, createdAt

## Auth Rules
- Browse feed: no auth required
- Save / Submit / "I'm building this": requires better-auth session
- Google OAuth only, no email/password

## Gemini Usage
- gemini-1.5-flash: bulk processing of raw posts
- gemini-1.5-pro: "Expand Idea" full brief generation
- Always strip markdown fences before JSON.parse
- All prompts must request pure JSON, no preamble

## Design System
- Background: #111111 (never true black)
- Surface: #1A1A1A
- Border: #2A2A2A, accent on hover: #A8FF3E
- Accent: #A8FF3E (electric green)
- Heading font: Playfair Display italic
- Body/UI font: IBM Plex Mono
- No gradients, no glassmorphism, no shadows

## Coding Conventions
- No emojis in code or comments
- Formal comments only
- CSS variables for all colors and typography
- shadcn/ui components preferred
- No inline styles