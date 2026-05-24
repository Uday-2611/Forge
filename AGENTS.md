# Forge — Project Brief

## What It Is
A startup pain point discovery engine. Scrapes Reddit, HN, YC 
for real pain points, processes them with Gemini AI into 
structured ideas, displays them in a clean discovery feed.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Neon (serverless Postgres) + Drizzle ORM 0.45
- better-auth 1.6 (auth — Google OAuth only)
- Gemini API (gemini-1.5-flash for bulk, pro for expansions)
- shadcn/ui 4 + Tailwind CSS 4
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

## Code Quality Rules
After writing or editing ANY code, always run these skills in order:
1. `/simplify` — remove unnecessary complexity, dead code, over-engineering
2. `/security-review` — catch OWASP issues, injection risks, auth gaps
3. `/code-review:code-review` — final quality and correctness pass

No code ships without all three passes complete.

## Change Summary Rule
After every prompt response or file edit, always end with a change summary:
- **What changed:** list each file and the specific modification made
- **Why:** the reason for the change (bug fix, feature, rule compliance, etc.)

Format:
```
### Change Summary
**What:** <file(s)> — <what was modified>
**Why:** <reason>
```