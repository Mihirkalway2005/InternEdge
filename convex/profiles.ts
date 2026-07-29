import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Profiles Table Schema
 * Extended academic, professional, and career details linked to a user.
 */
export const profilesTable = defineTable({
  userId: v.id("users"),
  university: v.string(),
  degree: v.string(),
  branch: v.string(),
  graduationYear: v.number(),
  bio: v.optional(v.string()),
  github: v.optional(v.string()),
  linkedin: v.optional(v.string()),
  portfolio: v.optional(v.string()),
  careerGoal: v.optional(v.string()),
}).index("by_user", ["userId"]);
