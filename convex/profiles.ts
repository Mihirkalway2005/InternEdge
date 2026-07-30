import { defineTable } from "convex/server"
import { v } from "convex/values"

/**
 * Profiles Table Schema
 * Extended academic, professional, and career details linked to a user.
 */
export const profilesTable = defineTable({
  userId: v.id("users"),
  headline: v.optional(v.string()),
  university: v.optional(v.string()),
  education: v.optional(v.string()),
  degree: v.optional(v.string()),
  branch: v.optional(v.string()),
  graduationYear: v.optional(v.number()),
  bio: v.optional(v.string()),
  github: v.optional(v.string()),
  linkedin: v.optional(v.string()),
  portfolio: v.optional(v.string()),
  careerGoal: v.optional(v.string()),
}).index("by_user", ["userId"])
