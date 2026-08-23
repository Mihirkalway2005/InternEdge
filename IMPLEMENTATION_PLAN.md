# InternEdge — Production Implementation Plan

> Status: Approved implementation plan for branch `feat/completion`.
> Source of truth: full repository audit performed 2026-08-23 + `InternEdge_Project_Details.md`.

---

## 1. Executive Summary

InternEdge is currently a **polished prototype**: a keynote-style marketing site, a dashboard shell with 11 pages, ~19 REST routes, BetterAuth scaffolding, and a seeded Neon Postgres database (20 companies, 40 internships, 7 demo users). Almost every user-facing number is hardcoded, every AI feature is simulated, and the API layer contains critical authorization flaws.

This plan converts it into a genuinely functional SaaS:

1. **Fix security first** — remove demo-user fallback, add ownership checks, kill mass assignment, protect routes.
2. **Make the database authoritative** — extend the Prisma schema (migrations, not `db push`), make onboarding/profile/skills server-persisted.
3. **Build a real AI layer** — Groq-backed (key already provisioned in `.env`), provider-agnostic via env config, structured outputs validated with Zod.
4. **Replace every fake metric** with deterministic engines (matching, ATS, readiness, analytics) whose inputs are real user records.
5. **Wire every page** to real APIs with loading/empty/error states; a brand-new account must see useful empty states, never fake data.

---

## 2. Current Architecture Audit

### Stack (verified)
- Next.js 15 (App Router) + React 19 + Tailwind v4 (`@tailwindcss/postcss`)
- Prisma 7 + `@prisma/adapter-pg` → **Neon Postgres** (`ep-dry-violet-…neon.tech/neondb`), generated client at `src/generated/prisma`
- BetterAuth 1.6 (email+password + GitHub/Google social) with Prisma adapter
- No test framework, no zod, no middleware.ts, no migrations dir (schema was `db push`ed)
- `next.config.mjs` ignores TS errors and ESLint during builds
- `.env`: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `GROQ_API_KEY` (**unused anywhere**)

### What already works
- Landing keynote (`src/App.tsx`, chapters) — pure marketing UI, keep as-is.
- BetterAuth email signup/login/logout round-trip works (`AuthProvider` → `authClient`).
- Basic CRUD reads are scoped by `userId` on collection GETs (profile, skills, projects, experiences, resumes, applications, roadmaps, interviews, notifications, activity-logs).
- Seed pipeline populates companies/internships/demo users idempotently (skips if companies exist).

### What is broken / fake (the core findings)
| # | Finding | Location | Severity |
|---|---------|----------|----------|
| A1 | **Demo-user fallback**: unauthenticated requests resolve to `alex.student@university.edu`'s ID → full cross-user data access | `src/lib/session.ts:15-22` | Critical |
| A2 | **IDOR everywhere**: all `[id]` PATCH/DELETE do `prisma.X.update({ where: { id } })` with no ownership predicate (applications, roadmap-tasks, notifications, projects, experiences, skills, roadmaps, internships) | e.g. `src/app/api/applications/[id]/route.ts:15`, `roadmap-tasks/[id]/route.ts:15` | Critical |
| A3 | **Mass assignment**: `{ ...body }` spread directly into Prisma creates/updates on nearly every POST/PUT/PATCH | all API routes | Critical |
| A4 | `/api/internships` POST is fully unauthenticated (anyone can create listings) | `internships/route.ts:42` | High |
| A5 | Hardcoded fallback auth secret + fake OAuth client IDs silently enabled | `src/lib/auth.ts:11-27` | High |
| A6 | Onboarding gate is client-only and defaults to `isOnboarded = true`; no route protection; `/dashboard` reachable logged-out | `src/providers/AuthProvider.tsx:60`, no `middleware.ts` | High |
| A7 | Every dashboard metric is hardcoded: readiness 88%, ATS 92, "+6% this week", weekly goal 4/5, OpenAI/Vercel/Stripe pipeline cards, roadmap tasks, analytics "Top 5% Stanford cohort", "12 Days Active Streak" | `dashboard/page.tsx`, `analytics/page.tsx`, `resume/page.tsx`, etc. | High |
| A8 | Applications Kanban renders `INITIAL_APPLICATIONS` fake array when DB empty; "Add Application" inserts a local-only Figma row that never persists | `applications/page.tsx:26-66,152-164` | High |
| A9 | Mock interviews use 3 hardcoded questions, always score **94**, persist fabricated results; no LLM anywhere | `interviews/page.tsx:29-63,221` | High |
| A10 | Career assistant replies from canned `setTimeout` strings addressed to "Alex" | `components/ai/CareerAssistantDrawer.tsx:59-84` | High |
| A11 | Resume page has **no upload**; shows "Alex_Rivera_Resume_2026.pdf", fixed sub-scores; Builder tab is static text | `resume/page.tsx` | High |
| A12 | Internship match scores are computed as `90 + title.length % 7` | `dashboard/page.tsx:60`, `internships/page.tsx:120` | High |
| A13 | Portfolio builder hardcodes Alex Rivera; "Publish" button is a no-op | `portfolio/page.tsx:65-67` | Medium |
| A14 | Internships list falls back to 5 `SAMPLE_INTERNSHIPS`; filters are client-side only; save/bookmark is local state only | `internships/page.tsx:19-97,143-147` | Medium |
| A15 | `apiJson` swallows all errors → `null`; no loading/error/empty state discipline | `src/lib/api-client.ts` | Medium |
| A16 | Roadmap page falls back to 5 fake tasks; task toggle heuristic `id.startsWith("t")` decides whether to hit API | `roadmap/page.tsx:27-73,112` | Medium |
| A17 | Notifications page exists but nothing ever *creates* notifications (except seed); activity logs same | schema + pages | Medium |
| A18 | No file storage, parsing, or analysis pipeline for resumes (schema fields `fileId/parsedText/atsScore` exist but unused by UI) | — | High |
| A19 | Seeded user-specific rows (resumes w/ ATS scores, applications across all 7 statuses, interviews with transcripts, notifications) masquerade as live data for any new account that hits demo-user path | `prisma/seed.ts` | High |
| A20 | No input validation library; enums cast with `as never`; no rate limiting; no structured logging | all routes | Medium |

