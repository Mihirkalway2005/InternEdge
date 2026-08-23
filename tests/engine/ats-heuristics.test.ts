import { describe, it, expect } from "vitest"
import {
  computeATSHeuristics,
  computeKeywordCoverage,
} from "@/lib/engine/ats-heuristics"

const structured = {
  email: "dev@example.com",
  experience: [
    { company: "A", role: "Intern", duration: null, bullets: ["Built REST APIs serving 10k requests per day"] },
    { company: "B", role: "Intern", duration: null, bullets: ["Optimized database queries reducing latency by 40%"] },
    { company: "C", role: "Freelance", duration: null, bullets: ["Did some stuff for a client project"] },
  ],
  projects: [],
}

describe("computeATSHeuristics", () => {
  it("scores quantified action-verb bullets above vague ones", () => {
    const strong = computeATSHeuristics(
      "education experience skills\nBuilt APIs. Optimized queries. Automated deploys.",
      { ...structured, experience: [{ company: "", role: "", duration: null, bullets: ["Built APIs", "Optimized queries", "Automated deploys"] }] },
    )
    const weak = computeATSHeuristics(
      "education experience skills",
      { ...structured, experience: [{ company: "", role: "", duration: null, bullets: ["Was responsible for things", "Helped with tasks"] }] },
    )
    expect(strong.impactVerbs).toBeGreaterThan(weak.impactVerbs)
  })

  it("detects quantification (numbers/percentages)", () => {
    const quantified = computeATSHeuristics("text", structured)
    expect(quantified.quantification).toBeGreaterThan(30)
  })

  it("penalizes missing standard sections", () => {
    const complete = computeATSHeuristics("education experience projects skills @email.com", structured)
    const incomplete = computeATSHeuristics("hello world", { ...structured, email: undefined })
    expect(complete.sectionCompleteness).toBeGreaterThan(incomplete.sectionCompleteness)
  })

  it("is deterministic and bounded", () => {
    const a = computeATSHeuristics("some resume text with education and skills", structured)
    const b = computeATSHeuristics("some resume text with education and skills", structured)
    expect(a).toEqual(b)
    for (const v of Object.values(a)) {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(10000) // wordCount can exceed 100
    }
  })

  it("handles empty input without crashing", () => {
    const result = computeATSHeuristics("", null)
    expect(result.sectionCompleteness).toBeGreaterThanOrEqual(0)
  })
})

describe("computeKeywordCoverage", () => {
  it("matches normalized keywords against resume text", () => {
    const { matched, missing } = computeKeywordCoverage(
      "Experienced with React, TypeScript and Postgres databases",
      ["react", "typescript", "postgresql", "kubernetes"],
    )
    expect(matched).toContain("react")
    expect(matched).toContain("typescript")
    expect(matched).toContain("postgresql") // alias normalization
    expect(missing).toContain("kubernetes")
  })

  it("computes coverage percentage correctly", () => {
    const { coveragePct } = computeKeywordCoverage("I know react and css", [
      "react",
      "css",
      "docker",
      "aws",
    ])
    expect(coveragePct).toBe(50)
  })

  it("returns zero coverage for empty text", () => {
    const { coveragePct } = computeKeywordCoverage("", ["react"])
    expect(coveragePct).toBe(0)
  })
})
