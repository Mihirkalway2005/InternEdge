# InternEdge

**AI-powered internship readiness & career acceleration platform.**

InternEdge gives students a single environment to build a verified career profile,
analyze their resume against real ATS heuristics, discover internships ranked by a
transparent matching algorithm, track applications through a persistent Kanban
pipeline, generate skill-gap-driven learning roadmaps, practice AI mock interviews
with per-answer evaluation, publish a portfolio from their live data, and watch
analytics computed from their actual activity.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS v4 |
| Auth | BetterAuth (email/password; GitHub/Google optional) |
| Database | PostgreSQL (Neon) via Prisma 7 + `@prisma/adapter-pg` |
| AI | Groq OpenAI-compatible API (`GROQ_API_KEY`), Zod-validated structured outputs |
| Storage | Pluggable storage driver (local disk by default) |
| Tests | Vitest unit tests for all deterministic engines |

## Getting started

```bash
npm install                 # also runs prisma generate
cp .env.example .env        # then fill in DATABASE_URL + BETTER_AUTH_SECRET (+ GROQ_API_KEY for AI)
npx prisma migrate deploy   # apply migrations
npm run db:seed             # companies + internships reference data
                            # add SEED_DEMO_DATA=true to .env first for demo users/fixtures
npm run dev                 # http://localhost:$PORT (default 8443)
```

### Scripts

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest engine tests
npm run lint        # oxfmt --check
npm run build       # production build
npm run db:migrate  # create/apply a migration (dev)
```

## Architecture notes

- **Identity**: every request resolves the user from the BetterAuth session cookie
  (`src/lib/session.ts`). There is no demo-user fallback — unauthenticated API calls fail closed.
- **Ownership**: user-owned rows are always filtered by `userId`; ownership failures return 404.
  See `src/lib/api-helpers.ts` (`requireUser`, `assertOwned`, `handleRoute`).
- **Validation**: all request bodies/queries go through Zod schemas. No mass assignment.
- **Deterministic engines first** (`src/lib/engine/`): internship matching, readiness score,
  skill-gap analysis and ATS sub-scores are pure, unit-tested TypeScript. The LLM layer
  (`src/lib/ai/`) adds parsing enrichment, narrative critique, roadmap content, interview
  questions/evaluation, and the contextual assistant — and degrades gracefully when no key is set.
- **Migrations**: schema changes go through `prisma migrate dev` in development and
  `prisma migrate deploy` in production. Never `db push`.
- **Seed data**: companies/internships are global reference data. Demo users and their personal
  records only seed when `SEED_DEMO_DATA=true`.

## Feature map

Signup → onboarding → profile/skills → resume upload & ATS analysis → internship discovery
with match scores → application tracker with status history → roadmap generation from skill
gaps → AI mock interviews → portfolio publishing at `/p/{slug}` → analytics & readiness history.

See `IMPLEMENTATION_PLAN.md` for the full audit that drove this architecture.
