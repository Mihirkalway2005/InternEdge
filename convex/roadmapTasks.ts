import { defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Roadmap Tasks Table Schema
 * Granular weekly/daily tasks linked to a learning roadmap.
 */
export const roadmapTasksTable = defineTable({
  roadmapId: v.id("roadmaps"),
  title: v.string(),
  week: v.number(),
  completed: v.boolean(),
}).index("by_roadmap", ["roadmapId"]);
