import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Roadmaps Table Schema
 * Personalized learning roadmaps generated per user target role.
 */
export const roadmapsTable = defineTable({
  userId: v.id("users"),
  targetRole: v.string(),
  overallProgress: v.number(),
}).index("by_user", ["userId"]);
