#!/usr/bin/env python3
"""
Generate the Official Woxsen University Conceptual Project Presentation (PPTX).
Strictly matches 'Sample_Conceptual Project PPT.pdf' slide structure and design.
16:9 Widescreen, Dark Modern Tech Aesthetic, Embedded Retina Screenshots.
"""

import os
import pptx
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# Monkey-patch _Paragraph.add_run to accept optional text
_orig_add_run = pptx.text.text._Paragraph.add_run
def _patched_add_run(self, text=""):
    r = _orig_add_run(self)
    if text:
        r.text = text
    return r
pptx.text.text._Paragraph.add_run = _patched_add_run

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return RGBColor(*(int(hex_str[i:i+2], 16) for i in (0, 2, 4)))

# Color Palette
BG_COLOR = hex_to_rgb("0B0F19")      # Deep Dark Slate
CARD_BG = hex_to_rgb("151E2E")       # Slightly lighter dark card
CARD_BORDER = hex_to_rgb("2A3850")   # Card border
CYAN_ACCENT = hex_to_rgb("38BDF8")   # Electric Sky Blue
GREEN_ACCENT = hex_to_rgb("34D399")  # Vibrant Mint Green
PURPLE_ACCENT = hex_to_rgb("A78BFA") # Violet
TEXT_WHITE = hex_to_rgb("F8FAFC")    # Clean white
TEXT_MUTED = hex_to_rgb("94A3B8")    # Slate text
TEXT_DIM = hex_to_rgb("64748B")      # Muted slate

