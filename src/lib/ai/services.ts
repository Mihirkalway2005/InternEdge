import { chatJSON, isAIEnabled } from "@/lib/ai/provider"
import {
  ATS_ANALYSIS_SYSTEM,
  ANSWER_EVALUATION_SYSTEM,
  ASSISTANT_SYSTEM,
  CONTEXT_DIGEST_MAX_CHARS,
  guardUntrusted,
  INTERVIEW_QUESTIONS_SYSTEM,
  RESUME_IMPROVE_SYSTEM,
  RESUME_PARSE_SYSTEM,
  ROADMAP_SYSTEM,
} from "@/lib/ai/prompts"
import {
  AnswerEvaluationSchema,
  ATSAnalysisSchema,
  ImprovementSetSchema,
  InterviewQuestionsSchema,
  RoadmapPlanSchema,
  StructuredResumeSchema,
  type AnswerEvaluation,
  type ATSAnalysis,
  type ImprovementSet,
  type InterviewQuestions,
  type RoadmapPlan,
  type StructuredResume,
  AssistantReplySchema,
} from "@/lib/ai/schemas"
import {
  computeATSHeuristics,
  computeKeywordCoverage,
} from "@/lib/engine/ats-heuristics"
import { expectedSkillsForRole } from "@/lib/engine/taxonomy"

// ---------- Resume parsing ----------

export async function parseResume(
  text: string,
): Promise<StructuredResume | null> {
  if (!isAIEnabled()) return null
  try {
    return await chatJSON({
      system: RESUME_PARSE_SYSTEM,
      user: guardUntrusted("resume_text", text),
      schema: StructuredResumeSchema,
      maxTokens: 3000,
    })
  } catch (err) {
    console.error("[ai] resume parse failed:", err)
    return null
  }
}

/** Regex-based fallback extraction used when AI is disabled/unavailable. */
export function heuristicParse(
  text: string,
): Partial<StructuredResume> & { skills: string[] } {
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0] ?? null
  const links = [
    ...new Set(
      (text.match(/https?:\/\/[^\s)]+/g) ?? []).map((l) =>
        l.replace(/[.,]$/, ""),
      ),
    ),
  ].slice(0, 8)
  const github = text.match(/github\.com\/[\w-]+/i)?.[0]
  const linkedin = text.match(/linkedin\.com\/in\/[\w-]+/i)?.[0]

  const skillLineMatch = text.match(
    /(?:skills|technical skills|technologies)[:\s]*([^\n]+)/i,
  )
  const skills = skillLineMatch
    ? skillLineMatch[1]
        .split(/[,•|]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 40)
        .slice(0, 30)
    : []

  return {
    email,
    links:
      github && !links.some((l) => l.includes("github.com"))
        ? [...links, `https://${github}`]
        : links,
    skills,
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
  }
}

// ---------- ATS analysis ----------

