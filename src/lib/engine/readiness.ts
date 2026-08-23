/**
 * AI Readiness Score — deterministic composite over real user signals.
 *
 * Components & weights:
 *   resumeQuality      .30  latest analyzed resume ATS score (0-100)
 *   skillCoverage      .20  taxonomy coverage vs primary target role
 *   projectSignal      .15  count, descriptions, links
 *   experienceSignal   .10  prior internships/jobs
 *   interviewAvg       .15  mean completed interview score
 *   roadmapProgress    .05  active roadmap completion
 *   applicationActivity.05  applications moved beyond "saved"
 */

export type ReadinessInput = {
  latestAtsScore: number | null
  skillCoverage: number // 0..1
  projects: {
    title: string
    description: string
    github?: string | null
    liveDemo?: string | null
  }[]
  experiences: { role: string company: string }[]
  interviewScores: number[]
  roadmapProgress: number // 0..100
  activeApplicationCount: number // status beyond saved
}

export type ReadinessResult = {
  score: number // 0..100
  components: Record<string, { value: number weight: number }>
}

export function computeReadiness(input: ReadinessInput): ReadinessResult {
  const resumeQuality =
    input.latestAtsScore != null
      ? Math.max(0, Math.min(input.latestAtsScore, 100)) / 100
      : 0

  const skillCoverage = Math.max(0, Math.min(input.skillCoverage, 1))

  let projectSignal = 0
  if (input.projects.length > 0) {
    const withLinks = input.projects.filter(
      (p) => p.github || p.liveDemo,
    ).length
    const withDescriptions = input.projects.filter(
      (p) => p.description.length > 40,
    ).length
    projectSignal = Math.min(
      (input.projects.length / 3) * 0.5 +
        (withLinks / input.projects.length) * 0.25 +
        (withDescriptions / input.projects.length) * 0.25,
      1,
    )
  }

  const experienceSignal = Math.min(input.experiences.length / 2, 1)

  const interviewAvg =
    input.interviewScores.length === 0
      ? 0
      : input.interviewScores.reduce((a, b) => a + b, 0) /
        input.interviewScores.length /
        100

  const roadmapProgress =
    Math.max(0, Math.min(input.roadmapProgress, 100)) / 100

  const applicationActivity = Math.min(input.activeApplicationCount / 5, 1)

  const components = {
    resumeQuality: { value: resumeQuality, weight: 0.3 },
    skillCoverage: { value: skillCoverage, weight: 0.2 },
    projectSignal: { value: projectSignal, weight: 0.15 },
    experienceSignal: { value: experienceSignal, weight: 0.1 },
    interviewAvg: { value: interviewAvg, weight: 0.15 },
    roadmapProgress: { value: roadmapProgress, weight: 0.05 },
    applicationActivity: { value: applicationActivity, weight: 0.05 },
  }

  const raw = Object.values(components).reduce(
    (sum, c) => sum + c.value * c.weight,
    0,
  )
  return { score: Math.round(raw * 100), components }
}
