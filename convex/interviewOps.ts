import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import {
  interviewTrackValidator,
  interviewQuestionValidator,
} from "./lib/validators"

/**
 * Mock Interview Logs Operations (CRUD)
 */

export const listInterviewsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect()
  },
})

export const getInterviewById = query({
  args: { id: v.id("interviews") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const createInterviewLog = mutation({
  args: {
    userId: v.id("users"),
    track: interviewTrackValidator,
    title: v.optional(v.string()),
    score: v.number(),
    feedback: v.string(),
    questions: v.array(interviewQuestionValidator),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("interviews", {
      userId: args.userId,
      track: args.track,
      title: args.title,
      score: args.score,
      feedback: args.feedback,
      questions: args.questions,
      createdAt: Date.now(),
    })
  },
})

export const updateInterviewLog = mutation({
  args: {
    id: v.id("interviews"),
    score: v.optional(v.number()),
    feedback: v.optional(v.string()),
    questions: v.optional(v.array(interviewQuestionValidator)),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args
    await ctx.db.patch(id, data)
    return id
  },
})

export const deleteInterviewLog = mutation({
  args: { id: v.id("interviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return true
  },
})
