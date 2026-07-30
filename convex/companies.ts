import { defineTable } from "convex/server"
import { v } from "convex/values"

/**
 * Companies Table Schema
 * Normalized corporate entity registry offering internships.
 */
export const companiesTable = defineTable({
  name: v.string(),
  logo: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
  website: v.optional(v.string()),
  industry: v.string(),
  size: v.optional(v.string()),
  description: v.string(),
}).index("by_name", ["name"])
