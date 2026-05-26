# Forge — Build TODO

Sequential task list to ship the complete application. Do tasks in order — each one depends on the previous.

---

## 1. Environment Variables

Set up all required environment variables before anything else runs.

Add to `.env.local`:

```
DATABASE_URL=            # Neon connection string
BETTER_AUTH_SECRET=      # random 32-char secret (openssl rand -base64 32)
BETTER_AUTH_URL=         # http://localhost:3000 locally, prod URL on Vercel
GOOGLE_CLIENT_ID=        # from Google Cloud Console
GOOGLE_CLIENT_SECRET=    # from Google Cloud Console
GEMINI_API_KEY=          # from Google AI Studio
PIPELINE_SECRET=         # random string, used to call /api/pipeline/run manually
CRON_SECRET=             # random string, set same value in Vercel dashboard
```

**Subtasks:**
- Create a Google Cloud project → enable Google OAuth → copy client ID + secret
- Create a Gemini API key at aistudio.google.com
- Generate `BETTER_AUTH_SECRET` and `PIPELINE_SECRET` with `openssl rand -base64 32`
- Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in Google Cloud Console

---

## 2. Database Schema Push

Push the Drizzle schema to your Neon database to create all tables.

**Subtasks:**
- Run `npm run db:push` to sync schema to Neon
- Verify in Neon dashboard that these tables exist: `pain_points`, `raw_posts`, `saved_ideas`, `builders`, plus the better-auth tables (`user`, `session`, `account`, `verification`)
- If better-auth tables are missing, run `npx better-auth migrate` separately

---

## 3. Seed Initial Data

Populate the feed with the 12 hand-crafted pain points so it's not empty on first load.

**Subtasks:**
- Run `npm run db:seed`
- Open the feed at `http://localhost:3000/feed` and verify 12 cards appear
- Check that filter, sort, and search work against live DB data

---

## 4. Google Auth End-to-End Test

Verify the full sign-in flow works locally before wiring up auth-gated features.

**Subtasks:**
- Run `npm run dev`
- Visit `http://localhost:3000/login` → click "Continue with Google" → complete OAuth flow
- Confirm redirect lands on `/feed`
- Confirm user row appears in the `user` table in Neon
- Test sign-out from the profile menu

---

## 5. Wire Up Submit Modal

The submit modal currently fakes submission (`setSubmitted(true)` on click). Wire it to the real Gemini + DB pipeline.

**Subtasks:**
- Add a `submitPainPoint(text: string)` server action in `src/lib/actions.ts`
  - Require auth session (throw if not signed in)
  - Call Gemini flash with the raw text, same prompt format as the pipeline
  - Insert result into `pain_points` table with `submittedBy = session.user.id` and `isPublished = true`
- Update `SubmitModal.tsx` to call the server action instead of `setSubmitted(true)`
- Show a loading state while Gemini processes
- Show error state if the action throws

---

## 6. Wire Up ListPanel (Saved / Building / Submissions)

The ListPanel shows only an empty state. Wire it to the real DB data.

**Subtasks:**
- Add three server actions in `src/lib/actions.ts`:
  - `getSavedPainPoints()` — join `saved_ideas` → `pain_points` for current user
  - `getBuildingPainPoints()` — join `builders` → `pain_points` for current user
  - `getSubmittedPainPoints()` — query `pain_points` where `submittedBy = session.user.id`
- Update `ListPanel.tsx` to fetch and render actual pain point cards
- Replace the hardcoded `00 total` count with real count
- Handle loading and empty states

---

## 7. Run the Pipeline Manually

Trigger the data pipeline once to pull real HN posts and populate the feed with AI-processed pain points.

**Subtasks:**
- Make sure `GEMINI_API_KEY`, `PIPELINE_SECRET`, and `DATABASE_URL` are set
- Call the endpoint:
  ```bash
  curl -X POST http://localhost:3000/api/pipeline/run \
    -H "x-pipeline-secret: YOUR_PIPELINE_SECRET"
  ```
- Check the JSON response: `{ inserted, processed, message }`
- Refresh the feed and verify new AI-generated pain points appear alongside the seeded ones

---

## 8. Add Reddit Scraper

Extend the pipeline to also fetch from Reddit Search API (no auth required).

**Subtasks:**
- Add `fetchRedditPosts(query: string)` function in the pipeline route
  - Use `https://www.reddit.com/search.json?q=<query>&sort=top&limit=25`
  - Set a proper `User-Agent` header (Reddit blocks default fetch agents)
  - Map response to the same `RawPost` shape as HN posts
