import { defineTable } from "convex/server"
import { v } from "convex/values"

/**
 * Roadmap Tasks Table Schema
 * Granular weekly/daily tasks linked to a learning roadmap.
 */
export const roadmapTasksTable = defineTable({
  roadmapId: v.id("roadmaps"),
  title: v.string(),
  description: v.optional(v.string()),
  week: v.optional(v.number()),
  dueDate: v.optional(v.number()),
  category: v.optional(v.string()),
  completed: v.boolean(),
  isCompleted: v.optional(v.boolean()),
}).index("by_roadmap", ["roadmapId"])
