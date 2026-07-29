import { defineTable } from "convex/server";
import { v } from "convex/values";
import { notificationTypeValidator } from "./lib/validators";

/**
 * Notifications Table Schema
 * System and event notifications sent to students.
 */
export const notificationsTable = defineTable({
  userId: v.id("users"),
  title: v.string(),
  message: v.string(),
  type: notificationTypeValidator,
  read: v.boolean(),
  createdAt: v.number(),
}).index("by_user", ["userId"]);
