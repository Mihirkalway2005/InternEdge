import { defineTable } from "convex/server"
import { v } from "convex/values"

/**
 * Activity Logs Table Schema
 * Audit and activity history log of student actions across the platform.
 */
export const activityLogsTable = defineTable({
  userId: v.id("users"),
  action: v.string(),
  entityType: v.optional(v.string()),
  entityId: v.optional(v.string()),
  details: v.optional(v.string()),
  timestamp: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_timestamp", ["timestamp"])