### Architectural gaps to fix before features
1. Client/server boundary: dashboard pages are `"use client"` fetching JSON — acceptable pattern, but they need an authenticated server wrapper (layout) and honest error handling.
2. Business logic must move out of components into `src/lib/*` services so both API and UI can reuse it (matching, scoring).
3. Session identity must have exactly one source: BetterAuth session. Kill the demo-user path entirely.
4. Schema lacks: onboarding completion marker, target roles/locations preferences, resume structured parse + analysis detail, interview session state, application status history, readiness history, portfolio entity, notification dedupe/link metadata.

---

## 3. Complete Feature Inventory (as found)

| Feature | Where | Classification |
|---|---|---|
| Email/password signup+login+logout | `(auth)` pages, AuthProvider, `/api/auth/[...all]` | Functional (needs secret/OAuth hygiene) |
| Social OAuth (GitHub/Google) | `auth.ts` socialProviders | Broken (fake creds; disable unless configured) |
| Route protection | none | Missing |
| Onboarding wizard | `(auth)/onboarding/page.tsx` (3 steps, prefilled fake values) | Partially functional (persists profile fields + skills at final step; resume step is simulated; no server-side onboarding state) |
| Unified profile | `/api/profile` GET/PUT | Partially functional (mass assignment, missing target-role/location prefs, no validation) |
| Skills CRUD | `/api/skills`, profile page | Partially functional (no ownership checks on `[id]`, no dedupe) |
| Projects / Experience CRUD | `/api/projects`, `/api/experiences` | Partially functional (same issues) |
| Resume upload/parse/analyze/improve | resume page | **UI only** (no upload, no pipeline, hardcoded scores) |
| Resume builder/export PDF | resume page tab | UI only |
| Internship discovery/search/filter | internships page | Partially functional (DB-backed list, but sample fallback, client-side filtering, fake match %) |
| Internship save/bookmark | internships page | UI only (local state) |
| Matching engine | inline `90 + len % 7` | Hardcoded |
| Application tracker Kanban | applications page | Partially functional (stage moves + notes PATCH through, but fake initial data, fake add, IDOR) |
| Skill-gap analysis | not implemented | Missing backend |
| Roadmap generation | roadmap page | Partially functional (manual tasks CRUD; no generation; fake fallback) |
| Roadmap tasks | `/api/roadmap-tasks/[id]` | Partially functional (IDOR, no progress recalc) |
| Readiness score | dashboard card | Hardcoded (88%) |
| Mock interviews | interviews page | UI only + writes fabricated DB rows (hardcoded 94) |
| Portfolio generator | portfolio page | UI only (hardcoded Alex Rivera; publish no-op) |
| Analytics | analytics page + `/api/analytics` | Partially functional (4 real aggregates; rest hardcoded) |
| AI career assistant | drawer | UI only (canned responses) |
| Notifications | notifications page + API | Partially functional (list/mark-read work incl. mark-all; nothing generates events; IDOR on single update) |
| Activity log | activity-logs API | Partially functional (nothing writes logs) |
| Admin panel | documented in project details | Missing entirely (recommend deferring; enforce admin role on internship/company writes now) |

---

## 4. Functional vs Mocked Feature Matrix

Legend: ✅ real · 🟡 partial · ❌ mock/missing

