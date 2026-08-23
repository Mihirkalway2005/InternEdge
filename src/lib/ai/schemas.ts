import { z } from "zod"

export const StructuredResumeSchema = z.object({
  name: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  location: z.string().nullish(),
  links: z.array(z.string()).default([]),
  summary: z.string().nullish(),
  education: z
    .array(
      z.object({
        institution: z.string(),
        degree: z.string().nullish(),
        field: z.string().nullish(),
        graduationYear: z.number().int().min(1980).max(2100).nullish(),
      }),
    )
    .default([]),
  experience: z
    .array(
      z.object({
        company: z.string(),
        role: z.string().nullish(),
        duration: z.string().nullish(),
        bullets: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().nullish(),
        techStack: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
})
export type StructuredResume = z.infer<typeof StructuredResumeSchema>

export const ATSAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  dimensions: z.object({
    keywordCoverage: z.number().min(0).max(100),
    formatting: z.number().min(0).max(100),
    impactVerbs: z.number().min(0).max(100),
    quantification: z.number().min(0).max(100),
    sectionCompleteness: z.number().min(0).max(100),
    relevanceToRole: z.number().min(0).max(100),
  }),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  suggestions: z
    .array(
      z.object({
        title: z.string(),
        detail: z.string(),
        priority: z.enum(["high", "medium", "low"]),
      }),
    )
    .max(8)
    .default([]),
  summary: z.string(),
})
export type ATSAnalysis = z.infer<typeof ATSAnalysisSchema>

export const ImprovementSuggestionSchema = z.object({
  section: z.string(),
  originalText: z.string().nullish(),
  suggestedRewrite: z.string(),
  rationale: z.string(),
  isAddition: z.boolean(),
  confidence: z.number().min(0).max(1),
})
export type ImprovementSuggestion = z.infer<typeof ImprovementSuggestionSchema>

export const ImprovementSetSchema = z.object({
  suggestions: z.array(ImprovementSuggestionSchema).max(10),
  generalNotes: z.array(z.string()).default([]),
})
export type ImprovementSet = z.infer<typeof ImprovementSetSchema>

export const RoadmapPlanSchema = z.object({
  title: z.string(),
  weeks: z
    .array(
      z.object({
        week: z.number().int().min(1).max(52),
        focus: z.string(),
        tasks: z
          .array(
            z.object({
              title: z.string(),
              detail: z.string().nullish(),
              category: z.string().nullish(),
              skillName: z.string().nullish(),
              resourceUrl: z.string().url().nullish(),
              priority: z.number().int().min(1).max(3).default(2),
            }),
          )
          .max(7)
          .default([]),
      }),
    )
    .max(12)
    .default([]),
})
export type RoadmapPlan = z.infer<typeof RoadmapPlanSchema>

export const InterviewQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        text: z.string(),
        rubricKeywords: z.array(z.string()).max(10).default([]),
      }),
    )
    .min(3)
    .max(6),
})
export type InterviewQuestions = z.infer<typeof InterviewQuestionsSchema>

export const AnswerEvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()).max(5).default([]),
  improvements: z.array(z.string()).max(5).default([]),
  followUpQuestion: z.string().nullish(),
  keywordCoverage: z.array(z.string()).default([]),
})
export type AnswerEvaluation = z.infer<typeof AnswerEvaluationSchema>

export const AssistantReplySchema = z.object({
  answer: z.string(),
  suggestedActions: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
      }),
    )
    .max(4)
    .default([]),
})
export type AssistantReply = z.infer<typeof AssistantReplySchema>