export async function analyzeResume(input: {
  text: string
  structured: unknown
  targetRole?: string | null
}): Promise<ATSAnalysis> {
  const roleKeywords = expectedSkillsForRole(
    input.targetRole || "software engineer",
  )
  const heuristics = computeATSHeuristics(
    input.text,
    input.structured as StructuredResume | null,
  )
  const coverage = computeKeywordCoverage(input.text, roleKeywords)

  // Deterministic composite baseline — reproducible without AI.
  const baseline = Math.round(
    heuristics.formatting * 0.15 +
      heuristics.impactVerbs * 0.2 +
      heuristics.quantification * 0.2 +
      heuristics.sectionCompleteness * 0.2 +
      coverage.coveragePct * 0.25,
  )

  if (!isAIEnabled()) {
    return {
      overallScore: Math.min(Math.max(baseline, 5), 98),
      dimensions: {
        keywordCoverage: coverage.coveragePct,
        formatting: heuristics.formatting,
        impactVerbs: heuristics.impactVerbs,
        quantification: heuristics.quantification,
        sectionCompleteness: heuristics.sectionCompleteness,
        relevanceToRole: coverage.coveragePct,
      },
      matchedKeywords: coverage.matched.slice(0, 25),
      missingKeywords: coverage.missing.slice(0, 15),
      suggestions: buildHeuristicSuggestions(heuristics, coverage.missing).map(
        (s) => ({ ...s, priority: s.priority as "high" | "medium" | "low" }),
      ),
      summary:
        "Heuristic analysis (AI provider not configured): score derived from deterministic formatting, keyword-coverage and content checks.",
    }
  }

  try {
    const aiResult = await chatJSON({
      system: ATS_ANALYSIS_SYSTEM,
      user: `Target role: ${input.targetRole || "Software Engineering Intern"}
Deterministic sub-scores for calibration (formatting ${heuristics.formatting}, impactVerbs ${heuristics.impactVerbs}, quantification ${heuristics.quantification}, sections ${heuristics.sectionCompleteness}, keywordCoverage ${coverage.coveragePct}).
Missing taxonomy keywords: ${coverage.missing.join(", ") || "none"}.
${guardUntrusted("resume_text", input.text)}`,
      schema: ATSAnalysisSchema,
      maxTokens: 2000,
    })

    // Blend: AI narrative + deterministic floor to keep scores stable.
    return {
      ...aiResult,
      overallScore: Math.round(aiResult.overallScore * 0.6 + baseline * 0.4),
      dimensions: {
        ...aiResult.dimensions,
        keywordCoverage: Math.round(
          aiResult.dimensions.keywordCoverage * 0.4 +
            coverage.coveragePct * 0.6,
        ),
      },
      matchedKeywords: [
        ...new Set([...aiResult.matchedKeywords, ...coverage.matched]),
      ].slice(0, 30),
      missingKeywords: [
        ...new Set([...aiResult.missingKeywords, ...coverage.missing]),
      ].slice(0, 20),
    }
  } catch (err) {
    console.error("[ai] ats analysis failed, using heuristic result:", err)
    return {
      overallScore: Math.min(Math.max(baseline, 5), 98),
      dimensions: {
        keywordCoverage: coverage.coveragePct,
        formatting: heuristics.formatting,
        impactVerbs: heuristics.impactVerbs,
        quantification: heuristics.quantification,
        sectionCompleteness: heuristics.sectionCompleteness,
        relevanceToRole: coverage.coveragePct,
      },
      matchedKeywords: coverage.matched.slice(0, 25),
      missingKeywords: coverage.missing.slice(0, 15),
      suggestions: buildHeuristicSuggestions(heuristics, coverage.missing).map(
        (s) => ({ ...s, priority: s.priority as "high" | "medium" | "low" }),
      ),
      summary:
        "Analyzed with deterministic heuristics after the AI service was unavailable.",
    }
  }
}

function buildHeuristicSuggestions(
  h: ReturnType<typeof computeATSHeuristics>,
  missing: string[],
): { title: string detail: string priority: string }[] {
  const out: { title: string detail: string priority: string }[] = []
  if (h.quantification < 50)
    out.push({
      title: "Quantify your impact",
      detail:
        "Add measurable outcomes (%, latency, users, revenue) to your bullet points.",
      priority: "high",
    })
  if (h.impactVerbs < 60)
    out.push({
      title: "Start bullets with action verbs",
      detail:
        "Begin each bullet with verbs like Built, Optimized, Led, Automated.",
      priority: "medium",
    })
  if (missing.length > 3)
    out.push({
      title: "Add missing role keywords",
      detail: `Target-role keywords missing from your resume: ${missing.slice(0, 8).join(", ")}.`,
      priority: "high",
    })
  if (h.sectionCompleteness < 80)
    out.push({
      title: "Complete all standard sections",
      detail:
        "Ensure Education, Experience, Projects and Skills sections are present.",
      priority: "medium",
    })
  if (out.length === 0)
    out.push({
      title: "Solid foundation",
      detail:
        "Keep your resume updated as you complete projects and gain experience.",
      priority: "low",
    })
  return out
}

// ---------- Resume improvement ----------

export async function improveResume(input: {
  text: string
  structured: unknown
  targetRole?: string | null
  jdText?: string | null
  weaknesses?: string[]
}): Promise<ImprovementSet> {
  if (!isAIEnabled()) {
    throw new Error("AI provider not configured")
  }
  return chatJSON({
    system: RESUME_IMPROVE_SYSTEM,
    user: `Target role: ${input.targetRole || "Software Engineering Intern"}
Known weaknesses: ${(input.weaknesses ?? []).join("; ") || "none identified"}
${input.jdText ? guardUntrusted("job_description", input.jdText) : ""}
${guardUntrusted("resume_text", input.text)}`,
    schema: ImprovementSetSchema,
    maxTokens: 3000,
  })
}

