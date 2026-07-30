import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

/**
 * Profiles Operations (CRUD)
 */

export const getProfileByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()
  },
})

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    bio: v.optional(v.string()),
    headline: v.optional(v.string()),
    university: v.optional(v.string()),
    education: v.optional(v.string()),
    degree: v.optional(v.string()),
    branch: v.optional(v.string()),
    graduationYear: v.optional(v.number()),
    github: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    portfolio: v.optional(v.string()),
    portfolioUrl: v.optional(v.string()),
    careerGoal: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()

    const { userId, githubUrl, linkedinUrl, portfolioUrl, ...rest } = args

    const patchData: Record<string, any> = { ...rest }
    if (githubUrl !== undefined && patchData.github === undefined)
      patchData.github = githubUrl
    if (linkedinUrl !== undefined && patchData.linkedin === undefined)
      patchData.linkedin = linkedinUrl
    if (portfolioUrl !== undefined && patchData.portfolio === undefined)
      patchData.portfolio = portfolioUrl

    if (existing) {
      await ctx.db.patch(existing._id, patchData)
      return existing._id
    } else {
      return await ctx.db.insert("profiles", { userId, ...patchData })
    }
  },
})

export const deleteProfile = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first()
    if (existing) {
      await ctx.db.delete(existing._id)
      return true
    }
    return false
  },
})
