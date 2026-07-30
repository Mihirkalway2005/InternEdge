import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

/**
 * Roadmaps Operations (CRUD)
 */

export const getRoadmapByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const roadmap = await ctx.db
      .query("roadmaps")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()
    if (!roadmap) return null

    const tasks = await ctx.db
      .query("roadmapTasks")
      .withIndex("by_roadmap", (q) => q.eq("roadmapId", roadmap._id))
      .collect()

    return { ...roadmap, tasks }
  },
})

export const createRoadmap = mutation({
  args: {
    userId: v.id("users"),
    title: v.optional(v.string()),
    targetRole: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("roadmaps", {
      userId: args.userId,
      title: args.title,
      targetRole: args.targetRole,
      overallProgress: 0,
      createdAt: Date.now(),
    })
  },
})

export const createRoadmapTask = mutation({
  args: {
    roadmapId: v.id("roadmaps"),
    title: v.string(),
    description: v.optional(v.string()),
    week: v.optional(v.number()),
    dueDate: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("roadmapTasks", {
      roadmapId: args.roadmapId,
      title: args.title,
      description: args.description,
      week: args.week,
      dueDate: args.dueDate,
      category: args.category,
      completed: false,
      isCompleted: false,
    })
  },
})

export const toggleTaskCompleted = mutation({
  args: { taskId: v.id("roadmapTasks"), completed: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      completed: args.completed,
      isCompleted: args.completed,
    })
  },
})

export const deleteRoadmapTask = mutation({
  args: { taskId: v.id("roadmapTasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId)
    return true
  },
})

export const deleteRoadmap = mutation({
  args: { roadmapId: v.id("roadmaps") },
  handler: async (ctx, args) => {
    // Delete associated tasks first
    const tasks = await ctx.db
      .query("roadmapTasks")
      .withIndex("by_roadmap", (q) => q.eq("roadmapId", args.roadmapId))
      .collect()
    for (const task of tasks) {
      await ctx.db.delete(task._id)
    }
    await ctx.db.delete(args.roadmapId)
    return true
  },
})
