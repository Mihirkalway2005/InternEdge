import { defineTable } from "convex/server"
import { v } from "convex/values"
import { skillCategoryValidator, skillLevelValidator } from "./lib/validators"

/**
 * Skills Table Schema
 * Technical and soft skills associated with a user profile.
 */
export const skillsTable = defineTable({
  userId: v.id("users"),
  name: v.string(),
  category: skillCategoryValidator,
  level: skillLevelValidator,
  verified: v.boolean(),
}).index("by_user", ["userId"])