| Capability | Backend persistence | Auth-scoped | Validated | Real logic | Real AI |
|---|---|---|---|---|---|
| Signup/Login | ✅ | ✅ | ❌ | ✅ | – |
| Route protection | ❌ (none) | ❌ | – | – | – |
| Profile | ✅ | 🟡 (demo fallback) | ❌ | ✅ | – |
| Skills/Projects/Experience | ✅ | 🟡 | ❌ | ✅ | – |
| Resume pipeline | ❌ | – | – | ❌ | ❌ |
| Internships list | ✅ | n/a (public read) | ❌ | ❌ fake match | – |
| Applications | ✅ | 🟡 +IDOR | ❌ | 🟡 | – |
| Roadmap/tasks | ✅ | 🟡 +IDOR | ❌ | ❌ no generation | ❌ |
| Interviews | ✅ (fake rows) | ✅ | ❌ | ❌ | ❌ |
| Portfolio | ❌ | – | – | ❌ | ❌ |
| Analytics | 🟡 | ✅ | – | 🟡 partial | – |
| Assistant | ❌ | – | – | ❌ | ❌ |
| Notifications | ✅ | 🟡 +IDOR | ❌ | ❌ no producers | – |

---

## 5. Critical Problems / Technical Debt

See §2 table (A1–A20). The three blockers for everything else:
1. **Identity**: one source of truth (BetterAuth session), zero fallbacks (A1).
2. **Authorization**: every mutation filtered by `userId` (A2/A3/A4).
3. **Honesty of UI**: no component may render a number that didn't come from the DB (A7–A13).

---

## 6. Target Architecture

```
┌────────────────────────────── Browser ──────────────────────────────┐
│  Next.js App Router (RSC shells + client islands, Tailwind v4)      │
│  auth-client.ts (BetterAuth)   api-client.ts (+error/loading types) │
└──────────────┬──────────────────────────────┬───────────────────────┘
               │ session cookie                │ fetch JSON/multipart
┌──────────────▼──────────────────────────────▼───────────────────────┐
│ src/middleware.ts  (edge: cookie-gate /dashboard,/onboarding)        │
│ Server layout (auth.ts session → redirect /login or /onboarding)     │
├──────────────────────────────────────────────────────────────────────┤
│ API layer  src/app/api/**  (thin: auth → zod validate → service)     │
│   lib/api-helpers.ts  requireUser() ok()/fail() parseBody()          │
├──────────────┬───────────────────────────┬───────────────────────────┤
│ Services     │ AI layer                  │ Storage                    │
│ lib/engine/  │ lib/ai/provider.ts (Groq  │ lib/storage.ts             │
│  matching    │  OpenAI-compatible REST)  │  local-disk driver now,    │
│  readiness   │ lib/ai/schemas.ts (Zod)   │  S3 driver interface later │
│  skillgap    │ lib/ai/prompts.ts         │                            │
│  ats         │ lib/ai/services/*.ts      │                            │
│  analytics   │  resume|improve|match-    │                            │
│  notify      │   explainer|roadmap|inter-│                            │
│              │  view-gen|eval|assistant  │                            │
├──────────────┴───────────────────────────┴───────────────────────────┤
│ Prisma 7 (src/lib/db.ts singleton, pg adapter) → Neon PostgreSQL     │
│ Migrations in prisma/migrations (migrate dev/deploy workflow)         │
└──────────────────────────────────────────────────────────────────────┘
Public portfolio: /p/[slug] RSC route reading published Portfolio rows.
Background jobs: deferred; deadline/task-due sweeps run lazily & idempotently
on authenticated loads (documented upgrade path: Vercel Cron / pg-boss).
```

---

## 7. Database Architecture

### Existing models kept (with extensions)
- **User** — unchanged (+ relation to portfolios).
- **Profile** — add: `targetRoles String[] @default([])`, `preferredLocations String[] @default([])`, `preferredWorkType WorkType?`, `onboardedAt DateTime?` (server source of truth for onboarding), `targetRole String?` kept for compat.
- **Skill** — add `@@unique([userId, name])`; add `updatedAt`.
- **Resume** — add: `fileName String?`, `mimeType String?`, `sizeBytes Int?`, `storageKey String?` (object key, not binary), `structured Json?` (parsed representation), `analysis Json?` (ATS breakdown: dimension scores, keywords matched/missing, suggestions), `status ResumeStatus {uploaded, parsed, analyzed, failed}` + `statusMessage String?`. Keep `atsScore`, `keywords`, `missingKeywords` denormalized for fast dashboards.
- **Application** — add `savedAt DateTime @default(now())`, `statusUpdatedAt DateTime @default(now())`; keep unique `@@unique([userId, internshipId])` (one application per internship per user).
- **New ApplicationEvent** — status history: `id, applicationId FK cascade, fromStatus ApplicationStatus?, toStatus ApplicationStatus, note String?, createdAt` + index. Powers funnel/time-in-stage analytics.
- **RoadmapTask** — add `priority Int @default(2)` (1 high/3 low), `skillName String?`, `resourceUrl String?`, `completedAt DateTime?`, `status` derived from completed (keep boolean for simplicity).
- **Interview** — rework into session model: add `status InterviewStatus {in_progress, completed, abandoned}`, `difficulty String?`, `roleContext String?`, `startedAt DateTime @default(now())`, `completedAt DateTime?`, `durationSec Int?`. Keep `questions Json` as full transcript: `[{question, answer, score, feedback, strengths[], improvements[], askedAt}]`, `score Float` = aggregate (0 while in progress), `feedback String` = overall summary.
- **Notification** — add `link String?`, `dedupeKey String?` + `@@unique([userId, dedupeKey])` for idempotent event creation.
- **ActivityLog** — unchanged shape; write events from services only.
- **Company / Internship** — add to Internship: `source String @default("seed")`, `isActive Boolean @default(true)`, `postedAt DateTime @default(now())`, `stipendMin Int?`, `stipendMax Int?` (keep legacy `salary` string). Public read, admin-only write.
- **New ReadinessSnapshot** — `id, userId FK, score Float, components Json, createdAt` + index `(userId, createdAt)`. History for analytics velocity.
- **New Portfolio** — `id, userId FK, slug @unique, headline, bio, data Json (render payload), isPublic Boolean @default(false), publishedAt?, createdAt, updatedAt`.

