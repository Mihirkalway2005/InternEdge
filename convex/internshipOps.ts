import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { workTypeValidator } from "./lib/validators"

/**
 * Internship Operations (CRUD)
 */

export const listInternships = query({
  args: {
    workType: v.optional(workTypeValidator),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let internships = await ctx.db.query("internships").collect()
    if (args.workType) {
      internships = internships.filter(
        (item) => item.workType === args.workType,
      )
    }
    if (args.search) {
      const q = args.search.toLowerCase()
      internships = internships.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.requiredSkills.some((s) => s.toLowerCase().includes(q)),
      )
    }
    return internships
  },
})

export const getInternshipById = query({
  args: { id: v.id("internships") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createInternship = mutation({
  args: {
    companyId: v.id("companies"),
    title: v.string(),
    description: v.string(),
    location: v.string(),
    workType: workTypeValidator,
    salary: v.optional(v.string()),
    deadline: v.number(),
    requiredSkills: v.array(v.string()),
    applicationUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("internships", args)
  },
})

export const updateInternship = mutation({
  args: {
    id: v.id("internships"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    location: v.optional(v.string()),
    workType: v.optional(workTypeValidator),
    salary: v.optional(v.string()),
    deadline: v.optional(v.number()),
    requiredSkills: v.optional(v.array(v.string())),
    applicationUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, data)
    return id
  },
})

export const deleteInternship = mutation({
  args: { id: v.id("internships") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return true
  },
})
