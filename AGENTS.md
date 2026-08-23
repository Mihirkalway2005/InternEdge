# InternEdge Next.js Application

React + Next.js App Router + Tailwind CSS v4 project.

## Development Server

A Next.js development server runs on `$PORT` (default 8443).

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

- `src/app/layout.tsx` - Next.js root layout; sets up document metadata, global CSS, and the auth provider
- `src/app/page.tsx` - Main home page component mounting `src/App.tsx`
- `src/app/(auth)/` - Login, signup, and the multi-step onboarding wizard
- `src/app/(dashboard)/` - Auth-gated dashboard pages (server layout enforces session + onboarding)
- `src/app/p/[slug]/page.tsx` - Public portfolio route (only renders published portfolios)
- `src/app/api/` - REST API routes backed by Prisma + PostgreSQL
- `src/middleware.ts` - UX-level cookie gate for protected pages (APIs enforce auth independently)
- `src/lib/session.ts` - Single source of truth for the authenticated user (`getAuthSession`)
- `src/lib/api-helpers.ts` - Route conventions: `requireUser`, `parseBody`, `assertOwned`, `handleRoute`
- `src/lib/engine/` - Deterministic engines: matching, readiness, skill-gap, ATS heuristics, taxonomy (unit-tested)
- `src/lib/ai/` - Server-side AI layer: provider (Groq/OpenAI-compatible), Zod schemas, prompts, services. Never call LLMs from client code.
- `src/lib/services/` - Business services: resume pipeline, dashboard aggregate, notifier/activity
- `src/lib/storage/` - File storage abstraction (local-disk driver; swap for S3 in prod)
- `prisma/schema.prisma` - Prisma data model (PostgreSQL)
- `prisma/migrations/` - Migration history; use `prisma migrate dev/deploy`, never `db push`
- `tests/engine/` - Vitest unit tests for deterministic engines

## API Conventions (required)

1. **Identity** always from `requireUser()` (session cookie). Never trust client-supplied userIds.
2. **Validate every input** with Zod via `parseBody(req, schema)` / `parseQuery`.
3. **No mass assignment**: never spread raw bodies into Prisma calls — map validated fields explicitly.
4. **Ownership**: every user-owned read/mutation must filter by `userId` or use `assertOwned(row, userId)` BEFORE mutating. Ownership failures return 404 (not 403) to prevent enumeration.
5. Wrap handlers in `handleRoute()` for uniform error mapping; throw `ApiError(status, msg)` for expected failures.
6. Rate-limit expensive/AI endpoints via `checkRateLimit`.

## AI Layer Rules

- All LLM calls go through `src/lib/ai/provider.ts::chatJSON` with a Zod schema.
- User-supplied content (resumes, JDs, answers) is untrusted data — wrap with `guardUntrusted()`.
- Every AI feature must degrade gracefully when `GROQ_API_KEY` is unset.

## Code Quality

- Use double quotes for strings containing apostrophes, or escape them in single-quoted strings.
- Ensure JSX tags are closed and braces are balanced.
- Mark interactive client-side components with `'use client';`.
- Verify changes with: `npm run typecheck && npm test`.
