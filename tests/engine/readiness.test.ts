import { describe, it, expect } from "vitest"
import { computeReadiness, type ReadinessInput } from "@/lib/engine/readiness"

const emptyInput: ReadinessInput = {
  latestAtsScore: null,
  skillCoverage: 0,
  projects: [],
  experiences: [],
  interviewScores: [],
  roadmapProgress: 0,
  activeApplicationCount: 0,
}

describe("computeReadiness", () => {
  it("scores a brand-new user low but not zero-zero", () => {
    const result = computeReadiness(emptyInput)
    expect(result.score).toBe(0)
    expect(result.components.resumeQuality.value).toBe(0)
  })

  it("is deterministic", () => {
    const input = { ...emptyInput, latestAtsScore: 80 }
    expect(computeReadiness(input).score).toBe(computeReadiness(input).score)
  })

  it("weights resume quality as the largest single factor", () => {
    const withResumeOnly = computeReadiness({ ...emptyInput, latestAtsScore: 100 })
    const withInterviewsOnly = computeReadiness({ ...emptyInput, interviewScores: [100, 100] })
    // Resume weight .30 vs interviews weight .15
    expect(withResumeOnly.score).toBe(30)
    expect(withInterviewsOnly.score).toBe(15)
  })

  it("caps scores at 100 for a maximally strong profile", () => {
    const result = computeReadiness({
      latestAtsScore: 100,
      skillCoverage: 1,
      projects: [
        { title: "a", description: "long enough description here for sure", github: "https://github.com/x/y" },
        { title: "b", description: "another long description exceeding forty characters easily", liveDemo: "https://x.dev" },
        { title: "c", description: "third project with plenty of detail included", github: "https://github.com/x/z" },
      ],
      experiences: [{ role: "Intern", company: "A" }, { role: "Intern", company: "B" }],
      interviewScores: [90, 95],
      roadmapProgress: 100,
      activeApplicationCount: 9,
    })
    expect(result.score).toBeLessThanOrEqual(100)
    expect(result.score).toBeGreaterThan(85)
  })

  it("clamps out-of-range inputs", () => {
    const result = computeReadiness({
      ...emptyInput,
      latestAtsScore: 500, // invalid — clamped to 100
      skillCoverage: 5, // invalid — clamped to 1
      roadmapProgress: -20, // invalid — clamped to 0
    })
    expect(result.components.resumeQuality.value).toBe(1)
    expect(result.components.skillCoverage.value).toBe(1)
    expect(result.components.roadmapProgress.value).toBe(0)
    expect(result.score).toBeLessThanOrEqual(100)
  })

  it("project signal requires links and descriptions for full marks", () => {
    const bare = computeReadiness({
      ...emptyInput,
      projects: [{ title: "a", description: "" }, { title: "b", description: "" }, { title: "c", description: "" }],
    })
    const rich = computeReadiness({
      ...emptyInput,
      projects: [
        { title: "a", description: "a detailed description that is definitely long enough", github: "https://github.com/a" },
        { title: "b", description: "another detailed description over the threshold!!", liveDemo: "https://b.dev" },
        { title: "c", description: "third one also has a nice long description here", github: "https://github.com/c" },
      ],
    })
    expect(rich.components.projectSignal.value).toBeGreaterThan(bare.components.projectSignal.value)
  })
})
