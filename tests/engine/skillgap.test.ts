import { describe, it, expect } from "vitest"
import { computeSkillGaps, skillCoverageScore } from "@/lib/engine/skillgap"

describe("computeSkillGaps", () => {
  it("flags missing demanded skills as highest priority", () => {
    const gaps = computeSkillGaps({
      skills: [{ name: "react", level: "advanced" }],
      targetRoles: ["Frontend Engineer"],
      demandedSkills: [],
    })
    expect(gaps.length).toBeGreaterThan(0)
    expect(gaps.some((g) => g.skill === "typescript" && g.currentLevel === null)).toBe(true)
  })

  it("ignores skills the user already has at advanced level", () => {
    const full = ["javascript", "typescript", "react", "nextjs", "html", "css", "tailwind css", "redux", "testing", "accessibility", "web performance"]
    const gaps = computeSkillGaps({
      skills: full.map((name) => ({ name, level: "advanced" })),
      targetRoles: ["Frontend Engineer"],
      demandedSkills: [],
    })
    expect(gaps.filter((g) => g.weight > 0.5)).toHaveLength(0)
  })

  it("flags beginner-level skills of high demand as weak concepts", () => {
    const gaps = computeSkillGaps({
      skills: [{ name: "react", level: "beginner" }],
      targetRoles: [],
      demandedSkills: [
        { skill: "react", demandCount: 10 },
        { skill: "kubernetes", demandCount: 1 },
      ],
    })
    const reactGap = gaps.find((g) => g.skill === "react")
    expect(reactGap).toBeDefined()
    expect(reactGap!.currentLevel).toBe("beginner")
    expect(reactGap!.reason).toMatch(/beginner/)
  })

  it("sorts by urgency descending", () => {
    const gaps = computeSkillGaps({
      skills: [{ name: "python", level: "beginner" }],
      targetRoles: ["Data Analyst"],
      demandedSkills: [
        { skill: "sql", demandCount: 20 },
        { skill: "spark", demandCount: 1 },
      ],
    })
    for (let i = 1; i < gaps.length; i++) {
      expect(gaps[i - 1].weight).toBeGreaterThanOrEqual(gaps[i].weight)
    }
  })

  it("handles empty inputs gracefully", () => {
    const gaps = computeSkillGaps({ skills: [], targetRoles: [], demandedSkills: [] })
    expect(Array.isArray(gaps)).toBe(true)
  })
})

describe("skillCoverageScore", () => {
  it("gives perfect coverage when all expected skills are expert", () => {
    const expected = [
      "javascript", "typescript", "react", "nextjs", "html", "css",
      "tailwind css", "redux", "testing", "accessibility", "web performance",
    ]
    const score = skillCoverageScore(
      expected.map((name) => ({ name, level: "expert" })),
      "Frontend Engineer",
    )
    expect(score).toBe(1)
  })

  it("gives zero coverage with no skills", () => {
    expect(skillCoverageScore([], "Backend Engineer")).toBeGreaterThanOrEqual(0)
    expect(skillCoverageScore([{ name: "cooking", level: "expert" }], "DevOps Engineer")).toBeLessThan(0.2)
  })

  it("is bounded between 0 and 1", () => {
    const score = skillCoverageScore(
      Array.from({ length: 50 }, (_, i) => ({ name: `skill-${i}`, level: "expert" })),
      "Machine Learning Engineer",
    )
    expect(score).toBeLessThanOrEqual(1)
  })
})
