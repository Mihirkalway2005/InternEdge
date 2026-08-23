import { describe, it, expect } from "vitest"
import { scoreInternship, type UserMatchContext } from "@/lib/engine/matching"
import { normalizeSkill, expectedSkillsForRole } from "@/lib/engine/taxonomy"

const baseUser: UserMatchContext = {
  skills: [
    { name: "React", level: "advanced" },
    { name: "TypeScript", level: "expert" },
    { name: "Next.js", level: "intermediate" },
  ],
  targetRoles: ["Frontend Engineer"],
  preferredLocations: ["Remote"],
  preferredWorkType: "remote",
  graduationYear: new Date().getFullYear() + 1,
  resumeKeywords: ["react", "typescript"],
}

const futureDeadline = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000)

const baseInternship = {
  title: "Frontend Engineering Intern",
  description: "Build React interfaces with TypeScript and modern tooling.",
  location: "Remote",
  workType: "remote",
  requiredSkills: ["react", "typescript", "nextjs"],
  deadline: futureDeadline(30),
}

describe("scoreInternship", () => {
  it("scores a perfectly matching internship high", () => {
    const result = scoreInternship(baseUser, baseInternship)
    expect(result.score).toBeGreaterThanOrEqual(70)
    expect(result.score).toBeLessThanOrEqual(100)
    expect(result.matchedSkills).toContain("react")
    expect(result.missingSkills).toHaveLength(0)
  })

  it("scores a completely unrelated internship low", () => {
    const result = scoreInternship(
      baseUser,
      {
        ...baseInternship,
        title: "Petroleum Engineering Intern",
        description: "Oil rig operations and drilling systems.",
        requiredSkills: ["drilling", "thermodynamics", "matlab"],
      },
    )
    expect(result.score).toBeLessThan(40)
    expect(result.missingSkills).toHaveLength(3)
  })

  it("is deterministic — same inputs produce identical output", () => {
    const a = scoreInternship(baseUser, baseInternship)
    const b = scoreInternship(baseUser, baseInternship)
    expect(a.score).toBe(b.score)
    expect(a.breakdown).toEqual(b.breakdown)
  })

  it("rewards higher proficiency levels", () => {
    const beginner = scoreInternship(
      { ...baseUser, skills: [{ name: "react", level: "beginner" }, { name: "typescript", level: "beginner" }, { name: "nextjs", level: "beginner" }] },
      baseInternship,
    )
    const expert = scoreInternship(
      { ...baseUser, skills: [{ name: "react", level: "expert" }, { name: "typescript", level: "expert" }, { name: "nextjs", level: "expert" }] },
      baseInternship,
    )
    expect(expert.score).toBeGreaterThan(beginner.score)
  })

  it("penalizes closed internships via freshness component", () => {
    const open = scoreInternship(baseUser, { ...baseInternship, deadline: futureDeadline(20) })
    const closed = scoreInternship(baseUser, { ...baseInternship, deadline: new Date(Date.now() - 1000) })
    expect(open.breakdown.freshness).toBeGreaterThan(closed.breakdown.freshness)
    expect(closed.breakdown.freshness).toBe(0)
  })

  it("matches remote preference for remote listings and penalizes mismatch", () => {
    const remote = scoreInternship(baseUser, baseInternship)
    const onsiteTokyo = scoreInternship(baseUser, {
      ...baseInternship,
      location: "Tokyo, Japan",
      workType: "onsite",
    })
    expect(remote.breakdown.preferenceFit).toBeGreaterThan(onsiteTokyo.breakdown.preferenceFit)
  })

  it("handles empty required skills without crashing", () => {
    const result = scoreInternship(baseUser, { ...baseInternship, requiredSkills: [] })
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.reasons.join(" ")).toMatch(/No explicit skill requirements/)
  })

  it("produces reasons that reference skill overlap", () => {
    const result = scoreInternship(baseUser, baseInternship)
    expect(result.reasons.some((r) => r.includes("required skills"))).toBe(true)
  })
})

describe("taxonomy normalization", () => {
  it("normalizes aliases and casing", () => {
    expect(normalizeSkill("Next.js")).toBe("nextjs")
    expect(normalizeSkill("Postgres")).toBe("postgresql")
    expect(normalizeSkill("JS")).toBe("javascript")
    expect(normalizeSkill("LLMs")).toBe("llm")
  })

  it("maps role titles to taxonomy skills", () => {
    const skills = expectedSkillsForRole("Senior Frontend Developer")
    expect(skills).toContain("react")
    expect(skills).toContain("typescript")
  })

  it("falls back to fullstack baseline for unknown roles", () => {
    const skills = expectedSkillsForRole("Underwater Basket Weaving Intern")
    expect(skills.length).toBeGreaterThan(0)
  })
})
