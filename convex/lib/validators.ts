import { v } from "convex/values"

/**
 * Reusable Convex Validators for InternEdge Schema.
 * Ensures consistent types across all tables and functions.
 */

export const roleValidator = v.union(
  v.literal("student"),
  v.literal("admin"),
  v.literal("mentor"),
  v.literal("placement_cell"),
)

export const workTypeValidator = v.union(
  v.literal("remote"),
  v.literal("hybrid"),
  v.literal("onsite"),
)

export const applicationStatusValidator = v.union(
  v.literal("saved"),
  v.literal("applied"),
  v.literal("assessment"),
  v.literal("interview"),
  v.literal("hr"),
  v.literal("offer"),
  v.literal("rejected"),
)

export const skillCategoryValidator = v.union(
  v.literal("frontend"),
  v.literal("backend"),
  v.literal("database"),
  v.literal("devops"),
  v.literal("ai_ml"),
  v.literal("soft_skill"),
  v.literal("other"),
)

export const skillLevelValidator = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
  v.literal("expert"),
)

export const interviewTrackValidator = v.union(
  v.literal("technical"),
  v.literal("hr"),
  v.literal("behavioral"),
  v.literal("coding"),
)

export const notificationTypeValidator = v.union(
  v.literal("deadline"),
  v.literal("roadmap"),
  v.literal("interview"),
  v.literal("resume"),
  v.literal("system"),
)

export const interviewQuestionValidator = v.object({
  question: v.string(),
  userAnswer: v.optional(v.string()),
  score: v.optional(v.number()),
  feedback: v.optional(v.string()),
  modelAnswer: v.optional(v.string()),
})
