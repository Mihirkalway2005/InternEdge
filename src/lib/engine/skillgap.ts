import {
  expectedSkillsForRole,
  normalizeSkill,
  normalizeSkillList,
  SKILL_LEVEL_WEIGHT,
} from "./taxonomy"

export type SkillGapInput = {
  skills: { name: string; level: string }[]
  targetRoles: string[]
  demandedSkills: { skill: string; demandCount: number }[]
}

export type SkillGap = {
  skill: string
  currentLevel: string | null
  weight: number // 0..1 — higher = more urgent
  reason: string
}

const LEVEL_ORDER = ["beginner", "intermediate", "advanced", "expert"]

function levelValue(level: string): number {
  return SKILL_LEVEL_WEIGHT[level] ?? 0.25
}

/**
 * Deterministic skill-gap analysis.
 * Demand sources: (1) taxonomy expectations for target roles,
 * (2) requiredSkills aggregated from the user's saved/target internships.
 * Gaps sorted by urgency = normalized demand × proficiency deficiency.
 */
export function computeSkillGaps(input: SkillGapInput): SkillGap[] {
  const owned = new Map<string, string>()
  for (const s of input.skills) owned.set(normalizeSkill(s.name), s.level)

  const demand = new Map<string, number>()
  const maxDemandSeen = Math.max(
    1,
    ...input.demandedSkills.map((d) => d.demandCount),
  )

  for (const role of input.targetRoles) {
    for (const skill of expectedSkillsForRole(role)) {
      demand.set(skill, (demand.get(skill) ?? 0) + maxDemandSeen * 0.5)
    }
  }
  for (const { skill, demandCount } of input.demandedSkills) {
    const key = normalizeSkill(skill)
    demand.set(key, Math.max(demand.get(key) ?? 0, demandCount / maxDemandSeen))
  }

  const gaps: SkillGap[] = []
  for (const [skill, demandWeight] of demand) {
    const currentLevel = owned.get(skill) ?? null
    if (!currentLevel) {
      gaps.push({
        skill,
        currentLevel: null,
        weight: Math.min(demandWeight, 1),
        reason: "Required by your target roles but not yet in your profile",
      })
      continue
    }
    const deficiency = 1 - levelValue(currentLevel)
    if (deficiency >= 0.5) {
      gaps.push({
        skill,
        currentLevel,
        weight: Math.min(deficiency * demandWeight + 0.15, 1),
        reason: `You self-rate ${currentLevel}; target roles expect intermediate+`,
      })
    }
  }

  return gaps.sort(
    (a, b) => b.weight - a.weight || a.skill.localeCompare(b.skill),
  )
}

/** Coverage of expected skills for a role family (0..1). */
export function skillCoverageScore(
  skills: { name: string; level: string }[],
  targetRole: string,
): number {
  const owned = new Map(skills.map((s) => [normalizeSkill(s.name), s.level]))
  const expected = normalizeSkillList(expectedSkillsForRole(targetRole))
  if (expected.length === 0) return 0.5
  let covered = 0
  for (const skill of expected) {
    const level = owned.get(skill)
    covered += level ? levelValue(level) * 0.7 + 0.3 : 0
  }
  return Math.min(covered / expected.length, 1)
}
