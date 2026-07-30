import { defineTable } from "convex/server"
import { v } from "convex/values"

/**
 * Resumes Table Schema
 * Resume metadata, storage file IDs, and AI ATS analysis results.
 */
export const resumesTable = defineTable({
  userId: v.id("users"),
  fileId: v.optional(v.string()),
  parsedText: v.optional(v.string()),
  atsScore: v.optional(v.number()),
  keywords: v.array(v.string()),
  missingKeywords: v.array(v.string()),
  version: v.number(),
  isPrimary: v.boolean(),
}).index("by_user", ["userId"])
