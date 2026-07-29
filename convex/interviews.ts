import { defineTable } from "convex/server";
import { v } from "convex/values";
import { interviewTrackValidator, interviewQuestionValidator } from "./lib/validators";

/**
 * Interviews Table Schema
 * AI mock interview practice sessions and evaluation scorecards.
 */
export const interviewsTable = defineTable({
  userId: v.id("users"),
  track: interviewTrackValidator,
  score: v.number(),
  feedback: v.string(),
  questions: v.array(interviewQuestionValidator),
}).index("by_user", ["userId"]);
