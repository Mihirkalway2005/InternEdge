# 🎓 InternEdge

<p align="center">
  <strong>Next-Generation AI-Powered Internship Readiness & Career Acceleration Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_15-App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React_19-087EA4?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/BetterAuth-1.6-purple?style=for-the-badge" alt="BetterAuth" />
  <img src="https://img.shields.io/badge/Groq_AI-Llama_3-F55036?style=for-the-badge" alt="Groq AI" />
  <img src="https://img.shields.io/badge/Vitest-Passing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
</p>

---

## 🌟 Overview

**InternEdge** is an intelligent, end-to-end career operating system engineered to bridge the gap between academic education and industry expectations. Instead of serving as a simple job board, InternEdge acts as an ambient career companion that unifies student profiles, evaluates resumes against real ATS heuristics, diagnoses technical skill gaps, generates custom learning roadmaps, conducts mock interviews with per-answer evaluation, and automates public portfolio generation.

### The Unified Student Profile Philosophy
Every module in InternEdge connects to a **single source of truth** (the Unified Student Profile). When a student uploads a resume, solves roadmap milestones, or completes a mock interview, their **Readiness Score** dynamically recalibrates, internship match recommendations sharpen, and public portfolios update in real time.

---

## 🚀 Key Features

### 1. 📊 Unified Dashboard & Real-Time Readiness Score
- **Multi-Factor Readiness Metric (0–100%)**: Deterministically calculated from profile completeness, skill depth & breadth, ATS resume analysis score, roadmap completion velocity, and interview performance.
- **Dynamic Action Feed**: Daily priority tasks, deadline alerts, application status changes, and recommendation updates.
- **Interactive Keynote Experience**: Immersive, multi-chapter landing page featuring synthetic audio feedback, interactive module previews, and vision walkthroughs.

### 2. 📄 AI Resume Analyzer & ATS Diagnostic Engine
- **PDF Resume Ingestion**: Fast extraction and parsing using `pdf-parse`.
- **Deterministic ATS Heuristics**: Evaluates formatting, essential sections, contact details, action-verb density, and quantifiable impact metrics.
- **AI-Powered Keyword & Semantic Analysis**: Identifies missing domain keywords, structural flaws, and delivers line-by-line improvement recommendations.
- **Version Management**: Support for multiple resume versions with designated primary profiles.

### 3. 🎯 Transparent Internship Discovery & Matching Engine
- **Deterministic Match Scoring**: Pure TypeScript engine (`src/lib/engine/matching.ts`) evaluating role alignment, required vs. candidate skills, location compatibility, and work preference (Remote / Hybrid / On-Site).
- **Deep Compatibility Breakdown**: View exact matching criteria, missing prerequisites, estimated preparation time, and converted probability scores.
- **Multi-Faceted Search**: Filter by stipend ranges, location, company size, work mode, and application deadlines.

### 4. 📋 Application Pipeline Tracker (Kanban & History)
- **Lifecycle Management**: Track stages from `Saved` → `Applied` → `Assessment` → `Interview` → `HR Round` → `Offer` / `Rejected`.
- **Audit Logging**: Application timeline tracking (`ApplicationEvent`) recording all status transitions with associated notes and timestamps.
- **Deadline Reminders**: Automated alerts for upcoming assessments and interview dates.

### 5. 🗺️ Skill Gap Diagnosis & Personalized Learning Roadmaps
- **Skill Taxonomy Engine**: Maps student skill profiles against industry requirements across Frontend, Backend, Databases, DevOps, AI/ML, and Core CS.
- **Adaptive Weekly Milestones**: AI-generated structured roadmaps with prioritized tasks, resource links, and target completion timelines.
- **Live Progress Tracking**: Interactive task checkboxes that immediately update overall career readiness.

### 6. 🎙️ AI Mock Interview Simulation & Instant Evaluation
- **4 Specialized Interview Tracks**:
  - 💻 **Technical**: Deep-dive domain concepts, system design, and algorithmic problem-solving.
  - 👥 **HR**: Cultural fit, communication clarity, and situational assessment.
  - 🧠 **Behavioral**: STAR-method evaluation and past experience articulation.
  - ⚡ **Coding**: Logic formulation, edge-case analysis, and complexity breakdown.
