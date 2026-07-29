import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Experiences Table Schema
 * Past internships, jobs, and leadership experiences.
 */
export const experiencesTable = defineTable({
  userId: v.id("users"),
  company: v.string(),
  role: v.string(),
  description: v.string(),
  startDate: v.string(),
  endDate: v.optional(v.string()),
}).index("by_user", ["userId"]);