### Migration workflow
- Dev: `prisma migrate dev --name <change>` against Neon dev branch DB (commits migration SQL to repo).
- Prod: `prisma migrate deploy` in release step. Never `db push`.
- Baseline: init migration capturing current schema, then additive migrations per phase.

---

## 8. Authentication Architecture

- Single identity source: `auth.api.getSession({ headers })` via `src/lib/session.ts::getAuthSession()` returning `{ session, user } | null`. **Delete demo-user fallback.**
- API guard: `requireUser()` helper returns typed 401 response on failure; handlers destructure `{ userId }` from it.
- Middleware (`src/middleware.ts`, edge): presence check of BetterAuth session cookie (`better-auth.session_token`) gates `/dashboard|/applications|/internships|/interviews|/portfolio|/profile|/resume|/roadmap|/analytics|/notifications` → redirect `/login?next=…`; `/login|/signup` when authed → `/dashboard`. Cookie presence is UX only; server layout does real DB-backed gating (session + `profile.onboardedAt`) since middleware can't query Postgres from edge.
- Dashboard group becomes server layout: fetch session; if none → redirect login; if profile missing/onboardedAt null and path ≠ onboarding → redirect onboarding.
- Password policy enforced at API (min 8 chars); BetterAuth handles hashing/expiration.
- OAuth providers configured **only if** env keys present (no more fake creds); buttons hidden when disabled.
- Role: `User.role` trusted **only server-side**; admin-only mutations check `user.role === "admin"` server-side. No client role spoofing possible since client value is display-only.

### IDOR prevention rule
Every read/mutation on a user-owned row must include `where: { id, userId }` (or verify `row.userId === session.user.id` after fetch) — enforced by convention + code review checklist in AGENTS.md.

---

## 9. API Architecture

Standard envelope: success → resource JSON (or `{ items, total }` for lists); error → `{ error: string, details?: unknown }` with proper status (400 validation, 401 unauthenticated, 403 forbidden/ownership, 404 not-found-or-not-owned, 409 conflict, 429 rate-limited, 500 fallback logged).

Zod validates every body/query param. Routes become thin controllers calling services.

