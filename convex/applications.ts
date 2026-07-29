import { defineTable } from "convex/server";
import { v } from "convex/values";
import { applicationStatusValidator } from "./lib/validators";

/**
 * Applications Table Schema
 * Student internship application pipeline tracker.
 */
export const applicationsTable = defineTable({
  userId: v.id("users"),
  internshipId: v.id("internships"),
  status: applicationStatusValidator,
  notes: v.optional(v.string()),
  appliedAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_status", ["status"])
  .index("by_internship", ["internshipId"]);
