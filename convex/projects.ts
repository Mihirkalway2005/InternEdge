import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Projects Table Schema
 * Portfolio projects built by students.
 */
export const projectsTable = defineTable({
  userId: v.id("users"),
  title: v.string(),
  description: v.string(),
  techStack: v.array(v.string()),
  github: v.optional(v.string()),
  liveDemo: v.optional(v.string()),
  startDate: v.string(),
  endDate: v.optional(v.string()),
}).index("by_user", ["userId"]);