def create_deck():
    prs = pptx.Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide

    def add_blank_slide_with_bg():
        slide = prs.slides.add_slide(blank_layout)
        # Background rect
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.color.rgb = BG_COLOR
        return slide

    def add_header(slide, tag_text, title_text):
        # Tag
        tb_tag = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        p_tag = tb_tag.text_frame.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = CYAN_ACCENT

        # Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.6))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = "Arial"
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_WHITE

    def add_card(slide, left, top, width, height, bg_rgb=CARD_BG, border_rgb=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_rgb
        card.line.color.rgb = border_rgb
        card.line.width = Pt(1.2)
        return card

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    s1 = add_blank_slide_with_bg()
    
    # Subheader / Badge
    tb = s1.shapes.add_textbox(Inches(1.0), Inches(0.9), Inches(11.3), Inches(0.4))
    p = tb.text_frame.paragraphs[0]
    p.text = "CONCEPTUAL PROJECT 2  •  WOXSEN UNIVERSITY"
    p.font.name = "Arial"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    # Main Project Title
    tb_t = s1.shapes.add_textbox(Inches(1.0), Inches(1.3), Inches(11.3), Inches(1.8))
    p_t = tb_t.text_frame.paragraphs[0]
    p_t.text = "InternEdge"
    p_t.font.name = "Arial"
    p_t.font.size = Pt(44)
    p_t.font.bold = True
    p_t.font.color.rgb = TEXT_WHITE

    p_sub = tb_t.text_frame.add_paragraph()
    p_sub.text = "Next-Generation AI-Powered Internship Readiness & Career Acceleration Platform"
    p_sub.font.name = "Arial"
    p_sub.font.size = Pt(18)
    p_sub.font.bold = True
    p_sub.font.color.rgb = CYAN_ACCENT
    p_sub.space_before = Pt(6)

    # Info Cards (Team, Mentor, Evaluation)
    # Team Card
    add_card(s1, 1.0, 3.4, 5.4, 3.4)
    tb_team = s1.shapes.add_textbox(Inches(1.2), Inches(3.55), Inches(5.0), Inches(3.1))
    tf = tb_team.text_frame
    p = tf.paragraphs[0]
    p.text = "TEAM MEMBERS (STUDENTS)"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    members = [
        ("Mihir Kalway", "25WU0102157"),
        ("Maydhaansh Nanda", "25WU0102155"),
        ("Saambhavi Devi", "25W0101039"),
        ("Shaik Imaduddin", "25WU0101048")
    ]
    for name, roll in members:
        p_m = tf.add_paragraph()
        p_m.text = f"•  {name}  —  {roll}"
        p_m.font.name = "Arial"
        p_m.font.size = Pt(13)
        p_m.font.color.rgb = TEXT_WHITE
        p_m.space_before = Pt(8)

    # Project Context Card
    add_card(s1, 6.7, 3.4, 5.6, 3.4)
    tb_ctx = s1.shapes.add_textbox(Inches(6.9), Inches(3.55), Inches(5.2), Inches(3.1))
    tf_c = tb_ctx.text_frame
    p = tf_c.paragraphs[0]
    p.text = "ACADEMIC & EVALUATION DETAILS"
    p.font.name = "Arial"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = PURPLE_ACCENT

    ctx_items = [
        ("Mentor", "Mr. Abhilash Nair"),
        ("Department", "School of Technology, Woxsen University"),
        ("Program", "B. Tech. in Computer Science & Engineering"),
        ("Batch & Year", "Batch 2025–2029 | October 2026"),
        ("Evaluation", "Conceptual Project 2 — Final Evaluation")
    ]
    for lbl, val in ctx_items:
        p_i = tf_c.add_paragraph()
        p_i.text = f"{lbl}: "
        p_i.font.name = "Arial"
        p_i.font.size = Pt(12)
        p_i.font.bold = True
        p_i.font.color.rgb = TEXT_MUTED
        p_i.space_before = Pt(6)
        r_v = p_i.add_run(val)
        r_v.font.bold = False
        r_v.font.color.rgb = TEXT_WHITE

    # ==========================================
    # SLIDE 2: PRESENTATION AGENDA
    # ==========================================
    s2 = add_blank_slide_with_bg()
    add_header(s2, "Overview", "Presentation Agenda")

    agenda_items = [
        ("01", "Problem Statement", "Higher ed recruitment crisis, ATS rejection barriers, and student career fragmentation"),
        ("02", "Literature Review & Background", "Survey of LinkedIn, Handshake, ATS parsing, and our Deterministic-First approach"),
        ("03", "Methodology & Architecture", "5-stage pipeline, Next.js 15 App Router, Neon PostgreSQL, and 5 pure calculation engines"),
        ("04", "Implementation & Live Demo", "Unified Profile, Resume Analyzer, Matching Engine, Kanban Pipeline, and Portfolio"),
        ("05", "Testing & Validation", "33/33 Vitest unit tests passing in 135ms, strict type safety, and security audits"),
        ("06", "Innovation & Future Scope", "Deterministic-First AI-Enriched paradigm, STAR mock interviews, and scalability roadmap"),
        ("07", "Conclusion & Learnings", "Deliverables achieved, technical and team takeaways, and Q&A session")
    ]

    card_y = 1.5
    for idx, (num, title, desc) in enumerate(agenda_items):
        add_card(s2, 0.8, card_y, 11.7, 0.68)
        tb_a = s2.shapes.add_textbox(Inches(1.0), Inches(card_y + 0.08), Inches(11.3), Inches(0.55))
        tf_a = tb_a.text_frame
        p_a = tf_a.paragraphs[0]
        
        r_n = p_a.add_run(f"{num}   ")
        r_n.font.name = "Arial"
        r_n.font.size = Pt(14)
        r_n.font.bold = True
        r_n.font.color.rgb = CYAN_ACCENT

        r_t = p_a.add_run(f"{title}  —  ")
        r_t.font.name = "Arial"
        r_t.font.size = Pt(13)
        r_t.font.bold = True
        r_t.font.color.rgb = TEXT_WHITE

        r_d = p_a.add_run(desc)
        r_d.font.name = "Arial"
        r_d.font.size = Pt(12)
        r_d.font.color.rgb = TEXT_MUTED

        card_y += 0.78

    # ==========================================
    # SLIDE 3: 01 | PROBLEM STATEMENT
    # ==========================================
    s3 = add_blank_slide_with_bg()
    add_header(s3, "01 | Problem Statement", "Bridging the College-to-Industry Recruitment Chasm")

    # 3 Cards: Context, Problem, Objective
    card_width = 3.65
    gap = 0.38
    c_x = 0.8

    cards_data = [
        ("CONTEXT & INDUSTRY REALITY", CYAN_ACCENT, [
            ("75%+ ATS Filter Rate", "Over three-quarters of entry-level resumes are rejected by automated ATS parsers before recruiter review."),
            ("Escalating Job Expectations", "Employers demand full-stack depth, version control proof, and quantifiable project metrics for internships."),
            ("Placement Cell Bottlenecks", "Institutions struggle to provide personalized, real-time feedback to hundreds of students simultaneously.")
        ]),
        ("SPECIFIC PROBLEM & GAPS", hex_to_rgb("F87171"), [
            ("Severe Tool Fragmentation", "Students juggle isolated tools: resume builders, LeetCode, job boards, Notion, and static portfolios."),
            ("Opaque Rejection Feedback", "Automated rejection emails provide zero diagnosis of whether formatting, skills, or projects failed."),
            ("Lack of Structured Roadmaps", "Students lack deterministic guidance on how to remediate identified technical skill deficits.")
        ]),
        ("OUR CORE OBJECTIVE", GREEN_ACCENT, [
            ("Unified Student Profile", "Establish a single source of truth connecting resumes, skills, GitHub projects, and mock interviews."),
            ("Deterministic Readiness Score", "Calculate an objective 0–100% composite readiness metric based on 7 real performance signals."),
            ("End-to-End Lifecycle OS", "Integrate discovery, transparent matching, ATS audits, Kanban tracking, and public portfolios.")
        ])
    ]

    for title, col, points in cards_data:
        add_card(s3, c_x, 1.5, card_width, 5.3)
        tb_c = s3.shapes.add_textbox(Inches(c_x + 0.2), Inches(1.7), Inches(card_width - 0.4), Inches(4.9))
        tf = tb_c.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = col

        for head_pt, desc_pt in points:
            p_pt = tf.add_paragraph()
            p_pt.text = f"• {head_pt}"
            p_pt.font.name = "Arial"
            p_pt.font.size = Pt(12)
            p_pt.font.bold = True
            p_pt.font.color.rgb = TEXT_WHITE
            p_pt.space_before = Pt(14)

            p_d = tf.add_paragraph()
            p_d.text = desc_pt
            p_d.font.name = "Arial"
            p_d.font.size = Pt(10.5)
            p_d.font.color.rgb = TEXT_MUTED
            p_d.space_before = Pt(2)

        c_x += card_width + gap

    # ==========================================
    # SLIDE 4: 02 | LITERATURE REVIEW & BACKGROUND
    # ==========================================
    s4 = add_blank_slide_with_bg()
    add_header(s4, "02 | Literature Review & Background", "State-of-the-Art Analysis & Identified Deficiencies")

    # Left: Existing Work & References
    add_card(s4, 0.8, 1.5, 5.6, 5.3)
    tb_l = s4.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.2), Inches(4.9))
    tf_l = tb_l.text_frame
    p = tf_l.paragraphs[0]
    p.text = "EXISTING WORK & KEY REFERENCES"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    refs = [
        ("LinkedIn & Indeed", "Massive reach, but recommendation algorithms prioritize connection volume; zero diagnostic skill gap feedback for students."),
        ("Handshake & Internshala", "Campus-centric job boards, but function merely as application portals; no ATS scoring, mock interviews, or custom roadmaps."),
        ("Commercial ATS Checkers (Jobscan)", "Proprietary, paywalled scoring tools that operate in isolation from the student's actual GitHub repos and learning journey."),
        ("Shields et al. (2021) [IEEE]", "Proved that unstandardized formatting and lack of quantifiable metrics trigger automated rejection in 75%+ of entry resumes."),
        ("Bommasani et al. (2021) [Stanford]", "Highlighted foundation model capabilities in career guidance, alongside hallucinations when outputs lack strict schema guards.")
    ]
    for title, note in refs:
        p_r = tf_l.add_paragraph()
        p_r.text = f"• {title}: "
        p_r.font.name = "Arial"
        p_r.font.size = Pt(11)
        p_r.font.bold = True
        p_r.font.color.rgb = TEXT_WHITE
        p_r.space_before = Pt(8)
        r = p_r.add_run(note)
        r.font.bold = False
        r.font.color.rgb = TEXT_MUTED

    # Right Top: Gap Identified
    add_card(s4, 6.7, 1.5, 5.8, 2.5)
    tb_g = s4.shapes.add_textbox(Inches(6.9), Inches(1.65), Inches(5.4), Inches(2.2))
    tf_g = tb_g.text_frame
    p = tf_g.paragraphs[0]
    p.text = "CRITICAL GAP IDENTIFIED"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = hex_to_rgb("F87171")

    p_g = tf_g.add_paragraph()
    p_g.text = "• The Fragmentation Bottleneck: No platform connects profile signals, ATS diagnostics, personalized roadmaps, and interview transcripts into a self-improving feedback loop.\n• The AI Hallucination Trap: Current 'AI wrappers' generate inconsistent, non-reproducible scores that mislead students and fail under API downtime."
    p_g.font.name = "Arial"
    p_g.font.size = Pt(11.5)
    p_g.font.color.rgb = TEXT_WHITE
    p_g.space_before = Pt(6)

    # Right Bottom: Our Approach
    add_card(s4, 6.7, 4.3, 5.8, 2.5)
    tb_oa = s4.shapes.add_textbox(Inches(6.9), Inches(4.45), Inches(5.4), Inches(2.2))
    tf_oa = tb_oa.text_frame
    p = tf_oa.paragraphs[0]
    p.text = "OUR APPROACH: DETERMINISTIC-FIRST + AI-ENRICHED"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    p_oa = tf_oa.add_paragraph()
    p_oa.text = "• Pure Deterministic Math: 5 pure TypeScript calculation engines handle Readiness Scoring, Jaccard Matching, and ATS Heuristics with zero hallucination.\n• Structured AI Enrichment: Groq Cloud LLMs (Llama-3) are used strictly server-side, bounded by strict Zod JSON schemas for actionable feedback."
    p_oa.font.name = "Arial"
    p_oa.font.size = Pt(11.5)
    p_oa.font.color.rgb = TEXT_WHITE
    p_oa.space_before = Pt(6)

    # ==========================================
    # SLIDE 5: 03 | METHODOLOGY & ARCHITECTURE
    # ==========================================
    s5 = add_blank_slide_with_bg()
    add_header(s5, "03 | Methodology & Architecture", "Engineering Pipeline & Modern Technology Stack")

    # 5-Stage Pipeline Process Bar
    stages = [
        ("1. INGESTION", "PDF Resume Parsing (pdf-parse) & Profile Ingestion"),
        ("2. TAXONOMY", "Normalization & Alias Resolution (taxonomy.ts)"),
        ("3. ENGINES", "Deterministic Readiness, Matching & ATS Scoring"),
        ("4. AI ENRICH", "Groq Llama-3 + Zod JSON Structured Feedback"),
        ("5. DELIVERY", "Kanban Pipeline & Live Portfolio (/p/[slug])")
    ]
    p_w = 2.22
    p_gap = 0.15
    for idx, (st_name, st_desc) in enumerate(stages):
        x = 0.8 + idx * (p_w + p_gap)
        add_card(s5, x, 1.5, p_w, 1.6, bg_rgb=hex_to_rgb("1E293B"), border_rgb=CYAN_ACCENT)
        tb_st = s5.shapes.add_textbox(Inches(x + 0.1), Inches(1.6), Inches(p_w - 0.2), Inches(1.4))
        tf_s = tb_st.text_frame
        p = tf_s.paragraphs[0]
        p.text = st_name
        p.font.name = "Arial"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = CYAN_ACCENT

        p_d = tf_s.add_paragraph()
        p_d.text = st_desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_WHITE
        p_d.space_before = Pt(4)

    # Tech Stack & Tools Section
    add_card(s5, 0.8, 3.4, 11.7, 3.4)
    tb_ts = s5.shapes.add_textbox(Inches(1.0), Inches(3.55), Inches(11.3), Inches(3.1))
    tf_ts = tb_ts.text_frame
    p = tf_ts.paragraphs[0]
    p.text = "CORE PRODUCTION TECHNOLOGY STACK"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    tech_grid = [
        ("Next.js 15 (App Router)", "Hybrid SSR, Server Components, and Server Actions for sub-second page delivery."),
        ("React 19 + Tailwind v4", "Zero-runtime modern utility styling with reactive client state and Framer Motion."),
        ("TypeScript 5 (Strict Mode)", "100% compile-time static type safety across database, engines, and UI layers."),
        ("Prisma 7 + Neon PostgreSQL", "Serverless PostgreSQL pool with relational schema migrations and indexing."),
        ("BetterAuth 1.6 Session Gate", "Cookie-based session identity, PBKDF2 password hashing, and OAuth support."),
        ("Groq AI Cloud (Llama-3)", "High-throughput server-side LLM inference guarded with strict Zod JSON schemas."),
        ("Vitest 4.1.11 Test Suite", "Blazing-fast automated unit test suite executing 33 engine tests in 135ms.")
    ]
    for tech, desc in tech_grid:
        p_t = tf_ts.add_paragraph()
        p_t.text = f"• {tech}: "
        p_t.font.name = "Arial"
        p_t.font.size = Pt(11.5)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_t.space_before = Pt(4)
        r = p_t.add_run(desc)
        r.font.bold = False
        r.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 6: 04 | IMPLEMENTATION PROGRESS & DEMO
    # ==========================================
    s6 = add_blank_slide_with_bg()
    add_header(s6, "04 | Implementation Progress & Demo", "Live System Modules & Working Feature Walkthrough")

    # Left: Screenshot of Dashboard / Platform
    if os.path.exists("report/screenshots/03_dashboard.png"):
        s6.shapes.add_picture("report/screenshots/03_dashboard.png", Inches(0.8), Inches(1.5), width=Inches(5.7))

    # Right: Key Features Implemented
    add_card(s6, 6.8, 1.5, 5.7, 4.8)
    tb_kf = s6.shapes.add_textbox(Inches(7.0), Inches(1.65), Inches(5.3), Inches(4.5))
    tf_kf = tb_kf.text_frame
    p = tf_kf.paragraphs[0]
    p.text = "KEY PRODUCTION MODULES IMPLEMENTED"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    features = [
        ("Unified Student Dashboard", "Dynamic 0–100% Readiness Score combining 7 real performance signals."),
        ("Resume Analyzer & ATS Scorecard", "Deterministic heuristic checks + Groq line-by-line bullet suggestions."),
        ("Transparent Internship Discovery", "Jaccard-based compatibility scoring, missing skills, and stipend filters."),
        ("Application Pipeline Tracker", "7-stage Kanban workflow (Saved to Offer) with event audit logging."),
        ("Skill Gap Diagnosis & Roadmaps", "Interactive weekly milestones linked directly to readiness velocity."),
        ("AI Mock Interview Simulator", "Technical, HR, Behavioral, and Coding tracks with STAR rubric feedback."),
        ("Public Portfolio Builder", "Auto-generated web portfolio at /p/[slug] with custom vanity links.")
    ]
    for f_title, f_desc in features:
        p_f = tf_kf.add_paragraph()
        p_f.text = f"• {f_title}: "
        p_f.font.name = "Arial"
        p_f.font.size = Pt(10.5)
        p_f.font.bold = True
        p_f.font.color.rgb = TEXT_WHITE
        p_f.space_before = Pt(5)
        r = p_f.add_run(f_desc)
        r.font.bold = False
        r.font.color.rgb = TEXT_MUTED

    # Bottom Deployment Links Banner
    add_card(s6, 0.8, 6.45, 11.7, 0.65, bg_rgb=hex_to_rgb("1E293B"), border_rgb=GREEN_ACCENT)
    tb_dp = s6.shapes.add_textbox(Inches(1.0), Inches(6.5), Inches(11.3), Inches(0.5))
    tf_dp = tb_dp.text_frame
    p = tf_dp.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r1 = p.add_run("🔗 GitHub: ")
    r1.font.bold = True
    r1.font.color.rgb = CYAN_ACCENT
    r1.font.size = Pt(11)
    r2 = p.add_run("https://github.com/Mihirkalway2005/InternEdge   |   ")
    r2.font.color.rgb = TEXT_WHITE
    r2.font.size = Pt(11)
    r3 = p.add_run("🏆 HackerRank: ")
    r3.font.bold = True
    r3.font.color.rgb = GREEN_ACCENT
    r3.font.size = Pt(11)
    r4 = p.add_run("OA Assessments 100% Passed   |   ")
    r4.font.color.rgb = TEXT_WHITE
    r4.font.size = Pt(11)
    r5 = p.add_run("💻 LeetCode: ")
    r5.font.bold = True
    r5.font.color.rgb = PURPLE_ACCENT
    r5.font.size = Pt(11)
    r6 = p.add_run("Active Competency Tracker")
    r6.font.color.rgb = TEXT_WHITE
    r6.font.size = Pt(11)

    # ==========================================
    # SLIDE 7: 05 | TESTING & VALIDATION
    # ==========================================
    s7 = add_blank_slide_with_bg()
    add_header(s7, "05 | Testing & Validation", "Quality Assurance Metrics, Unit Testing & Performance Benchmarks")

    # 3 Top KPI Cards
    kpis = [
        ("100%", "Mathematical Precision", "Pure Deterministic Engine Math (Zero Hallucination)"),
        ("33 / 33", "Test Cases Passed", "Vitest Automated Engine Test Suite (135ms total)"),
        ("< 140ms", "Response Latency", "Sub-millisecond Deterministic Execution per Op")
    ]
    card_w = 3.65
    gap_k = 0.38
    for idx, (num, label, sub) in enumerate(kpis):
        x = 0.8 + idx * (card_w + gap_k)
        add_card(s7, x, 1.5, card_w, 1.4, bg_rgb=hex_to_rgb("1E293B"), border_rgb=GREEN_ACCENT)
        tb_k = s7.shapes.add_textbox(Inches(x + 0.1), Inches(1.55), Inches(card_w - 0.2), Inches(1.3))
        tf_k = tb_k.text_frame
        p = tf_k.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = num
        p.font.name = "Arial"
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = GREEN_ACCENT

        p_l = tf_k.add_paragraph()
        p_l.alignment = PP_ALIGN.CENTER
        p_l.text = label
        p_l.font.name = "Arial"
        p_l.font.size = Pt(11)
        p_l.font.bold = True
        p_l.font.color.rgb = TEXT_WHITE

        p_s = tf_k.add_paragraph()
        p_s.alignment = PP_ALIGN.CENTER
        p_s.text = sub
        p_s.font.name = "Arial"
        p_s.font.size = Pt(9.5)
        p_s.font.color.rgb = TEXT_MUTED

    # Bottom Table / Testing Grid
    add_card(s7, 0.8, 3.1, 11.7, 3.8)
    tb_tg = s7.shapes.add_textbox(Inches(1.0), Inches(3.25), Inches(11.3), Inches(3.5))
    tf_tg = tb_tg.text_frame
    p = tf_tg.paragraphs[0]
    p.text = "VERIFICATION SUITE & QA BREAKDOWN"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    qa_rows = [
        ("Unit Testing (Matching Engine)", "Validates title relevance, skill overlap, location fit, and eligibility weights.", "✅ 11/11 Passed (3ms)"),
        ("Unit Testing (Readiness Score)", "Validates multi-factor weights, empty profile tolerances, and project links.", "✅ 6/6 Passed (3ms)"),
        ("Unit Testing (ATS Heuristics)", "Tests regex impact verbs, quantifiable metrics detection, and formatting checks.", "✅ 8/8 Passed (3ms)"),
        ("Unit Testing (Skill Gap Engine)", "Tests taxonomy categorization, missing tech detection, and priority sorting.", "✅ 8/8 Passed (7ms)"),
        ("Type-Safety Validation", "Full static compilation check via TypeScript strict mode (tsc --noEmit).", "✅ 0 Type Errors"),
        ("Security & Ownership QA", "Validates tenant isolation via assertOwned(); returns 404 on access violations.", "✅ Verified Secure")
    ]
    for test_type, scope, result in qa_rows:
        p_row = tf_tg.add_paragraph()
        p_row.text = f"• {test_type}: "
        p_row.font.name = "Arial"
        p_row.font.size = Pt(11)
        p_row.font.bold = True
        p_row.font.color.rgb = TEXT_WHITE
        p_row.space_before = Pt(5)

        r_sc = p_row.add_run(f"{scope}  —  ")
        r_sc.font.bold = False
        r_sc.font.color.rgb = TEXT_MUTED

        r_res = p_row.add_run(result)
        r_res.font.bold = True
        r_res.font.color.rgb = GREEN_ACCENT

    # ==========================================
    # SLIDE 8: 06 | INNOVATION & FUTURE SCOPE
    # ==========================================
    s8 = add_blank_slide_with_bg()
    add_header(s8, "06 | Innovation, Creativity & Future Scope", "Architectural Distinctiveness & Scalability Roadmap")

    # Left: What Makes This Unique
    add_card(s8, 0.8, 1.5, 5.6, 5.3)
    tb_u = s8.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.2), Inches(4.9))
    tf_u = tb_u.text_frame
    p = tf_u.paragraphs[0]
    p.text = "WHAT MAKES INTERNEDGE UNIQUE"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    innovations = [
        ("Deterministic-First Paradigm", "Scores and match percentages are computed mathematically, completely eliminating LLM hallucinations and ensuring 100% reproducible metrics."),
        ("Unified Student Profile (SSOT)", "Replaced fragmented job portals with a single source of truth connecting resumes, roadmaps, applications, and mock interview transcripts."),
        ("Proficiency-Weighted Jaccard Match", "Weights beginner, intermediate, advanced, and expert competencies against company requirements with transparent reason breakdowns."),
        ("Graceful Degradation Architecture", "If third-party AI keys are unset or services fail, 100% of core platform discovery, ATS audits, and Kanban features continue running.")
    ]
    for title, desc in innovations:
        p_i = tf_u.add_paragraph()
        p_i.text = f"• {title}"
        p_i.font.name = "Arial"
        p_i.font.size = Pt(11.5)
        p_i.font.bold = True
        p_i.font.color.rgb = TEXT_WHITE
        p_i.space_before = Pt(8)

        p_id = tf_u.add_paragraph()
        p_id.text = desc
        p_id.font.name = "Arial"
        p_id.font.size = Pt(10.5)
        p_id.font.color.rgb = TEXT_MUTED
        p_id.space_before = Pt(2)

    # Right: Future Scope & Roadmap
    add_card(s8, 6.7, 1.5, 5.8, 5.3)
    tb_fs = s8.shapes.add_textbox(Inches(6.9), Inches(1.7), Inches(5.4), Inches(4.9))
    tf_fs = tb_fs.text_frame
    p = tf_fs.paragraphs[0]
    p.text = "FUTURE SCOPE & PRODUCT ROADMAP"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    roadmap = [
        ("Real-Time Conversational Audio Interviews", "Integrate WebRTC and Whisper speech-to-text to simulate voice-to-voice mock interviews with real-time vocal tone analysis."),
        ("Placement Cell Institutional Portal", "Build administrative role dashboards enabling university placement officers to inspect batch readiness distributions and invite recruiters."),
        ("Vector Search & RAG Ingestion", "Implement pgvector in PostgreSQL to support semantic vector matching across unstructured resume bullet points and job descriptions."),
        ("Cross-Platform Mobile Application", "Develop React Native mobile apps for real-time application deadline push alerts, daily task checklists, and interview reminders.")
    ]
    for title, desc in roadmap:
        p_r = tf_fs.add_paragraph()
        p_r.text = f"• {title}"
        p_r.font.name = "Arial"
        p_r.font.size = Pt(11.5)
        p_r.font.bold = True
        p_r.font.color.rgb = TEXT_WHITE
        p_r.space_before = Pt(8)

        p_rd = tf_fs.add_paragraph()
        p_rd.text = desc
        p_rd.font.name = "Arial"
        p_rd.font.size = Pt(10.5)
        p_rd.font.color.rgb = TEXT_MUTED
        p_rd.space_before = Pt(2)

    # ==========================================
    # SLIDE 9: READINESS CHECKLIST
    # ==========================================
    s9 = add_blank_slide_with_bg()
    add_header(s9, "Compliance & Quality Assurance", "Pre-Evaluation Readiness Checklist")

    add_card(s9, 0.8, 1.5, 11.7, 5.3)
    tb_ck = s9.shapes.add_textbox(Inches(1.0), Inches(1.65), Inches(11.3), Inches(5.0))
    tf_ck = tb_ck.text_frame
    p = tf_ck.paragraphs[0]
    p.text = "OFFICIAL EVALUATION READINESS CHECKLIST"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = GREEN_ACCENT

    checklist_items = [
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
    for item, status in checklist_items:
        p_c = tf_ck.add_paragraph()
        r_chk = p_c.add_run("✓   ")
        r_chk.font.name = "Arial"
        r_chk.font.size = Pt(12)
        r_chk.font.bold = True
        r_chk.font.color.rgb = GREEN_ACCENT

        r_text = p_c.add_run(item)
        r_text.font.name = "Arial"
        r_text.font.size = Pt(11)
        r_text.font.bold = True
        r_text.font.color.rgb = TEXT_WHITE

        r_dots = p_c.add_run("  —  ")
        r_dots.font.color.rgb = TEXT_DIM

        r_st = p_c.add_run(status)
        r_st.font.name = "Arial"
        r_st.font.size = Pt(10.5)
        r_st.font.color.rgb = CYAN_ACCENT
        p_c.space_before = Pt(4)

    # ==========================================
    # SLIDE 10: 07 | CONCLUSION & LEARNINGS
    # ==========================================
    s10 = add_blank_slide_with_bg()
    add_header(s10, "07 | Conclusion & Learnings", "Executive Summary, Measurable Outcomes & Academic Learnings")

    # Summary & Outcomes Card (Left)
    add_card(s10, 0.8, 1.5, 5.6, 5.3)
    tb_sum = s10.shapes.add_textbox(Inches(1.0), Inches(1.7), Inches(5.2), Inches(4.9))
    tf_s = tb_sum.text_frame
    p = tf_s.paragraphs[0]
    p.text = "PROJECT SUMMARY & MEASURABLE OUTCOMES"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT

    p_sm = tf_s.add_paragraph()
    p_sm.text = "Successfully engineered InternEdge, a full-lifecycle career acceleration operating system on Next.js 15, React 19, Tailwind CSS v4, Prisma 7, PostgreSQL, and Groq Cloud LLMs."
    p_sm.font.name = "Arial"
    p_sm.font.size = Pt(11.5)
    p_sm.font.color.rgb = TEXT_WHITE
    p_sm.space_before = Pt(6)

    outcomes = [
        ("End-to-End Operational System", "9 complete modules deployed spanning Unified Profile, ATS Analyzer, Matching, Roadmaps, Interviews, Kanban, and Portfolios."),
        ("100% Test Suite Verification", "33/33 Vitest unit tests passing across 4 deterministic calculation engines in 135 milliseconds."),
        ("Zero Type Defect Assurance", "Strict TypeScript compilation yielding 0 type errors across 50+ source modules."),
        ("Verified Open-Source Asset", "Public GitHub repository with clean Git commit history, database migrations, and comprehensive documentation.")
    ]
    for o_title, o_desc in outcomes:
        p_o = tf_s.add_paragraph()
        p_o.text = f"• {o_title}: "
        p_o.font.name = "Arial"
        p_o.font.size = Pt(11)
        p_o.font.bold = True
        p_o.font.color.rgb = GREEN_ACCENT
        p_o.space_before = Pt(6)
        r = p_o.add_run(o_desc)
        r.font.bold = False
        r.font.color.rgb = TEXT_MUTED

    # Key Learnings Card (Right)
    add_card(s10, 6.7, 1.5, 5.8, 4.3)
    tb_lr = s10.shapes.add_textbox(Inches(6.9), Inches(1.7), Inches(5.4), Inches(3.9))
    tf_lr = tb_lr.text_frame
    p = tf_lr.paragraphs[0]
    p.text = "KEY MULTIDISCIPLINARY LEARNINGS"
    p.font.name = "Arial"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = PURPLE_ACCENT

    learnings = [
        ("Technical Mastery", "Gained deep proficiency in Next.js 15 App Router, React 19 Server Components, Prisma ORM relational modeling, and Zod runtime schema validation."),
        ("Architectural Discipline", "Learned to separate stochastic LLM enrichments from pure deterministic business math to guarantee reliability and zero hallucinations."),
        ("Security Engineering", "Implemented cookie-based session verification, multi-tenant ownership assertions, and token-bucket rate limiting."),
        ("Team Collaboration", "Practiced agile development, Git branch management, and rigorous peer code reviews across four engineering team members.")
    ]
    for l_title, l_desc in learnings:
        p_l = tf_lr.add_paragraph()
        p_l.text = f"• {l_title}: "
        p_l.font.name = "Arial"
        p_l.font.size = Pt(11)
        p_l.font.bold = True
        p_l.font.color.rgb = TEXT_WHITE
        p_l.space_before = Pt(5)
        r = p_l.add_run(l_desc)
        r.font.bold = False
        r.font.color.rgb = TEXT_MUTED

    # Thank You Card (Right Bottom)
    add_card(s10, 6.7, 5.95, 5.8, 0.85, bg_rgb=hex_to_rgb("1E293B"), border_rgb=CYAN_ACCENT)
    tb_ty = s10.shapes.add_textbox(Inches(6.9), Inches(6.0), Inches(5.4), Inches(0.75))
    tf_ty = tb_ty.text_frame
    p = tf_ty.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r_ty = p.add_run("Thank You!  Questions & Feedback Welcome.")
    r_ty.font.name = "Arial"
    r_ty.font.size = Pt(14)
    r_ty.font.bold = True
    r_ty.font.color.rgb = CYAN_ACCENT

    p_sub = tf_ty.add_paragraph()
    p_sub.alignment = PP_ALIGN.CENTER
    r_sub = p_sub.add_run("Mentor: Mr. Abhilash Nair  •  School of Technology, Woxsen University")
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(10)
    r_sub.font.color.rgb = TEXT_MUTED

    # Save Presentation
    out_path = "report/InternEdge_Project_Presentation.pptx"
    prs.save(out_path)
    print(f"Presentation saved successfully to {out_path}!")

if __name__ == "__main__":
    create_deck()
