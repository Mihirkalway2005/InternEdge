import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

/**
 * Activity History Operations (CRUD)
 */

export const listActivityByUser = query({
  args: { userId: v.id("users"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("activityLogs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect()

    if (args.limit) {
      return logs.slice(0, args.limit)
    }
    return logs
  },
})

export const logActivity = mutation({
  args: {
    userId: v.id("users"),
    action: v.string(),
    entityType: v.optional(v.string()),
    entityId: v.optional(v.string()),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activityLogs", {
      userId: args.userId,
      action: args.action,
      entityType: args.entityType,
      entityId: args.entityId,
      details: args.details,
      timestamp: Date.now(),
    })
  },
})