- **Per-Answer AI Critique**: Evaluates clarity, relevance, technical correctness, confidence score, and provides actionable constructive feedback.

### 7. 🌐 Instant Portfolio Builder (`/p/[slug]`)
- **Automated Generation**: Creates a public-facing portfolio website directly from verified profile data, projects, GitHub links, and work experience.
- **Custom Vanity Slugs**: Easily shareable links with toggles for public/private visibility.

### 8. 🤖 Contextual AI Career Assistant & Command Center
- **Global Command Palette (`Cmd+K` / `Ctrl+K`)**: Instant search and fast navigation across all modules, internships, and settings.
- **Context-Aware Chat**: Conversational AI equipped to draft cover letters, critique project descriptions, explain technical concepts, and provide career advice.

---

## 🏗️ System Architecture

InternEdge is built on a **Deterministic-First, AI-Enriched** architectural pattern:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js 15 App Router                          │
│        (React 19 Server & Client Components + Tailwind CSS v4)         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                   ┌───────────────┴───────────────┐
                   ▼                               ▼
       ┌────────────────────────┐      ┌────────────────────────┐
       │   Client API Requests  │      │  Public Showcase /p/*  │
       └───────────┬────────────┘      └───────────┬────────────┘
                   │                               │
┌──────────────────▼───────────────────────────────▼─────────────────────┐
│                          API Security Layer                            │
│  - Session Identity Gate (BetterAuth - session.ts)                     │
│  - Ownership Guard (assertOwned / requireUser - api-helpers.ts)        │
│  - Zod Request Validation & Sanitization (parseBody / parseQuery)      │
│  - Rate Limiting (checkRateLimit - rate-limit.ts)                      │
└──────────────────┬───────────────────────────────┬─────────────────────┘
                   │                               │
       ┌───────────▼───────────┐       ┌───────────▼────────────┐
       ▼                       ▼       ▼                        ▼
┌──────────────┐       ┌───────────────┐       ┌────────────────────────┐
│ Deterministic│       │ Server-Side AI│       │     PostgreSQL /       │
│ Engines      │       │ Layer (Groq)  │       │     Prisma 7 ORM       │
│ (Pure TS)    │       │ (Zod Schemas) │       │ (Neon Serverless Pool) │
├──────────────┤       ├───────────────┤       ├────────────────────────┤
│ • Readiness  │       │ • Resume AI   │       │ • Users & Profiles     │
│ • Matching   │       │ • Roadmaps    │       │ • Resumes & Skills     │
│ • Skill Gap  │       │ • Interviews  │       │ • Internships & Apps   │
│ • ATS Rules  │       │ • Assistant   │       │ • Portfolios & Logs    │
└──────────────┘       └───────────────┘       └────────────────────────┘
```

### Pure Deterministic Engines (`src/lib/engine/`)
1. **`readiness.ts`**: Pure mathematical formula weighting 5 core dimensions into a normalized 0–100 score.
2. **`matching.ts`**: Weighted matching algorithm calculating title relevance, skill overlaps, work type, and location compatibility.
3. **`skillgap.ts`**: Compares candidate skill sets against requirements and yields missing tech, weak areas, and priority recommendations.
4. **`ats-heuristics.ts`**: Scans resume text structure, section headings, email/phone presence, action verbs, and quantifiable metrics without calling an LLM.
5. **`taxonomy.ts`**: Canonical normalization dictionary for skill aliases and tech stack categories.

### Graceful AI Layer (`src/lib/ai/`)
- All LLM interactions use **Groq's OpenAI-compatible endpoint** running high-throughput open models (e.g. `openai/gpt-oss-120b`).
- Enforces strict JSON Schema validation via Zod schemas (`src/lib/ai/schemas.ts`).
- Untrusted user input is securely wrapped with `guardUntrusted()`.
- **Graceful degradation**: All platform features function using deterministic engines even if `GROQ_API_KEY` is not provided.

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) | Hybrid SSR, React Server Components, Server Actions & API Routes |
| **Frontend UI** | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) | Modern UI layer styled with `@tailwindcss/postcss` and Framer Motion |
| **Icons & UI** | [Lucide React](https://lucide.dev/) | Clean, lightweight icon suite |
| **Authentication** | [BetterAuth](https://better-auth.com/) | Session-based authentication (Email/Password & Google OAuth) |
| **Database** | [PostgreSQL (Neon)](https://neon.tech/) | Serverless relational database pool |
| **ORM** | [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-pg` | Type-safe query engine and database migrations |
| **Validation** | [Zod 4](https://zod.dev/) | Runtime request validation and AI structured output schemas |
| **AI / LLM** | [Groq](https://groq.com/) | High-speed inference with structured JSON outputs |
| **Document Parsing** | [pdf-parse](https://www.npmjs.com/package/pdf-parse) | Fast server-side resume PDF text extraction |
| **Testing** | [Vitest](https://vitest.dev/) | Fast unit tests for deterministic engines |
| **Formatting** | [Oxfmt](https://github.com/oxc-project/oxc) | Ultra-fast code formatting and linting |

---

## 📁 Directory Structure

```
InternEdge/
├── prisma/
│   ├── migrations/            # Version-controlled database migrations
│   ├── schema.prisma          # PostgreSQL Prisma schema definition
│   └── seed.ts                # Database seeder (companies, internships, fixtures)
├── public/                    # Static assets, fonts, and icons
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth routes (login, signup, onboarding)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── analytics/     # Career growth and readiness trends
│   │   │   ├── applications/  # Application Kanban and history
│   │   │   ├── dashboard/     # Aggregated home dashboard
│   │   │   ├── internships/   # Internship discovery & compatibility
│   │   │   ├── interviews/    # AI mock interviews
│   │   │   ├── notifications/ # Notification center
│   │   │   ├── portfolio/     # Portfolio customizer
│   │   │   ├── profile/       # User profile and skills manager
│   │   │   ├── resume/        # Resume upload & ATS diagnostic tool
│   │   │   └── roadmap/       # Skill gap roadmaps & tasks
│   │   ├── api/               # Secure REST API route handlers
│   │   ├── p/[slug]/          # Public student portfolio page
│   │   ├── layout.tsx         # Root layout with Auth & Theme providers
│   │   └── page.tsx           # Interactive keynote landing page
│   ├── components/
│   │   ├── ai/                # Floating AI assistant drawer
│   │   ├── brand/             # Logo and brand mark components
│   │   ├── canvas/            # Audio-visual canvas effects
│   │   ├── chapters/          # Keynote landing presentation slides
│   │   ├── dashboard/         # Sidebar, topbar, command bar, chrome
│   │   └── navigation/        # Floating header navigation
│   ├── hooks/                 # Reusable client hooks (audio, key bindings)
│   ├── lib/
│   │   ├── ai/                # AI provider, prompts, schemas, and services
│   │   ├── engine/            # Deterministic calculation engines (ATS, Matching, Readiness)
│   │   ├── services/          # Business logic services (resume pipeline, dashboard aggregate)
│   │   ├── storage/           # Pluggable file storage abstraction
│   │   ├── api-helpers.ts     # Route helpers (requireUser, assertOwned, handleRoute)
│   │   ├── auth.ts            # BetterAuth server configuration
│   │   ├── db.ts              # Prisma client singleton
│   │   └── session.ts         # User session resolver
│   └── middleware.ts          # Route protection and UX cookie gating
├── tests/
│   └── engine/                # Unit test suites for pure logic engines
├── vitest.config.ts           # Vitest configuration
└── package.json               # Dependencies and scripts
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher (Node 22 LTS recommended)
- **Package Manager**: `npm` (or `bun` / `pnpm`)
- **PostgreSQL Database**: Local instance or a free cloud instance from [Neon](https://neon.tech/)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Mihirkalway2005/InternEdge.git
cd InternEdge
npm install
```

### 2. Environment Configuration
Create a `.env` file from the provided template:
```bash
cp .env.example .env
```

Configure the environment variables in `.env`:
```env
# Database (PostgreSQL / Neon)
DATABASE_URL="postgresql://user:password@host:5432/internedge?sslmode=require"

# BetterAuth Security Secret (Generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET="your-32-character-secret"
BETTER_AUTH_URL="http://localhost:8443"

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:8443"
APP_URL="http://localhost:8443"

# AI Inference (Groq OpenAI-Compatible)
GROQ_API_KEY="gsk_your_groq_api_key"
LLM_BASE_URL="https://api.groq.com/openai/v1"
LLM_MODEL="openai/gpt-oss-120b"
LLM_TIMEOUT_MS="30000"

# File Storage
UPLOAD_DIR=".data/uploads"

# OAuth Providers (Optional - feature enabled when keys provided)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Seed Option (Set to "true" if you want mock demo users and fixture applications)
SEED_DEMO_DATA="false"
```

### 3. Initialize Database & Seed
```bash
# Generate Prisma Client & apply migrations
npx prisma migrate deploy

# Seed companies, internships, and reference taxonomy
npm run db:seed
```

> **Tip:** If you want pre-populated student profiles, mock resumes, and application pipelines for testing, set `SEED_DEMO_DATA="true"` in your `.env` before running `npm run db:seed`.

### 4. Launch Development Server
```bash
npm run dev
```

Open [http://localhost:8443](http://localhost:8443) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js dev server on `$PORT` (default `8443`) |
| `npm run build` | Builds the production Next.js application |
| `npm run start` | Runs the compiled production build |
| `npm test` | Runs all Vitest unit tests for deterministic engines |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run typecheck` | Validates TypeScript types across the entire project |
| `npm run lint` | Checks code formatting and syntax with `oxfmt` |
| `npm run format` | Automatically formats all codebase files |
| `npm run db:migrate` | Creates and applies Prisma migrations during development |
| `npm run db:seed` | Seeds the database with companies, roles, and reference data |
| `npm run db:studio` | Launches Prisma Studio GUI for database inspection |

---

## 🔒 Security & API Best Practices

- **Strict Identity Resolution**: API endpoints never accept `userId` from request parameters. User identity is strictly resolved from verified session tokens via `requireUser()`.
- **Zero Mass-Assignment**: All mutation payloads are validated against strict Zod schemas via `parseBody()` before database writes.
- **Enforced Ownership & 404 Masking**: Resources are queried by `userId` or guarded with `assertOwned(record, userId)`. Unauthorized accesses return `404 Not Found` rather than `403 Forbidden` to prevent resource enumeration attacks.
- **Prompt Injection Defense**: User-submitted texts (resumes, job descriptions, chat prompts) are sanitized through `guardUntrusted()` before passing to LLMs.
- **In-Memory Rate Limiting**: AI and file processing routes are rate-limited per user to prevent abuse.

---

## 🧪 Testing

Deterministic engines are covered with comprehensive Vitest unit tests:

```bash
npm test
```

### Test Suites:
- `tests/engine/readiness.test.ts`: Validates 0-100 scoring bounds, component weighting, and edge cases.
- `tests/engine/ats-heuristics.test.ts`: Verifies heuristic ATS grading, contact extraction, and section completeness.
- `tests/engine/matching.test.ts`: Asserts ranking order, work type filters, and skill intersection accuracy.
- `tests/engine/skillgap.test.ts`: Validates taxonomy mapping and gap severity categorization.

---

## 🚢 Deployment

### Deploying to Vercel + Neon
1. Push your repository to GitHub.
2. Create a serverless PostgreSQL database on [Neon](https://neon.tech/).
3. Import the repository into [Vercel](https://vercel.com/).
4. Configure environment variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GROQ_API_KEY`, etc.) in Vercel project settings.
5. Set the Build Command:
   ```bash
   npx prisma migrate deploy && next build
   ```
6. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create your feature branch (`git checkout -b feat/amazing-feature`).
3. Ensure typecheck and tests pass (`npm run typecheck && npm test`).
4. Commit your changes (`git commit -m 'feat: add amazing feature'`).
5. Push to the branch (`git push origin feat/amazing-feature`).
6. Open a Pull Request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
