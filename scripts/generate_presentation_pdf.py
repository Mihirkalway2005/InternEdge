#!/usr/bin/env python3
"""
Generate a high-quality landscape PDF for InternEdge Project Presentation using ReportLab.
16:9 aspect ratio (960 x 540 pt or 1024 x 576 pt), Dark Modern Slate Aesthetic.
"""

import os
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas

PAGE_W = 960
PAGE_H = 540

# Colors
BG_COLOR = HexColor("#0B0F19")
CARD_BG = HexColor("#151E2E")
CARD_BORDER = HexColor("#2A3850")
CYAN = HexColor("#38BDF8")
GREEN = HexColor("#34D399")
PURPLE = HexColor("#A78BFA")
WHITE = HexColor("#F8FAFC")
MUTED = HexColor("#94A3B8")
DIM = HexColor("#64748B")
RED = HexColor("#F87171")

def draw_background(c):
    c.setFillColor(BG_COLOR)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

def draw_header(c, tag, title):
    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(CYAN)
    c.drawString(50, PAGE_H - 40, tag.upper())
    
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(WHITE)
    c.drawString(50, PAGE_H - 65, title)

def draw_card(c, x, y, w, h, bg_col=CARD_BG, border_col=CARD_BORDER, bg_rgb=None, border_rgb=None):
    if bg_rgb is not None:
        bg_col = bg_rgb
    if border_rgb is not None:
        border_col = border_rgb
    c.setFillColor(bg_col)
    c.setStrokeColor(border_col)
    c.setLineWidth(1)
    c.roundRect(x, y, w, h, 6, stroke=1, fill=1)