// ---------- Roadmap generation ----------

export async function generateRoadmapPlan(input: {
  targetRole: string
  gaps: {
    skill: string
    currentLevel: string | null
    weight: number
    reason: string
  }[]
  knownSkills: string[]
}): Promise<RoadmapPlan | null> {
  if (!isAIEnabled()) return null
  try {
    return await chatJSON({
      system: ROADMAP_SYSTEM,
      user: `Target role: ${input.targetRole}
Skills already owned: ${input.knownSkills.slice(0, 30).join(", ") || "none yet"}
Skill gaps (most urgent first): ${input.gaps
        .slice(0, 12)
        .map(
          (g) =>
            `${g.skill}${
              g.currentLevel ? ` (currently ${g.currentLevel})` : " (missing)"
            }`,
        )
        .join("; ")}
Create an 4-week roadmap closing these gaps.`,
      schema: RoadmapPlanSchema,
      maxTokens: 3000,
    })
  } catch (err) {
    console.error("[ai] roadmap generation failed:", err)
    return null
  }
}

// ---------- Interviews ----------

const FALLBACK_QUESTIONS: Record<string, {
  text: string
  rubricKeywords: string[]
}[]> = {
  technical: [
    {
      text: "Explain the difference between processes and threads, and when you would choose multi-threading over multi-processing.",
      rubricKeywords: [
        "process",
        "thread",
        "memory",
        "context switch",
        "concurrency",
      ],
    },
    {
      text: "Walk me through how a REST API request travels from the browser to a database and back. Where can latency creep in?",
      rubricKeywords: [
        "http",
        "dns",
        "server",
        "query",
        "latency",
        "serialization",
      ],
    },
    {
      text: "What is a database index, and what trade-offs do indexes introduce?",
      rubricKeywords: ["index", "b-tree", "write", "lookup", "storage"],
    },
    {
      text: "Describe how you would debug a page that loads slowly in production.",
      rubricKeywords: [
        "profile",
        "network",
        "cache",
        "measure",
        "database",
        "monitoring",
      ],
    },
    {
      text: "Explain Big-O notation and give an example where an O(n²) solution could be acceptable.",
      rubricKeywords: [
        "time complexity",
        "space complexity",
        "trade-off",
        "input size",
      ],
    },
  ],
  coding: [
    {
      text: "Describe your approach to finding two numbers in an array that sum to a target. Compare brute force vs an optimal solution.",
      rubricKeywords: ["hash map", "o(n)", "two pointer", "brute force"],
    },
    {
      text: "How would you detect a cycle in a linked list? Explain at least one approach in detail.",
      rubricKeywords: ["fast slow", "floyd", "pointer", "set", "cycle"],
    },
    {
      text: "Explain how you would reverse a string without built-in functions, and discuss time and space complexity.",
      rubricKeywords: ["swap", "two pointer", "o(n)", "in place"],
    },
    {
      text: "Given a binary tree, how would you traverse it level by level? What data structure do you use and why?",
      rubricKeywords: ["bfs", "queue", "level order", "tree"],
    },
  ],
  behavioral: [
    {
      text: "Tell me about a challenging technical project. What was your specific contribution and the outcome?",
      rubricKeywords: ["situation", "task", "action", "result", "impact"],
    },
    {
      text: "Describe a time you disagreed with a teammate. How did you resolve it?",
      rubricKeywords: ["conflict", "communication", "resolution", "compromise"],
    },
    {
      text: "Tell me about a failure or mistake and what you learned from it.",
      rubricKeywords: ["ownership", "learning", "reflection", "growth"],
    },
    {
      text: "How do you prioritize when you have multiple deadlines competing?",
      rubricKeywords: ["prioritize", "communicate", "triage", "deadline"],
    },
  ],
  hr: [
    {
      text: "Why are you interested in an internship at our company specifically?",
      rubricKeywords: [
        "research",
        "company",
        "mission",
        "product",
        "alignment",
      ],
    },
    {
      text: "What are your career goals for the next 2-3 years?",
      rubricKeywords: ["goal", "growth", "learning", "direction"],
    },
    {
      text: "What kind of team environment helps you do your best work?",
      rubricKeywords: ["collaboration", "feedback", "team", "culture"],
    },
    {
      text: "How do you handle receiving critical feedback on your work?",
      rubricKeywords: ["feedback", "openness", "improve", "example"],
    },
  ],
}

