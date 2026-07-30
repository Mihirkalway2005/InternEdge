import { defineTable } from "convex/server"
import { v } from "convex/values"
import {
  interviewTrackValidator,
  interviewQuestionValidator,
} from "./lib/validators"

/**
 * Interviews Table Schema
 * AI mock interview practice sessions and evaluation scorecards.
 */
export const interviewsTable = defineTable({
  userId: v.id("users"),
  track: interviewTrackValidator,
  title: v.optional(v.string()),
  score: v.number(),
  feedback: v.string(),
  questions: v.array(interviewQuestionValidator),
  createdAt: v.optional(v.number()),
}).index("by_user", ["userId"])
