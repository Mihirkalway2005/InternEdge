import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { applicationStatusValidator } from "./lib/validators"

/**
 * Applications Operations (CRUD)
 */

export const listApplicationsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
  },
})

export const getApplicationById = query({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createApplication = mutation({
  args: {
    userId: v.id("users"),
    internshipId: v.id("internships"),
    status: applicationStatusValidator,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    return await ctx.db.insert("applications", {
      userId: args.userId,
      internshipId: args.internshipId,
      status: args.status,
      notes: args.notes,
      appliedAt: now,
      updatedAt: now,
    })
  },
})

export const updateApplicationStatus = mutation({
  args: {
    id: v.id("applications"),
    status: applicationStatusValidator,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, status, notes } = args
    const patchData: {
      status: typeof status
      updatedAt: number
      notes?: string
    } = {
      status,
      updatedAt: Date.now(),
    }
    if (notes !== undefined) {
      patchData.notes = notes
    }
    await ctx.db.patch(id, patchData)
  },
})

export const deleteApplication = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return true
  },
})