export async function generateInterviewQuestions(input: {
  track: string
  difficulty: string
  roleContext?: string | null
}): Promise<InterviewQuestions> {
  const fallback = () => ({
    questions: FALLBACK_QUESTIONS[input.track] ?? FALLBACK_QUESTIONS.technical,
  })

  if (!isAIEnabled()) return fallback()
  try {
    const result = await chatJSON({
      system: INTERVIEW_QUESTIONS_SYSTEM,
      user: `Track: ${input.track}
Difficulty: ${input.difficulty}
Candidate context: ${input.roleContext || "early-career CS student seeking a software internship"}`,
      schema: InterviewQuestionsSchema,
      maxTokens: 1500,
    })
    return result.questions.length >= 3 ? result : fallback()
  } catch (err) {
    console.error("[ai] question generation failed:", err)
    return fallback()
  }
}

export async function evaluateAnswer(input: {
  question: string
  rubricKeywords: string[]
  answer: string
}): Promise<AnswerEvaluation> {
  const lower = input.answer.toLowerCase().trim()

  // Guard against empty/near-empty answers before spending tokens.
  if (lower.length < 12) {
    return {
      score: Math.max(5, Math.floor(lower.length)),
      strengths: [],
      improvements: [
        "Your answer was too short — explain your reasoning with specifics.",
      ],
      followUpQuestion: null,
      keywordCoverage: [],
    }
  }

  const heuristicCoverage = input.rubricKeywords.filter((k) =>
    lower.includes(k.toLowerCase()),
  )

  if (!isAIEnabled()) {
    // Heuristic mode: rubric-keyword ratio + length signal.
    const coverageRatio =
      input.rubricKeywords.length === 0
        ? 0.5
        : heuristicCoverage.length / input.rubricKeywords.length
    const lengthSignal = Math.min(lower.length / 600, 1)
    const score = Math.round(
      Math.min(coverageRatio * 70 + lengthSignal * 30, 95),
    )
    return {
      score: Math.max(score, 20),
      strengths:
        heuristicCoverage.length > 0
          ? [
              `Mentioned key concepts: ${heuristicCoverage.slice(0, 4).join(", ")}`,
            ]
          : [],
      improvements: [
        ...(heuristicCoverage.length < input.rubricKeywords.length
          ? [
              `Consider addressing: ${input.rubricKeywords
                .filter((k) => !lower.includes(k.toLowerCase()))
                .slice(0, 3)
                .join(", ")}`,
            ]
          : []),
        "Heuristic evaluation mode (AI provider not configured) — scores approximate.",
      ],
      followUpQuestion: null,
      keywordCoverage: heuristicCoverage,
    }
  }

  try {
    return await chatJSON({
      system: ANSWER_EVALUATION_SYSTEM,
      user: `Question: ${input.question}
Rubric keywords: ${input.rubricKeywords.join(", ") || "(open-ended)"}
${guardUntrusted("candidate_answer", input.answer)}`,
      schema: AnswerEvaluationSchema,
      maxTokens: 1200,
    })
  } catch (err) {
    console.error("[ai] answer evaluation failed:", err)
    const coverageRatio =
      input.rubricKeywords.length === 0
        ? 0.5
        : heuristicCoverage.length / input.rubricKeywords.length
    return {
      score: Math.round(Math.min(Math.max(coverageRatio * 80 + 10, 20), 90)),
      strengths: [
        `Referenced ${heuristicCoverage.length}/${input.rubricKeywords.length} key concepts`,
      ],
      improvements: [
        "Evaluated with fallback heuristics due to AI unavailability.",
      ],
      followUpQuestion: null,
      keywordCoverage: heuristicCoverage,
    }
  }
}

// ---------- Career assistant ----------

export async function assistantReply(input: {
  history: { role: "user" | "assistant" content: string }[]
  contextDigest: string
  message: string
}) {
  return chatJSON({
    system: `${ASSISTANT_SYSTEM}\n\nPrivate student context digest (server-verified):\n${input.contextDigest.slice(0, CONTEXT_DIGEST_MAX_CHARS)}`,
    user: [
      ...input.history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: input.message },
    ]
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n")
      .slice(-6000),
    schema: AssistantReplySchema,
    maxTokens: 1200,
  })
}

// Re-export for server-side use
export { isAIEnabled }
