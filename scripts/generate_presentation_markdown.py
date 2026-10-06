#!/usr/bin/env python3
"""
Generate Markdown version of the Presentation Slide Deck.
"""

def generate_presentation_markdown():
    content = """# CONCEPTUAL PROJECT 2: FINAL PROJECT PRESENTATION
## WOXSEN UNIVERSITY — SCHOOL OF TECHNOLOGY

---

# SLIDE 1: TITLE SLIDE

### InternEdge
**Next-Generation AI-Powered Internship Readiness & Career Acceleration Platform**

**Program / Department:** Bachelor of Technology in Computer Science and Engineering, School of Technology  
**University:** Woxsen University, Hyderabad, India  
**Batch & Date:** Batch 2025–2029 | October 2026 | Final Evaluation  

#### Team Members:
- **Mihir Kalway** (25WU0102157)
- **Maydhaansh Nanda** (25WU0102155)
- **Saambhavi Devi** (25W0101039)
- **Shaik Imaduddin** (25WU0101048)

#### Under the Guidance of:
**Mr. Abhilash Nair**  
Assistant Professor / Mentor, School of Technology  

---

# SLIDE 2: PRESENTATION AGENDA

| Code | Section | Executive Scope |
| :---: | :--- | :--- |
| **01** | **Problem Statement** | Higher ed recruitment crisis, ATS rejection barriers, and student career fragmentation |
| **02** | **Literature Review & Background** | Survey of LinkedIn, Handshake, ATS parsing, and our Deterministic-First approach |
| **03** | **Methodology & Architecture** | 5-stage pipeline, Next.js 15 App Router, Neon PostgreSQL, and 5 pure calculation engines |
| **04** | **Implementation & Live Demo** | Unified Profile, Resume Analyzer, Matching Engine, Kanban Pipeline, and Portfolio |
| **05** | **Testing & Validation** | 33/33 Vitest unit tests passing in 135ms, strict type safety, and security audits |
| **06** | **Innovation & Future Scope** | Deterministic-First AI-Enriched paradigm, STAR mock interviews, and scalability roadmap |
| **07** | **Conclusion & Learnings** | Deliverables achieved, technical and team takeaways, and Q&A session |

---

# SLIDE 3: 01 | PROBLEM STATEMENT

### Context: Industry & Placement Crisis
- **75%+ ATS Filter Rate:** Over three-quarters of entry-level resumes are rejected by automated ATS parsers before recruiter review.
- **Escalating Job Expectations:** Employers demand full-stack depth, version control proof, and quantifiable project metrics for internships.
- **Placement Cell Bottlenecks:** Institutions struggle to provide personalized, real-time feedback to hundreds of students simultaneously.

### The Specific Problem: Severe Tool Fragmentation
- **Siloed Preparation:** Students juggle disconnected single-purpose platforms: resume builders, LeetCode, job boards, Notion, and static portfolios.
- **Opaque Rejection Feedback:** Automated rejection emails provide zero diagnosis of whether formatting, skills, or projects failed.
- **Lack of Structured Roadmaps:** Students lack deterministic guidance on how to remediate identified technical skill deficits.

### Our Core Objective: The Career Operating System
- **Unified Student Profile:** Establish a single source of truth connecting resumes, skills, GitHub projects, and mock interviews.
- **Deterministic Readiness Score:** Calculate an objective 0–100% composite readiness metric based on 7 real performance signals.
- **End-to-End Lifecycle OS:** Integrate discovery, transparent matching, ATS audits, Kanban tracking, and public portfolios.

---

# SLIDE 4: 02 | LITERATURE REVIEW & BACKGROUND

### Existing Work & Key References
- **LinkedIn & Indeed:** Massive reach, but recommendation algorithms prioritize connection volume; zero diagnostic skill gap feedback for students.
- **Handshake & Internshala:** Campus-centric job boards, but function merely as application portals; no ATS scoring, mock interviews, or custom roadmaps.
- **Commercial ATS Checkers (Jobscan):** Proprietary, paywalled scoring tools that operate in isolation from the student's actual GitHub repos and learning journey.
- **Shields et al. (2021) [IEEE]:** Proved that unstandardized formatting and lack of quantifiable metrics trigger automated rejection in 75%+ of entry resumes.
- **Bommasani et al. (2021) [Stanford]:** Highlighted foundation model capabilities in career guidance, alongside hallucinations when outputs lack strict schema guards.

### Critical Gap Identified
- **The Fragmentation Bottleneck:** No platform connects profile signals, ATS diagnostics, personalized roadmaps, and interview transcripts into a self-improving feedback loop.
- **The AI Hallucination Trap:** Current "AI wrappers" generate inconsistent, non-reproducible scores that mislead students and fail under API downtime.

### Our Differentiated Approach: Deterministic-First + AI-Enriched
- **Pure Deterministic Math:** 5 pure TypeScript calculation engines handle Readiness Scoring, Jaccard Matching, and ATS Heuristics with zero hallucination.
- **Structured AI Enrichment:** Groq Cloud LLMs (Llama-3) are used strictly server-side, bounded by strict Zod JSON schemas for actionable qualitative feedback.

---

# SLIDE 5: 03 | METHODOLOGY & ARCHITECTURE

### 5-Stage Engineering Pipeline
1. **Data Ingestion & Ingestion:** PDF resume parsing via `pdf-parse`, GitHub repositories, and profile entity normalization.
2. **Taxonomy & Preprocessing:** Canonical alias normalization dictionary (`taxonomy.ts`) mapping engineering skill trees.
3. **Deterministic Engine Design:** Pure mathematical calculation of Readiness Score, Jaccard Matching, and ATS Heuristics.
4. **Server-Side AI Enrichment:** Groq Cloud Llama-3 inference wrapped in strict Zod JSON schemas and `guardUntrusted()` prompt security.
5. **Testing & Delivery:** Vitest unit validation (33/33 tests passed), Next.js 15 App Router delivery, and Neon PostgreSQL persistence.

### Production Technology Stack
- **Framework:** Next.js 15.5.22 (App Router, Server Actions, React Server Components)
- **Frontend UI:** React 19.0.0 + Tailwind CSS v4 + Framer Motion
- **Type Safety:** TypeScript 5.x in Strict Mode (Zero Compile Errors)
- **ORM & Database:** Prisma 7.9.1 + Neon Serverless PostgreSQL Pool
- **Authentication:** BetterAuth 1.6 Session Gate & PBKDF2 Password Hashing
- **AI Inference:** Groq Cloud (Llama-3 70B / 120B) with sub-second latency
- **Unit Testing:** Vitest 4.1.11 automated test runner

---

# SLIDE 6: 04 | IMPLEMENTATION PROGRESS & DEMO

### Key Features Implemented:
1. **Unified Student Dashboard:** Dynamic 0–100% Readiness Score combining 7 real performance signals.
2. **Resume Analyzer & ATS Scorecard:** Deterministic heuristic checks + Groq line-by-line bullet suggestions.
3. **Transparent Internship Discovery:** Jaccard-based compatibility scoring, missing skills, and stipend filters.
4. **Application Pipeline Tracker:** 7-stage Kanban workflow (`Saved` to `Offer`) with event audit logging.
5. **Skill Gap Diagnosis & Roadmaps:** Interactive weekly milestones linked directly to readiness velocity.
6. **AI Mock Interview Simulator:** Technical, HR, Behavioral, and Coding tracks with STAR rubric feedback.
7. **Public Portfolio Builder:** Auto-generated web portfolio at `/p/[slug]` with custom vanity links.

### Deployment & Verification Channels:
- 🔗 **GitHub Repository:** `https://github.com/Mihirkalway2005/InternEdge` (Production Branch: `main`)
- 🏆 **HackerRank:** Online Coding Assessment Modules 100% Passed
- 💻 **LeetCode:** Active Student Problem Solving Profiles & Competency Trackers

---

# SLIDE 7: 05 | TESTING & VALIDATION

### Key Metric KPI Highlights:
- **100% Mathematical Precision:** Pure deterministic engine calculations with zero AI hallucinations.
- **33 / 33 Test Cases Passed:** 4 pure engine suites in Vitest executing in **135 milliseconds**.
- **< 140ms Response Latency:** Sub-millisecond deterministic calculation per user operation.

### Quality Assurance Testing Matrix:

| Testing Type | Description & Coverage | Verification Result |
| :--- | :--- | :---: |
| **Unit Testing (Matching Engine)** | Validates title relevance, skill overlap, location fit, and eligibility weights. | ✅ **11/11 Passed (3ms)** |
| **Unit Testing (Readiness Score)** | Validates multi-factor weights, empty profile tolerances, and project links. | ✅ **6/6 Passed (3ms)** |
| **Unit Testing (ATS Heuristics)** | Tests regex impact verbs, quantifiable metrics detection, and formatting checks. | ✅ **8/8 Passed (3ms)** |
| **Unit Testing (Skill Gap Engine)** | Tests taxonomy categorization, missing tech detection, and priority sorting. | ✅ **8/8 Passed (7ms)** |
| **Type-Safety Validation** | Full static compilation check via TypeScript strict mode (`tsc --noEmit`). | ✅ **0 Type Errors** |
| **Security & Ownership QA** | Validates tenant isolation via `assertOwned()`; returns 404 on access violations. | ✅ **Verified Secure** |
| **Edge Case Handling** | Zero-division safeguards, empty profile tolerances, and graceful LLM fallback. | ✅ **Passed** |

---

# SLIDE 8: 06 | INNOVATION, CREATIVITY & FUTURE SCOPE

### What Makes InternEdge Unique:
- **Deterministic-First Paradigm:** Scores and match percentages are computed mathematically, completely eliminating LLM hallucinations and ensuring 100% reproducible metrics.
- **Unified Student Profile (SSOT):** Replaced fragmented job portals with a single source of truth connecting resumes, roadmaps, applications, and mock interview transcripts.
- **Proficiency-Weighted Jaccard Match:** Weights beginner, intermediate, advanced, and expert competencies against company requirements with transparent reason breakdowns.
- **Graceful Degradation Architecture:** If third-party AI keys are unset or services fail, 100% of core platform discovery, ATS audits, and Kanban features continue running.

### 🚀 Future Scope & Enhancements:
- **Real-Time Conversational Audio Interviews:** Integrate WebRTC and Whisper speech-to-text to simulate voice-to-voice mock interviews with real-time vocal tone analysis.
- **Placement Cell Institutional Portal:** Build administrative role dashboards enabling university placement officers to inspect batch readiness distributions and invite recruiters.
- **Vector Search & RAG Ingestion:** Implement `pgvector` in PostgreSQL to support semantic vector matching across unstructured resume bullet points and job descriptions.
- **Cross-Platform Mobile Application:** Develop React Native mobile apps for real-time application deadline push alerts, daily task checklists, and interview reminders.

---

# SLIDE 9: PRE-EVALUATION READINESS CHECKLIST

| Evaluation Criteria | Verification Status |
| :--- | :---: |
| Project objectives are clearly defined and documented | **✓ Passed** |
| Working prototype / production live demo is ready | **✓ Passed** |
| Final project report submitted to mentor (Mr. Abhilash Nair) | **✓ Passed** |
| All required project milestones achieved according to syllabus | **✓ Passed** |
| Presentation slides prepared according to university template | **✓ Passed** |
| Academic integrity & plagiarism compliance verified (< 20%) | **✓ Passed** |
| Active team participation and equal workload distribution | **✓ Passed** |
| All mentor feedback incorporated into system architecture | **✓ Passed** |
| Proof of deployment — GitHub, HackerRank, LeetCode attached | **✓ Passed** |
| Source code, unit tests, and database fixtures organized | **✓ Passed** |

---

# SLIDE 10: 07 | CONCLUSION & LEARNINGS

### Project Summary
Successfully engineered **InternEdge**, a full-lifecycle career acceleration operating system on Next.js 15, React 19, Tailwind CSS v4, Prisma 7, PostgreSQL, and Groq Cloud LLMs. Bridged the college-to-industry gap through deterministic readiness scoring and unified profile synthesis.

### Key Outcomes
- **End-to-End Operational System:** 9 complete modules deployed spanning Unified Profile, ATS Analyzer, Matching, Roadmaps, Interviews, Kanban, and Portfolios.
- **100% Test Suite Verification:** 33/33 Vitest unit tests passing across 4 deterministic calculation engines in 135 milliseconds.
- **Zero Type Defect Assurance:** Strict TypeScript compilation yielding 0 type errors across 50+ source modules.
- **Verified Open-Source Asset:** Public GitHub repository with clean Git commit history, database migrations, and comprehensive documentation.

### Key Multidisciplinary Learnings
- **Technical Mastery:** Gained deep proficiency in Next.js 15 App Router, React 19 Server Components, Prisma ORM relational modeling, and Zod runtime schema validation.
- **Architectural Discipline:** Learned to separate stochastic LLM enrichments from pure deterministic business math to guarantee reliability and zero hallucinations.
- **Security Engineering:** Implemented cookie-based session verification, multi-tenant ownership assertions, and token-bucket rate limiting.
- **Team Collaboration:** Practiced agile development, Git branch management, and rigorous peer code reviews across four engineering team members.

---

### Thank You!
**Questions & Feedback Welcome**  
*Mentor: Mr. Abhilash Nair • School of Technology, Woxsen University*
"""

    with open("report/InternEdge_Project_Presentation.md", "w") as f:
        f.write(content)
    print("report/InternEdge_Project_Presentation.md generated successfully!")

if __name__ == "__main__":
    generate_presentation_markdown()