| Route (new/changed) | Methods | Auth | Notes |
|---|---|---|---|
| `/api/auth/[...all]` | * | public | BetterAuth handler (unchanged) |
| `/api/profile` | GET, PUT | required | PUT via Zod profileSchema incl. targetRoles[], preferredLocations[], preferredWorkType, sets onboardedAt when completing |
| `/api/skills`(+`[id]`) | GET, POST, DELETE | required | normalize name casing, upsert-dedupe, ownership filter |
| `/api/projects`(+`[id]`) | GET, POST, PATCH, DELETE | required | ownership filter, Zod schemas |
| `/api/experiences`(+`[id]`) | GET, POST, DELETE | required | same |
| `/api/resumes` | GET, POST(multipart) | required | POST = upload → storage.put → pdf-parse → structure → persist(status=parsed) → enqueue-inline analyze → return resume+analysis; GET includes latest analysis |
| `/api/resumes/[id]/analyze` | POST | required | re-run ATS+LLM analysis, persists ResumeAnalysis |
| `/api/resumes/[id]/improve` | POST body `{targetRole?, jdText?}` | required | returns constrained improvement suggestions (no auto-overwrite), persisted inside analysis.improvements |
| `/api/resumes/primary` | PATCH | required | set isPrimary |
| `/api/internships` | GET | optional-auth | public catalog + per-item match score when authed (query: q, workType, location, minStipend, skill, sort=match\|deadline, page) |
| `/api/internships/[id]` | GET | optional | detail + match breakdown when authed |
| `/api/companies` | GET | public | reference data |
| `/api/applications` | GET, POST | required | POST `{internshipId, status?=saved, notes?}` → creates Application + ApplicationEvent(saved/applied) + ActivityLog; GET grouped by status |
| `/api/applications/[id]` | GET, PATCH, DELETE | required+owner | PATCH status → ApplicationEvent transition record + notification; notes/dates |
| `/api/roadmaps` | GET, POST(generate) | required | POST triggers roadmap-generation service from skill gaps (persist versioned roadmaps, archive old active) |
| `/api/roadmaps/[id]` | GET, DELETE | required+owner | |
| `/api/roadmaps/tasks` | POST | required+owner(via roadmap) | create manual task |
| `/api/roadmaps/tasks/[id]` | PATCH, DELETE | required+owner | toggle updates roadmap.overallProgress + completedAt + ActivityLog |
| `/api/interviews` | GET, POST(start) | required | POST `{track, difficulty, roleContext?}` → LLM question set (fallback bank) → Interview(in_progress) |
| `/api/interviews/[id]` | GET, DELETE | required+owner | transcript + per-question results |
| `/api/interviews/[id]/answer` | POST | required+owner | evaluates current answer via LLM → stores result, advances index |
| `/api/interviews/[id]/complete` | POST | required+owner | aggregates score/feedback, status=completed, notification + snapshot refresh |
| `/api/analytics` | GET | required | all metrics SQL-computed (see §12 Phase 9 spec) |
| `/api/dashboard` | GET | required | single aggregate powering dashboard cards (readiness, ATS, apps by stage, today's tasks, top matches, upcoming deadlines, recent activity) |
| `/api/notifications` | GET, PATCH(mark read/all) | required+owner | |
| `/api/activity-logs` | GET, POST | required | POST restricted to internal service actions (kept for explicit user-event logging) |
| `/api/portfolio` | GET, PUT, POST(publish/unpublish) | required | builds payload from profile/skills/projects/experience/resume; slug = username-ish unique |
| `/api/assistant/chat` | POST | required | persists Conversation-less messages in ActivityLog-lite table? → new `AssistantMessage` table (conversationId, role, content) ; context built server-side from user's own data |
| `/p/[slug]` | GET | public | RSC portfolio render (isPublic only), SEO metadata |

Rate limiting: lightweight in-memory token bucket per IP+route-class (`lib/rate-limit.ts`) for AI + auth endpoints (documented swap to Upstash Redis in prod).

---

## 10. AI Architecture

- **Provider**: Groq (OpenAI-compatible `POST {LLM_BASE_URL}/chat/completions`, model default `llama-3.3-70b-versatile`, configurable via `LLM_MODEL`). Zero SDK dependency — plain `fetch` with timeout via `AbortController`.
- **Config**: `src/lib/ai/provider.ts` — `isAIEnabled()`, `chatJSON<T>({system, user, schema, maxTokens})` doing: request → strip fences → JSON.parse → Zod validate → one repair retry on failure → throw typed `AIServiceError`. If no key/disabled: callers fall back to deterministic engines (every feature must work without AI).
- **Schemas** (`src/lib/ai/schemas.ts`): `ParsedResumeSchema`, `ATSAnalysisSchema` (dimension scores 0–100: keywordCoverage, formatting, impactVerbs, quantification, sectionCompleteness, relevanceToRole; matchedKeywords[], missingKeywords[], suggestions[{title,detail,priority}]), `ImprovementSetSchema` (per-section suggestions preserving facts: originalText→suggestedRewrite + rationale + confidence, flagged additions require user confirmation), `RoadmapPlanSchema` (weeks[] → tasks[{title,detail,category,skillName,priority,week,resourceUrl}]), `InterviewQuestionsSchema` (questions[{text, rubricKeywords[]}]), `AnswerEvaluationSchema` (score 0–100, strengths[], improvements[], followUp?), `AssistantReplySchema` ({answer, suggestedActions[]}).
- **Prompt-injection defense**: uploaded resume text and JD text wrapped in delimiters with explicit "data, not instructions" system framing; assistant context assembled server-side only; outputs schema-validated; temperature ≤ 0.4 for analytic tasks.
- **Services** (`src/lib/ai/services/*.ts`): resumeParser (heuristic regex extraction first, LLM enrichment), resumeAnalyzer, resumeImprover, roadmapGenerator, interviewQuestionGenerator, answerEvaluator, careerAssistant (context-builder pulls compact user summary ≤ 1200 tokens).
- Deterministic-first principle: matching, readiness, skill-gap, analytics, funnel = pure TS in `src/lib/engine/*` (unit-tested); LLM used where language understanding adds value (parse enrich, analysis narrative, roadmap content, questions/evaluation, assistant).

---

## 11. File / Resume Architecture

- Upload: `POST /api/resumes` multipart (PDF only v1, ≤ 5 MB, `%PDF-` magic-byte sniff). Stored via `StorageService` (`lib/storage/local.ts`): writes to `.data/uploads/{userId}/{resumeId}.pdf` (gitignored); interface ready for S3/R2 driver. Metadata + extracted text + structured JSON in Postgres (never binaries).
- Extraction: `pdf-parse` (pure JS, Node runtime route). Failure → status=failed + friendly retry UI.
- Structuring: deterministic section heuristics (contact/email/links regex, education/experience/project/skill section headers) then optional LLM normalization into `StructuredResumeSchema`; both stored (`structured`), provenance flagged.
- Analysis: deterministic ATS heuristics (keyword coverage vs role taxonomy, quantification regex, action-verb list, section completeness, length) produce base scores; LLM adds relevance critique + suggestions; final weighted composite persisted to `Resume.analysis` + `atsScore` + keyword arrays.

---

## 12. Detailed Feature-by-Feature Implementation Plan

### Phase 1 — Foundation (security + conventions)
Files: `src/lib/session.ts` (rewrite), `src/lib/auth.ts` (remove fallback secrets/creds; conditional social), `src/lib/api-helpers.ts` (new: requireUser, parseJson(schema), ok/fail wrappers, withRoute(handler)), `src/middleware.ts` (new), `src/lib/rate-limit.ts` (new), `.env.example` (new), `next.config.mjs` (stop ignoring TS errors once types fixed), `AGENTS.md` (add API conventions + ownership checklist).
Acceptance: logged-out `curl /api/applications` → 401 (not demo data); PATCHing another user's application id → 404; `npm run build` typechecks.

### Phase 2 — Schema + migrations
As §7. Files: `prisma/schema.prisma`, `prisma/migrations/*` (via `prisma migrate dev`), regenerate client.
Acceptance: `npx prisma migrate dev` clean; old pages still render against extended schema.

### Phase 3 — Identity surfaces (onboarding/profile/skills)
- Rewrite `(auth)/onboarding/page.tsx`: remove fake prefills (Stanford/Alex Rivera), real form state, PUT `/api/profile` per step (server-persisted so user can resume), skills POSTed individually, final step sets `onboardedAt` (server), then router.push dashboard. Loading/error states per submit.
- Dashboard server layout gate (session + onboardedAt).
- Profile page: load real profile/skills/projects/experiences; forms PATCH through validated APIs with optimistic UI + rollback; empty-state CTAs.
Acceptance: brand-new signup → forced onboarding → profile row with onboardedAt set → dashboard personalized ("Welcome back, {name}").

### Phase 4 — Resume intelligence
Implement §9 resume endpoints + §11 pipeline. Frontend: dropzone upload (multipart), processing stepper (upload→extract→analyze), score dial + dimension cards + suggestions list all from `Resume.analysis`; improve tab calls improve endpoint showing diff-style suggestion cards user can copy/accept (acceptance = appends chosen rewrite into a "final notes" field stored on resume record); empty state without resume; failure state with retry.
Acceptance: uploading a real PDF yields parsed text + non-random, reproducible ATS breakdown persisted in DB and rendered.

### Phase 5 — Internship engine
- `src/lib/engine/matching.ts`: deterministic `scoreInternship(userContext, internship)` → {score 0–100, matchedSkills[], missingSkills[], reasons[]} using weights: skill overlap .40 (proficiency-weighted Jaccard on normalized tokens), role-title alignment .20 (targetRoles token overlap incl. description), location/workType preference .15, grad-year eligibility .10, deadline freshness .05, resume-keyword overlap .10. Unit tests with fixtures.
- Internships page: server-driven search/filter/pagination (query params), real match badges + "why" popover from breakdown, Save → POST /api/applications {status:saved} with optimistic bookmark, detail pane from API.
- Admin-guard POST /api/internships (admin only) for future ingestion; seed remains dev-only source.
Acceptance: two different users see different match scores for the same listing consistent with their profiles; saving persists.

### Phase 6 — Applications tracker
Real Kanban: initial data only from API (empty columns allowed); Add flow picks from saved/bookmarked internships (modal w/ search); drag/fallback quick-move persists PATCH → ApplicationEvent; delete; notes autosave (debounced); deadlines shown from internship.deadline; funnel counts from groupBy. Empty state guides to internships.
Acceptance: reload-safe; events recorded; another user's app id → 404.

### Phase 7 — Skill intelligence (gap → roadmap → readiness)
- `src/lib/engine/skillgap.ts`: derive demanded skills from target roles taxonomy + saved/target internships' requiredSkills; compare with user Skill levels (beginner=.25…expert=1) → gaps sorted by demand frequency × deficiency.
- `POST /api/roadmaps {regenerate?}`: builds plan via LLM (RoadmapPlanSchema) grounded in computed gaps; persists as new Roadmap (archive previous actives); tasks created with week/priority/skillName. Without AI: deterministic template roadmap from gap list.
- Task toggle recalcs overallProgress transactionally; dashboard "today tasks" from dueDate<=today && !completed.
- `src/lib/engine/readiness.ts`: composite = .30 latest ATS + .20 skill coverage vs target role + .15 projects signal + .10 experience signal + .15 avg interview + .05 roadmap progress + .05 application activity; snapshots written on meaningful events (analysis, interview complete, task complete — throttled 1/day) → ReadinessSnapshot history.
Acceptance: dashboard readiness equals engine output and changes after completing tasks/uploading better resume; history rows exist.

### Phase 8 — AI mock interviews
Flow per §9 endpoints. Question count by track (technical/coding 5, behavioral/hr 4). Evaluator returns score/strengths/improvements/followUp (follow-up consumed immediately as next prompt when present, else next banked question). Aggregate = mean(answer scores). Persist transcript incrementally (answers survive refresh). History list + detail view. Notification + ActivityLog on completion.
Acceptance: full session with ≥3 distinct evaluated answers persisted; scores vary with answer quality (sanity-checked manually); works with AI disabled via fallback bank + heuristic evaluator (keyword rubric coverage) clearly labeled "heuristic mode".

### Phase 9 — Portfolio
`Portfolio` row per §7. Builder page renders live preview from real profile/projects/skills/experience; Publish toggles isPublic + slug; shareable URL `/p/[slug]` (public RSC, metadata tags, 404 when private/missing). Regenerate pulls latest data.
Acceptance: incognito visit to /p/{slug} renders published portfolio of correct user; unpublish 404s.

### Phase 10 — Analytics
`/api/analytics` computes (Prisma aggregations): applicationsByStatus funnel, weekly applications series (last 8 weeks, raw SQL date_trunc), conversion rates (offer÷applied, interview÷applied), avg + best interview trend (last 10), ATS progression (per-resume scores timeline), roadmap completion, readiness velocity (snapshot deltas), learning streak (distinct days with task completions/activities last 30d). Page renders SVG bar/line charts (hand-rolled, no chart dep) + honest empty states. All numbers traceable to queries documented in code comments-free naming (self-evident function names like `computeFunnel`).
Acceptance: every displayed number reproducible via direct DB query.

### Phase 11 — Career assistant
`AssistantMessage` table; POST /api/assistant/chat builds compact context (profile digest, top 5 matches summary, app counts by stage, roadmap %, latest ATS) + rolling window (last 10 msgs) → Groq → validated reply + suggested action chips (e.g. open roadmap). Drawer rewritten: real streaming-less fetch, loading dots, error retry, conversation persisted per user. Strict isolation: context builder takes userId from session only.
Acceptance: assistant references actual user data; second test account cannot elicit first account's info.

### Phase 12 — Notifications & activity
`lib/services/notifier.ts`: `notify(userId, type, title, message, link?, dedupeKey?)` idempotent via dedupeKey unique. Producers: application stage change, interview completed, resume analyzed, roadmap generated, deadline sweep (lazy: on dashboard load find internships with applications in active stages & deadline within 72h → notify once via dedupeKey `deadline:{appId}:{yyyy-mm-dd}`), task due sweep similar. ActivityLog written by services (application_created, status_changed, resume_uploaded, analysis_completed, interview_completed, roadmap_generated, task_completed, portfolio_published).
Acceptance: performing actions produces correct feed entries; sweeps don't duplicate.

---

## 13. Phased Development Roadmap
Order (dependency-driven, supersedes §29 numbering): P1 Foundation → P2 Schema → P3 Identity surfaces → P4 Resume → P5 Internships → P6 Applications → P7 Skill intelligence → P8 Interviews → P9 Portfolio → P10 Analytics → P11 Assistant → P12 Notifications/activity woven into P5–P10 producers → Hardening (tests, seed refactor, docs, rate limits, logging) continuous.

Each phase ends with: green build (`tsc --noEmit`), lint pass, manual smoke via dev server, git commit + push to `feat/completion`.

---

## 14. Exact Files to Create/Modify

Create:
- `src/middleware.ts`, `src/lib/api-helpers.ts`, `src/lib/rate-limit.ts`, `.env.example`
- `src/lib/ai/provider.ts`, `src/lib/ai/schemas.ts`, `src/lib/ai/prompts.ts`
- `src/lib/ai/services/{resumeParser,resumeAnalyzer,resumeImprover,roadmapGenerator,interviewer,answerEvaluator,careerAssistant}.ts`
- `src/lib/engine/{matching,readiness,skillgap,ats-heuristics,analytics,taxonomy}.ts`
- `src/lib/services/{notifier,activity,application-service,resume-pipeline,interview-service,portfolio-service,dashboard-service}.ts`
- `src/lib/storage/{index.ts,local.ts}`
- API routes: `resumes/[id]/analyze`, `resumes/[id]/improve`, `resumes/primary`, `interviews/[id]/answer`, `interviews/[id]/complete`, `interviews/[id]/route`, `roadmaps/tasks/route`, `dashboard/route`, `assistant/chat/route`, `portfolio/route`
- `src/app/(dashboard)/layout.tsx` server wrapper + `DashboardChrome` client component
- `src/app/p/[slug]/page.tsx`
- `tests/engine/*.test.ts` + vitest config
- `scripts/dbcheck.mts` (already), `scripts/smoke.mts`

Modify (rewire to real data): all `(dashboard)/pages`, `(auth)/onboarding`, `providers/AuthProvider.tsx` (remove isOnboarded client state + fake defaults; expose real session), `lib/api-client.ts` (typed results incl. error), `components/ai/CareerAssistantDrawer.tsx`, `prisma/schema.prisma`, `prisma/seed.ts` (split global vs demo-user fixtures behind `SEED_DEMO_DATA` flag), `package.json` (zod, pdf-parse, vitest deps), `AGENTS.md`, root `README` section.

Delete/neutralize: demo-user fallback, all hardcoded metric blocks, SAMPLE_INTERNSHIPS/INITIAL_APPLICATIONS/QUESTIONS consts, fake prefill values in onboarding.

---

## 15. Database Migration Plan
1. `prisma migrate dev --name baseline_current_schema` (capture existing).
2. `--name phase2_user_preferences_and_resume_pipeline` (Profile prefs/onboardedAt; Resume pipeline fields/status enum; unique skill; application savedAt/statusUpdatedAt + unique pair).
3. `--name phase3_interview_sessions_history_portfolio` (Interview rework, ApplicationEvent, ReadinessSnapshot, Portfolio, Notification dedupe/link, Internship source flags).
Apply forward-only in prod via `prisma migrate deploy`; destructive changes avoided (columns nullable/defaulted).

## 16. Environment Variables
Server-only: `DATABASE_URL`, `BETTER_AUTH_SECRET` (32+ chars, no fallback), `GROQ_API_KEY`, `LLM_BASE_URL` (default Groq endpoint), `LLM_MODEL`, `UPLOAD_DIR` (default `.data/uploads`), `APP_URL`. Public: `NEXT_PUBLIC_APP_URL`. `.env.example` documents all; secrets never committed (verify .gitignore covers `.env`, `.data/`).

## 17. Security Plan
Ownership predicates everywhere (§8 rule); Zod allowlists kill mass assignment; uploads magic-byte + size + PDF-only; storage keys non-guessable (cuid); prompt-injection framing + output validation; no secrets client-side (only NEXT_PUBLIC_APP_URL exposed); middleware UX gate + server enforcement; rate limit AI/auth routes; error responses never leak stack/internal emails; public portfolio exposes only opted-in fields; SQL injection N/A (Prisma parameterized); XSS: React escaping, no dangerouslySetInnerHTML for user content.

## 18. Testing Plan
- Unit (Vitest): matching weights & edge cases, skill-gap ordering, ATS heuristics, readiness composite, notifier dedupe logic (pure parts), api-helpers parse/ownership guards.
- Integration smoke script (`scripts/smoke.mts`): boots route handlers against real DB via direct invocation for auth-scoped denial paths.
- E2E (manual scripted journey documented in README; Playwright listed as follow-up): signup → onboard → upload → analyze → save internship → apply → move stage → generate roadmap → complete task → run interview → view analytics → publish portfolio.

## 19. Deployment Plan
Neon Postgres (existing) + Vercel-compatible build (`next build`), `prisma migrate deploy` release hook, env vars set in host dashboard, uploads dir caveat documented (local driver dev-only; S3 driver interface prepared), healthcheck `/api/health` (tiny route returning db ping).

## 20. Acceptance Criteria (global)
1. New account sees zero fake numbers anywhere. 2. Logged-out access to any protected page/API fails closed. 3. Cross-account access attempts 404. 4. All listed features persist + reload correctly. 5. `tsc --noEmit` clean. 6. Engines unit-tested. 7. Works end-to-end with AI disabled (degraded, labeled). 8. Migrations committed; seed split global/demo.

## 21. Recommended Implementation Order
P1→P12 above, commits per feature slice, push each to `feat/completion`.

## 22. Final Definition of “Fully Functional”
A stranger signs up with their real email, completes onboarding with their real education/skills, uploads their real resume and gets an honest scored analysis with actionable fixes, discovers internships ranked by a transparent algorithm against their real profile, tracks real applications through a persistent pipeline, receives a study roadmap targeting their actual gaps and completes tasks that measurably raise their readiness score, practices AI interviews that evaluate their actual answers and store their history, publishes a portfolio built from their data at a shareable URL, watches analytics that reflect only their activity, asks an assistant that knows their context — and every byte of that journey survives logout, works identically for the next user, and leaks nothing across accounts.

---
*Implementation begins immediately after this document on branch `feat/completion`.*