- Add Reddit-specific queries to a `REDDIT_QUERIES` constant (mirror `HN_QUERIES`)
- Run Reddit and HN fetches in parallel inside `runPipeline()`
- Set `source: 'reddit'` on inserted raw posts
- Test end-to-end: trigger pipeline, verify Reddit posts appear in `raw_posts` table

---

## 9. Add "Expand Idea" Feature

The detail modal should have an "Expand Idea" button that calls Gemini pro to generate a full startup brief.

**Subtasks:**
- Add an `expandIdea(painPointId: string)` server action in `src/lib/actions.ts`
  - Call `gemini-1.5-pro` with a detailed prompt requesting: market size, competitor landscape, 90-day MVP plan, top 3 risks
  - Return the brief as a structured object (not markdown)
- Add "Expand Idea →" button to `DetailModal.tsx` (visible to all, but auth-gate the action)
- Show a loading skeleton while pro model processes (~5–10s)
- Render the expanded brief below the existing detail content
- Cache the result: store in a new `expanded_briefs` column on `pain_points` so pro is only called once per idea

---

## 10. Deploy to Vercel

Push the app live.

**Subtasks:**
- Push code to GitHub (`git push origin main`)
- Connect the repo in Vercel dashboard → import project
- Add all environment variables from step 1 in Vercel project settings
- Add `CRON_SECRET` in Vercel dashboard (Vercel sends this automatically as `Authorization: Bearer <secret>` on cron calls)
- Update `BETTER_AUTH_URL` to the production Vercel URL
- Update Google OAuth authorized redirect URIs to include `https://your-domain.vercel.app/api/auth/callback/google`
- Trigger a deploy and verify the live feed loads

---

## 11. Verify Cron Job

Confirm the weekly pipeline cron runs correctly in production.

**Subtasks:**
- In Vercel dashboard → go to project → "Cron Jobs" tab → verify the job appears with schedule `0 0 * * 0`
- Manually trigger it once from the Vercel dashboard to confirm it runs without error
- Check the function logs for the output: `{ inserted, processed, message }`

---

## 12. Feed Freshness — Soft-Archive Old Pain Points

Keep the feed fresh by soft-archiving old pain points each pipeline run. Pain point rows are never deleted so saved ideas always remain accessible from bookmarks.

**How it works:**
- Each cron/pipeline run sets `isPublished = false` on pain points older than 7 days before inserting the new batch
- Main feed only shows `isPublished = true` (already the case)
- `getSavedPainPoints` fetches via join without filtering on `isPublished`, so bookmarks always resolve

**Subtasks:**
- In `runPipeline()` (inside `src/app/api/pipeline/run/route.ts`), before inserting new pain points, run:
  ```ts
  await db.update(painPoints)
    .set({ isPublished: false })
    .where(lt(painPoints.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
  ```
  Import `lt` from `drizzle-orm`
- Change cron schedule in `vercel.json` from `0 0 * * 0` (weekly) to `0 0 */4 * *` (every 4 days) for fresher content
- Verify: after triggering pipeline, old pain points have `isPublished = false` in Neon dashboard
- Verify: saved ideas panel still shows archived pain points correctly

---

## Future Enhancements (Post-Launch)

### Expand Idea — AI Startup Brief

Add an "Expand Idea →" button to `DetailModal.tsx` that calls Gemini Pro to generate a full startup brief on demand. Deferred to avoid Gemini Pro API costs at launch.

**Implementation notes (already researched):**
- Add `expandedBrief: jsonb` column to `pain_points` (cache result so Pro is called once per idea)
- Add `expandIdea(painPointId)` server action — auth-gated, calls `gemini-1.5-pro`, returns `{ marketSize, competitors[], mvpPlan, risks[] }`
- Show loading skeleton (~5–10s) while Pro model processes
- Render brief below existing detail content in a 2-col grid
- Only enable after launch when API costs are acceptable

---

## 13. YC RFS Scraper (Optional, Post-Launch)

Add Y Combinator Requests for Startups as a third data source.

**Subtasks:**
- Add a `fetchYCRFS()` function that fetches `https://www.ycombinator.com/rfs` and parses it with a lightweight HTML parser (e.g. `node-html-parser`)
- Extract each RFS item: title + description
- Insert into `raw_posts` with `source: 'yc'`
- Add to `runPipeline()` alongside HN and Reddit fetches
- Each YC item counts as one post — no batching needed, there are ~20 items total
