import { defineTable } from "convex/server"
import { v } from "convex/values"
import { roleValidator } from "./lib/validators"

/**
 * Users Table Schema
 * Represents platform users (students, mentors, admins, placement cells).
 */
export const usersTable = defineTable({
  email: v.string(),
  name: v.string(),
  avatar: v.optional(v.string()),
  role: roleValidator,
  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_email", ["email"])
