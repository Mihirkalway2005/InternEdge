import { defineTable } from "convex/server";
import { v } from "convex/values";
import { workTypeValidator } from "./lib/validators";

/**
 * Internships Table Schema
 * Internship postings linked to normalized company entities.
 */
export const internshipsTable = defineTable({
  companyId: v.id("companies"),
  title: v.string(),
  description: v.string(),
  location: v.string(),
  workType: workTypeValidator,
  salary: v.optional(v.string()),
  deadline: v.number(),
  requiredSkills: v.array(v.string()),
  applicationUrl: v.optional(v.string()),
})
  .index("by_company", ["companyId"])
  .index("by_location", ["location"])
  .index("by_deadline", ["deadline"]);
