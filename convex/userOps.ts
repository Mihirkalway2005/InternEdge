import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { roleValidator } from "./lib/validators"

/**
 * User Operations (CRUD)
 */

export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()
  },
})

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    role: roleValidator,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()

    if (existing) {
      return existing._id
    }

    const now = Date.now()
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      avatar: args.avatar,
      role: args.role,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.optional(roleValidator),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    })
    return id
  },
})

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return true
  },
})