def build_pdf():
    pdf_path = "report/InternEdge_Project_Presentation.pdf"
    c = canvas.Canvas(pdf_path, pagesize=(PAGE_W, PAGE_H))

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    draw_background(c)
    
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(CYAN)
    c.drawString(70, PAGE_H - 90, "CONCEPTUAL PROJECT 2  •  WOXSEN UNIVERSITY")

    c.setFont("Helvetica-Bold", 36)
    c.setFillColor(WHITE)
    c.drawString(70, PAGE_H - 145, "InternEdge")

    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(CYAN)
    c.drawString(70, PAGE_H - 175, "Next-Generation AI-Powered Internship Readiness & Career Acceleration Platform")

    # Team Card
    draw_card(c, 70, 70, 390, 260)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(GREEN)
    c.drawString(90, 300, "TEAM MEMBERS (STUDENTS)")

    team = [
        ("Mihir Kalway", "25WU0102157"),
        ("Maydhaansh Nanda", "25WU0102155"),
        ("Saambhavi Devi", "25W0101039"),
        ("Shaik Imaduddin", "25WU0101048")
    ]
    y_t = 265
    for name, roll in team:
        c.setFont("Helvetica", 12)
        c.setFillColor(WHITE)
        c.drawString(95, y_t, f"•  {name}  —  {roll}")
        y_t -= 32

    # Academic & Evaluation Card
    draw_card(c, 490, 70, 400, 260)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(PURPLE)
    c.drawString(510, 300, "ACADEMIC & EVALUATION DETAILS")

    ctx = [
        ("Mentor:", "Mr. Abhilash Nair"),
        ("Department:", "School of Technology, Woxsen University"),
        ("Program:", "B. Tech. in Computer Science & Engineering"),
        ("Batch & Year:", "Batch 2025–2029 | October 2026"),
        ("Evaluation:", "Conceptual Project 2 — Final Evaluation")
    ]
    y_c = 265
    for lbl, val in ctx:
        c.setFont("Helvetica-Bold", 10.5)
        c.setFillColor(MUTED)
        c.drawString(515, y_c, lbl)
        c.setFont("Helvetica", 10.5)
        c.setFillColor(WHITE)
        c.drawString(610, y_c, val)
        y_c -= 32

    c.showPage()

    # ==========================================
    # SLIDE 2: PRESENTATION AGENDA
    # ==========================================
    draw_background(c)
    draw_header(c, "Overview", "Presentation Agenda")

    agenda = [
        ("01", "Problem Statement", "Higher ed recruitment crisis, ATS rejection barriers, and student career fragmentation"),
        ("02", "Literature Review & Background", "Survey of LinkedIn, Handshake, ATS parsing, and our Deterministic-First approach"),
        ("03", "Methodology & Architecture", "5-stage pipeline, Next.js 15 App Router, Neon PostgreSQL, and 5 pure calculation engines"),
        ("04", "Implementation & Live Demo", "Unified Profile, Resume Analyzer, Matching Engine, Kanban Pipeline, and Portfolio"),
        ("05", "Testing & Validation", "33/33 Vitest unit tests passing in 135ms, strict type safety, and security audits"),
        ("06", "Innovation & Future Scope", "Deterministic-First AI-Enriched paradigm, STAR mock interviews, and scalability roadmap"),
        ("07", "Conclusion & Learnings", "Deliverables achieved, technical and team takeaways, and Q&A session")
    ]
    y_a = PAGE_H - 125
    for num, title, desc in agenda:
        draw_card(c, 50, y_a, 860, 42)
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(CYAN)
        c.drawString(70, y_a + 14, num)
        
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(WHITE)
        c.drawString(110, y_a + 14, title)

        c.setFont("Helvetica", 9.5)
        c.setFillColor(MUTED)
        c.drawString(340, y_a + 14, f"—   {desc}")
        y_a -= 52

    c.showPage()

    # ==========================================
    # SLIDE 3: 01 | PROBLEM STATEMENT
    # ==========================================
    draw_background(c)
    draw_header(c, "01 | Problem Statement", "Bridging the College-to-Industry Recruitment Chasm")

    cols = [
        ("CONTEXT & INDUSTRY REALITY", CYAN, 50, [
            ("75%+ ATS Filter Rate", "Over three-quarters of entry resumes rejected by ATS parsers before recruiter review."),
            ("Escalating Job Expectations", "Employers demand full-stack depth, Git proof, and quantifiable project metrics."),
            ("Placement Cell Bottlenecks", "Institutions struggle to provide personalized feedback to hundreds of students.")
        ]),
        ("SPECIFIC PROBLEM & GAPS", RED, 350, [
            ("Severe Tool Fragmentation", "Students juggle isolated tools: resume builders, LeetCode, job boards, Notion."),
            ("Opaque Rejection Feedback", "Automated rejection emails provide zero diagnosis of formatting or skill deficits."),
            ("Lack of Structured Roadmaps", "Students lack deterministic guidance on remediating identified technical gaps.")
        ]),
        ("OUR CORE OBJECTIVE", GREEN, 650, [
            ("Unified Student Profile", "Single source of truth connecting resumes, skills, GitHub repos, and interviews."),
            ("Deterministic Readiness Score", "Calculate an objective 0–100% composite score based on 7 real performance signals."),
            ("End-to-End Lifecycle OS", "Integrate discovery, transparent matching, ATS audits, Kanban, and portfolios.")
        ])
    ]
    for head, col, x, pts in cols:
        draw_card(c, x, 50, 260, 400)
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(col)
        c.drawString(x + 15, 425, head)

        y_p = 385
        for t, d in pts:
            c.setFont("Helvetica-Bold", 10)
            c.setFillColor(WHITE)
            c.drawString(x + 15, y_p, f"• {t}")
            c.setFont("Helvetica", 8.5)
            c.setFillColor(MUTED)
            # Simple text wrap
            words = d.split()
            l1 = " ".join(words[:6])
            l2 = " ".join(words[6:])
            c.drawString(x + 23, y_p - 15, l1)
            if l2:
                c.drawString(x + 23, y_p - 28, l2)
            y_p -= 52

    c.showPage()

    # ==========================================
    # SLIDE 4: 02 | LITERATURE REVIEW & BACKGROUND
    # ==========================================
    draw_background(c)
    draw_header(c, "02 | Literature Review & Background", "State-of-the-Art Analysis & Identified Deficiencies")

    # Left: Existing Work
    draw_card(c, 50, 50, 410, 400)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(CYAN)
    c.drawString(70, 425, "EXISTING WORK & KEY REFERENCES")

    refs = [
        ("LinkedIn & Indeed", "Broad reach, but recommendation algorithms prioritize connections; zero diagnostic skill gap feedback."),
        ("Handshake & Internshala", "Campus job boards, but function merely as application portals; no ATS scoring or adaptive roadmaps."),
        ("Jobscan (Commercial ATS)", "Proprietary, paywalled tools operating in isolation from the student's GitHub repos and learning journey."),
        ("Shields et al. (2021) [IEEE]", "Proved that unstandardized formatting and lack of metrics trigger 75%+ automated resume rejections."),
        ("Bommasani et al. (2021)", "Demonstrated LLM utility in career tech, alongside risks of hallucination without strict schema guards.")
    ]
    y_r = 390
    for t, d in refs:
        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(WHITE)
        c.drawString(70, y_r, f"• {t}:")
        c.setFont("Helvetica", 8.5)
        c.setFillColor(MUTED)
        words = d.split()
        l1 = " ".join(words[:9])
        l2 = " ".join(words[9:])
        c.drawString(80, y_r - 14, l1)
        if l2:
            c.drawString(80, y_r - 26, l2)
        y_r -= 48

    # Right Top: Gap
    draw_card(c, 480, 260, 430, 190)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(RED)
    c.drawString(500, 425, "CRITICAL GAP IDENTIFIED")

    c.setFont("Helvetica", 9.5)
    c.setFillColor(WHITE)
    c.drawString(500, 395, "• The Fragmentation Bottleneck:")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MUTED)
    c.drawString(510, 380, "No existing platform connects profile signals, ATS diagnostics, roadmaps,")
    c.drawString(510, 365, "and interview transcripts into a synchronized, self-improving feedback loop.")

    c.setFont("Helvetica", 9.5)
    c.setFillColor(WHITE)
    c.drawString(500, 335, "• The AI Hallucination Trap:")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MUTED)
    c.drawString(510, 320, "Current 'AI wrappers' produce stochastic, non-reproducible scores that mislead")
    c.drawString(510, 305, "students and crash under third-party API rate limits or network downtime.")

    # Right Bottom: Our Approach
    draw_card(c, 480, 50, 430, 190)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(GREEN)
    c.drawString(500, 215, "OUR APPROACH: DETERMINISTIC-FIRST + AI-ENRICHED")

    c.setFont("Helvetica", 9.5)
    c.setFillColor(WHITE)
    c.drawString(500, 185, "• Pure Deterministic Mathematics:")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MUTED)
    c.drawString(510, 170, "5 pure TypeScript engines handle Readiness Scoring, Jaccard Matching,")
    c.drawString(510, 155, "and ATS heuristics with zero hallucination and sub-millisecond execution.")

    c.setFont("Helvetica", 9.5)
    c.setFillColor(WHITE)
    c.drawString(500, 125, "• Server-Side Structured AI Enrichment:")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MUTED)
    c.drawString(510, 110, "Groq Cloud LLMs (Llama-3) provide actionable qualitative advice strictly")
    c.drawString(510, 95, "bounded by runtime Zod JSON schemas and prompt sanitization guards.")

    c.showPage()

    # ==========================================
    # SLIDE 5: 03 | METHODOLOGY & ARCHITECTURE
    # ==========================================
    draw_background(c)
    draw_header(c, "03 | Methodology & Architecture", "Engineering Pipeline & Modern Technology Stack")

    # 5 Process boxes
    p_steps = [
        ("1. INGESTION", "PDF parsing via pdf-parse & profile data entities"),
        ("2. TAXONOMY", "Canonical alias resolution (taxonomy.ts)"),
        ("3. ENGINES", "Deterministic Readiness, Matching & ATS Scoring"),
        ("4. AI ENRICH", "Groq Llama-3 + strict Zod JSON schemas"),
        ("5. DELIVERY", "Kanban tracking & live portfolio (/p/[slug])")
    ]
    x_s = 50
    for st_title, st_desc in p_steps:
        draw_card(c, x_s, 340, 160, 100, bg_rgb=HexColor("#1E293B"), border_rgb=CYAN)
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(CYAN)
        c.drawString(x_s + 12, 415, st_title)
        
        c.setFont("Helvetica", 8)
        c.setFillColor(WHITE)
        words = st_desc.split()
        c.drawString(x_s + 12, 385, " ".join(words[:4]))
        c.drawString(x_s + 12, 370, " ".join(words[4:]))
        x_s += 175

    # Tech Stack
    draw_card(c, 50, 50, 860, 270)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(GREEN)
    c.drawString(70, 295, "CORE PRODUCTION TECHNOLOGY STACK")

    tech_items = [
        ("Next.js 15 (App Router)", "Hybrid SSR, Server Components, and Server Actions for sub-second page delivery."),
        ("React 19 + Tailwind v4", "Zero-runtime modern utility styling with reactive client state and Framer Motion micro-interactions."),
        ("TypeScript 5 (Strict Mode)", "100% compile-time static type safety across database queries, calculation engines, and UI."),
        ("Prisma 7 + Neon PostgreSQL", "Serverless PostgreSQL pool with relational schema migrations, indexes, and connection pooling."),
        ("BetterAuth 1.6 Session Gate", "Cookie-based session identity, PBKDF2 password hashing, and role-based access control."),
        ("Groq AI Cloud (Llama-3)", "High-throughput server-side LLM inference guarded with strict Zod structured JSON schemas."),
        ("Vitest 4.1.11 Test Suite", "Blazing-fast automated unit test suite executing 33 pure engine tests in 135 milliseconds.")
    ]
    y_tk = 265
    for name, desc in tech_items:
        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(WHITE)
        c.drawString(70, y_tk, f"• {name}:")
        c.setFont("Helvetica", 9)
        c.setFillColor(MUTED)
        c.drawString(245, y_tk, desc)
        y_tk -= 28

    c.showPage()

    # ==========================================
    # SLIDE 6: 04 | IMPLEMENTATION PROGRESS & DEMO
    # ==========================================
    draw_background(c)
    draw_header(c, "04 | Implementation Progress & Demo", "Live System Modules & Working Feature Walkthrough")

    # Image Left
    img_p = "report/screenshots/03_dashboard.png"
    if os.path.exists(img_p):
        c.drawImage(img_p, 50, 110, width=410, height=340, preserveAspectRatio=True)

    # Features Right
    draw_card(c, 480, 110, 430, 340)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(CYAN)
    c.drawString(500, 425, "KEY PRODUCTION MODULES IMPLEMENTED")

    feats = [
        ("Unified Student Dashboard", "Dynamic 0–100% Readiness Score combining 7 real performance signals."),
        ("Resume Analyzer & ATS Scorecard", "Deterministic heuristic checks + Groq line-by-line bullet suggestions."),
        ("Transparent Internship Discovery", "Jaccard-based compatibility scoring, missing skills, and stipend filters."),
        ("Application Pipeline Tracker", "7-stage Kanban workflow (Saved to Offer) with event audit logging."),
        ("Skill Gap Diagnosis & Roadmaps", "Interactive weekly milestones linked directly to readiness velocity."),
        ("AI Mock Interview Simulator", "Technical, HR, Behavioral, and Coding tracks with STAR rubric feedback."),
        ("Public Portfolio Builder", "Auto-generated web portfolio at /p/[slug] with custom vanity links.")
    ]
    y_f = 395
    for t, d in feats:
        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(WHITE)
        c.drawString(500, y_f, f"• {t}:")
        c.setFont("Helvetica", 8.5)
        c.setFillColor(MUTED)
        words = d.split()
        c.drawString(510, y_f - 13, " ".join(words[:9]))
        c.drawString(510, y_f - 24, " ".join(words[9:]))
        y_f -= 42

    # Bottom Banner
    draw_card(c, 50, 50, 860, 45, bg_rgb=HexColor("#1E293B"), border_col=GREEN)
    c.setFont("Helvetica-Bold", 9.5)
    c.setFillColor(CYAN)
    c.drawString(70, 68, "🔗 GitHub: ")
    c.setFont("Helvetica", 9.5)
    c.setFillColor(WHITE)
    c.drawString(130, 68, "https://github.com/Mihirkalway2005/InternEdge   |   ")

    c.setFont("Helvetica-Bold", 9.5)
    c.setFillColor(GREEN)
    c.drawString(450, 68, "🏆 HackerRank: ")
    c.setFont("Helvetica", 9.5)
    c.setFillColor(WHITE)
    c.drawString(545, 68, "OA 100% Passed   |   ")

    c.setFont("Helvetica-Bold", 9.5)
    c.setFillColor(PURPLE)
    c.drawString(680, 68, "💻 LeetCode: ")
    c.setFont("Helvetica", 9.5)
    c.setFillColor(WHITE)
    c.drawString(760, 68, "Active Problem Solving Track")

    c.showPage()

    # ==========================================
    # SLIDE 7: 05 | TESTING & VALIDATION
    # ==========================================
    draw_background(c)
    draw_header(c, "05 | Testing & Validation", "Quality Assurance Metrics, Unit Testing & Performance Benchmarks")

    # 3 Top KPI Cards
    kpis = [
        ("100%", "Mathematical Precision", "Pure Deterministic Engine Math (Zero Hallucination)", 50),
        ("33 / 33", "Test Cases Passed", "Vitest Automated Engine Test Suite (135ms total)", 350),
        ("< 140ms", "Response Latency", "Sub-millisecond Deterministic Execution per Op", 650)
    ]
    for val, lbl, sub, x in kpis:
        draw_card(c, x, 340, 260, 100, bg_rgb=HexColor("#1E293B"), border_col=GREEN)
        c.setFont("Helvetica-Bold", 24)
        c.setFillColor(GREEN)
        c.drawCentredString(x + 130, 400, val)

        c.setFont("Helvetica-Bold", 10.5)
        c.setFillColor(WHITE)
        c.drawCentredString(x + 130, 375, lbl)

        c.setFont("Helvetica", 8)
        c.setFillColor(MUTED)
        c.drawCentredString(x + 130, 355, sub)

    # Bottom Testing Table
    draw_card(c, 50, 50, 860, 270)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(CYAN)
    c.drawString(70, 295, "VERIFICATION SUITE & QA BREAKDOWN")

    qa = [
        ("Unit Testing (Matching Engine)", "Validates title relevance, skill overlap, location fit, and eligibility weights.", "✅ 11/11 Passed (3ms)"),
        ("Unit Testing (Readiness Score)", "Validates multi-factor weights, empty profile tolerances, and project links.", "✅ 6/6 Passed (3ms)"),
        ("Unit Testing (ATS Heuristics)", "Tests regex impact verbs, quantifiable metrics detection, and formatting checks.", "✅ 8/8 Passed (3ms)"),
        ("Unit Testing (Skill Gap Engine)", "Tests taxonomy categorization, missing tech detection, and priority sorting.", "✅ 8/8 Passed (7ms)"),
        ("Type-Safety Validation", "Full static compilation check via TypeScript strict mode (tsc --noEmit).", "✅ 0 Type Errors"),
        ("Security & Ownership QA", "Validates tenant isolation via assertOwned(); returns 404 on access violations.", "✅ Verified Secure")
    ]
    y_q = 265
    for t, sc, res in qa:
        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(WHITE)
        c.drawString(70, y_q, f"• {t}:")
        c.setFont("Helvetica", 8.5)
        c.setFillColor(MUTED)
        c.drawString(270, y_q, f"{sc}  —")
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(GREEN)
        c.drawString(720, y_q, res)
        y_q -= 28

    c.showPage()

    # ==========================================
    # SLIDE 8: 06 | INNOVATION & FUTURE SCOPE
    # ==========================================
    draw_background(c)
    draw_header(c, "06 | Innovation, Creativity & Future Scope", "Architectural Distinctiveness & Scalability Roadmap")

    # Left: Innovation
    draw_card(c, 50, 50, 410, 400)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(CYAN)
    c.drawString(70, 425, "WHAT MAKES INTERNEDGE UNIQUE")

    innov = [
        ("Deterministic-First Paradigm", "Scores and match percentages are computed mathematically, completely eliminating LLM hallucinations and ensuring 100% reproducible metrics."),
        ("Unified Student Profile (SSOT)", "Replaced fragmented job portals with a single source of truth connecting resumes, roadmaps, applications, and mock interview transcripts."),
        ("Proficiency-Weighted Jaccard Match", "Weights beginner, intermediate, advanced, and expert competencies against company requirements with transparent reason breakdowns."),
        ("Graceful Degradation Architecture", "If third-party AI keys are unset or services fail, 100% of core platform discovery, ATS audits, and Kanban features continue running.")
    ]
    y_in = 390
    for t, d in innov:
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(WHITE)
        c.drawString(70, y_in, f"• {t}")
        c.setFont("Helvetica", 8.5)
        c.setFillColor(MUTED)
        words = d.split()
        c.drawString(80, y_in - 15, " ".join(words[:9]))
        c.drawString(80, y_in - 28, " ".join(words[9:]))
        y_in -= 55

    # Right: Roadmap
    draw_card(c, 480, 50, 430, 400)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(GREEN)
    c.drawString(500, 425, "FUTURE SCOPE & PRODUCT ROADMAP")

    rd = [
        ("Real-Time Conversational Audio Interviews", "Integrate WebRTC and Whisper speech-to-text to simulate voice-to-voice mock interviews with real-time vocal tone analysis."),
        ("Placement Cell Institutional Portal", "Build administrative role dashboards enabling university placement officers to inspect batch readiness distributions and invite recruiters."),
        ("Vector Search & RAG Ingestion", "Implement pgvector in PostgreSQL to support semantic vector matching across unstructured resume bullet points and job descriptions."),
        ("Cross-Platform Mobile Application", "Develop React Native mobile apps for real-time application deadline push alerts, daily task checklists, and interview reminders.")
    ]
    y_rd = 390
    for t, d in rd:
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(WHITE)
        c.drawString(500, y_rd, f"• {t}")
        c.setFont("Helvetica", 8.5)
        c.setFillColor(MUTED)
        words = d.split()
        c.drawString(510, y_rd - 15, " ".join(words[:9]))
        c.drawString(510, y_rd - 28, " ".join(words[9:]))
        y_rd -= 55

    c.showPage()

    # ==========================================
    # SLIDE 9: READINESS CHECKLIST
    # ==========================================
    draw_background(c)
    draw_header(c, "Compliance & Quality Assurance", "Pre-Evaluation Readiness Checklist")

    draw_card(c, 50, 50, 860, 400)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(GREEN)
    c.drawString(70, 425, "OFFICIAL EVALUATION READINESS CHECKLIST")

    checks = [
        ("Project objectives are clearly defined and documented", "100% Completed & Verified in Report"),
        ("Working prototype / production live demo is ready", "Fully Functional on Next.js 15 & Neon DB"),
        ("Final project report submitted to mentor (Mr. Abhilash Nair)", "Complete Word (.docx) & Markdown Report Submitted"),
        ("All required project milestones achieved according to syllabus", "All 9 Platform Modules Built & Active"),
        ("Presentation slides prepared according to university template", "16:9 Widescreen Conceptual Project 2 Deck Prepared"),
        ("Academic integrity & plagiarism compliance verified (< 20%)", "Rigorous Clean Code & Original Implementation"),
        ("Active team participation and equal workload distribution", "All 4 Team Members Actively Contributed"),
        ("All mentor feedback incorporated into system architecture", "Deterministic-First Pattern Adopted"),
        ("Proof of deployment — GitHub, HackerRank, LeetCode attached", "Active Repository at Mihirkalway2005/InternEdge"),
        ("Source code, unit tests, and database fixtures organized", "33/33 Vitest Tests Passing & Production Seeder")
    ]
    y_ck = 390
    for it, st in checks:
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(GREEN)
        c.drawString(70, y_ck, "✓")

        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(WHITE)
        c.drawString(95, y_ck, it)

        c.setFont("Helvetica", 8.5)
        c.setFillColor(CYAN)
        c.drawString(590, y_ck, f"—   {st}")
        y_ck -= 27

    c.showPage()

    # ==========================================
    # SLIDE 10: 07 | CONCLUSION & LEARNINGS
    # ==========================================
    draw_background(c)
    draw_header(c, "07 | Conclusion & Learnings", "Executive Summary, Measurable Outcomes & Academic Learnings")

    # Left: Summary
    draw_card(c, 50, 50, 410, 400)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(CYAN)
    c.drawString(70, 425, "PROJECT SUMMARY & MEASURABLE OUTCOMES")

    c.setFont("Helvetica", 9)
    c.setFillColor(WHITE)
    c.drawString(70, 395, "Successfully engineered InternEdge, a full-lifecycle career acceleration")
    c.drawString(70, 380, "operating system on Next.js 15, React 19, Tailwind CSS v4, Prisma 7,")
    c.drawString(70, 365, "PostgreSQL, and Groq Cloud LLMs.")

    outs = [
        ("End-to-End Operational System", "9 complete modules deployed spanning Unified Profile, ATS Analyzer, Matching, Roadmaps, Interviews, Kanban, and Portfolios."),
        ("100% Test Suite Verification", "33/33 Vitest unit tests passing across 4 deterministic calculation engines in 135 milliseconds."),
        ("Zero Type Defect Assurance", "Strict TypeScript compilation yielding 0 type errors across 50+ source modules."),
        ("Verified Open-Source Asset", "Public GitHub repository with clean Git commit history, database migrations, and comprehensive documentation.")
    ]
    y_o = 335
    for t, d in outs:
        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(GREEN)
        c.drawString(70, y_o, f"• {t}:")
        c.setFont("Helvetica", 8.5)
        c.setFillColor(MUTED)
        words = d.split()
        c.drawString(80, y_o - 14, " ".join(words[:9]))
        c.drawString(80, y_o - 26, " ".join(words[9:]))
        y_o -= 48

    # Right Top: Learnings
    draw_card(c, 480, 140, 430, 310)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(PURPLE)
    c.drawString(500, 425, "KEY MULTIDISCIPLINARY LEARNINGS")

    lrns = [
        ("Technical Mastery", "Gained deep proficiency in Next.js 15 App Router, React 19 Server Components, Prisma ORM, and Zod runtime schema validation."),
        ("Architectural Discipline", "Learned to separate stochastic LLM enrichments from pure deterministic business math to guarantee zero hallucinations."),
        ("Security Engineering", "Implemented cookie-based session verification, multi-tenant ownership assertions, and token-bucket rate limiting."),
        ("Team Collaboration", "Practiced agile development, Git branch management, and rigorous peer code reviews across four engineering team members.")
    ]
    y_lr = 390
    for t, d in lrns:
        c.setFont("Helvetica-Bold", 9.5)
        c.setFillColor(WHITE)
        c.drawString(500, y_lr, f"• {t}:")
        c.setFont("Helvetica", 8.5)
        c.setFillColor(MUTED)
        words = d.split()
        c.drawString(510, y_lr - 14, " ".join(words[:9]))
        c.drawString(510, y_lr - 26, " ".join(words[9:]))
        y_lr -= 48

    # Right Bottom: Thank you
    draw_card(c, 480, 50, 430, 75, bg_rgb=HexColor("#1E293B"), border_col=CYAN)
    c.setFont("Helvetica-Bold", 12)
    c.setFillColor(CYAN)
    c.drawCentredString(695, 95, "Thank You!  Questions & Feedback Welcome.")
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawCentredString(695, 75, "Mentor: Mr. Abhilash Nair  •  School of Technology, Woxsen University")

    c.showPage()

    c.save()
    print(f"PDF Presentation successfully generated at {pdf_path}!")

if __name__ == "__main__":
    build_pdf()
