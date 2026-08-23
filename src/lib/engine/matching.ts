import {
  expectedSkillsForRole,
  inferRoleFamily,
  normalizeSkill,
  normalizeSkillList,
  ROLE_TAXONOMY,
  SKILL_LEVEL_WEIGHT,
} from "./taxonomy"

export type UserMatchContext = {
  skills: { name: string; level: string }[]
  targetRoles: string[]
  preferredLocations: string[]
  preferredWorkType: string | null
  graduationYear: number | null
  resumeKeywords: string[]
}

export type InternshipMatchInput = {
  title: string
  description: string
  location: string
  workType: string
  requiredSkills: string[]
  deadline: Date
  stipendMin?: number | null
  stipendMax?: number | null
}

export type MatchResult = {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  reasons: string[]
  breakdown: {
    skillOverlap: number
    roleAlignment: number
    preferenceFit: number
    eligibility: number
    freshness: number
    resumeAlignment: number
  }
}

const WEIGHTS = {
  skillOverlap: 0.4,
  roleAlignment: 0.2,
  preferenceFit: 0.15,
  eligibility: 0.1,
  freshness: 0.05,
  resumeAlignment: 0.1,
} as const

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9+#./]+/)
      .filter((t) => t.length > 1),
  )
}

/**
 * Deterministic internship↔user matching.
 * Weights: skills .40, target-role alignment .20, location/work-type fit .15,
 * graduation eligibility .10, deadline freshness .05, resume keywords .10.
 */
export function scoreInternship(
  user: UserMatchContext,
  internship: InternshipMatchInput,
): MatchResult {
  const userSkills = new Map<string, string>()
  for (const s of user.skills) {
    userSkills.set(normalizeSkill(s.name), s.level)
  }
  const required = normalizeSkillList(internship.requiredSkills)

  // --- Skill overlap (proficiency weighted Jaccard-style coverage) ---
  let coveredWeight = 0
  const matchedSkills: string[] = []
  for (const req of required) {
    const level = userSkills.get(req)
    if (level) {
      coveredWeight += SKILL_LEVEL_WEIGHT[level] ?? 0.5
      matchedSkills.push(req)
    }
  }
  const skillCoverage =
    required.length === 0 ? 0.5 : Math.min(coveredWeight / required.length, 1)
  const missingSkills = required.filter((r) => !userSkills.has(r))

  // --- Role alignment ---
  const family = inferRoleFamily(internship.title, internship.description)
  const expectedForFamily = family ? ROLE_TAXONOMY[family] : null
  const roleTokens = tokenize(`${internship.title} ${internship.description}`)
  let roleAlignment = 0
  const rolesToCheck =
    user.targetRoles.length > 0 ? user.targetRoles : ["software engineer"]
  for (const target of rolesToCheck) {
    const expected = new Set(expectedSkillsForRole(target))
    // Overlap between what this internship wants and what the target path needs.
    const overlap = [...expected].filter(
      (s) => required.includes(s) || roleTokens.has(s),
    ).length
    const directTokenOverlap = [...tokenize(target)].filter((t) =>
      roleTokens.has(t),
    ).length
    roleAlignment = Math.max(
      roleAlignment,
      Math.min(
        (overlap / Math.max(expected.size, 1)) * 0.7 +
          (directTokenOverlap > 0 ? 0.3 : 0),
        1,
      ),
    )
    if (expectedForFamily && overlap > 0) break
  }

  // --- Preference fit (location + work type) ---
  let preferenceFit = 0.5
  const locLower = internship.location.toLowerCase()
  if (user.preferredLocations.length > 0) {
    const locationMatch = user.preferredLocations.some((loc) => {
      const l = loc.toLowerCase()
      if (l.includes("remote")) return locLower.includes("remote")
      return (
        locLower.includes(l) || l.split(/[,\s]+/).some((part) =>
          part.length > 3 && locLower.includes(part),
        )
      )
    })
    preferenceFit = locationMatch ? 0.75 : 0.25
  } else if (locLower.includes("remote")) {
    preferenceFit = 0.75
  }
  if (user.preferredWorkType) {
    preferenceFit +=
      internship.workType === user.preferredWorkType ? 0.25 : -0.15
  }
  preferenceFit = Math.max(0, Math.min(1, preferenceFit))

  // --- Eligibility (graduation year sanity) ---
  let eligibility = 0.75
  if (user.graduationYear != null) {
    const gradYear = user.graduationYear
    const currentYear = new Date().getFullYear()
    if (gradYear >= currentYear && gradYear <= currentYear + 2) eligibility = 1
    else if (gradYear === currentYear - 1) eligibility = 0.5
    else if (gradYear < currentYear - 1) eligibility = 0.25
  }

  // --- Deadline freshness ---
  const daysLeft = Math.ceil(
    (internship.deadline.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
  )
  const freshness =
    daysLeft <= 0 ? 0 : daysLeft < 7 ? 0.6 : daysLeft < 30 ? 1 : 0.8

  // --- Resume keyword alignment ---
  const resumeKeywords = normalizeSkillList(user.resumeKeywords)
  const resumeAligned =
    resumeKeywords.length === 0
      ? 0.5
      : (() => {
          const hits = required.filter((r) => resumeKeywords.includes(r)).length
          return Math.min(hits / Math.max(required.length, 1), 1)
        })()

  const breakdown = {
    skillOverlap: skillCoverage,
    roleAlignment,
    preferenceFit,
    eligibility,
    freshness,
    resumeAlignment: resumeAligned,
  }

  const score = Math.round(
    (breakdown.skillOverlap * WEIGHTS.skillOverlap +
      breakdown.roleAlignment * WEIGHTS.roleAlignment +
      breakdown.preferenceFit * WEIGHTS.preferenceFit +
      breakdown.eligibility * WEIGHTS.eligibility +
      breakdown.freshness * WEIGHTS.freshness +
      breakdown.resumeAlignment * WEIGHTS.resumeAlignment) *
      100,
  )

  const reasons: string[] = []
  if (matchedSkills.length > 0) {
    reasons.push(`Matches ${matchedSkills.length}/${required.length} required skills`)
  } else if (required.length > 0) {
    reasons.push("No required-skill overlap yet — see missing skills")
  } else {
    reasons.push("No explicit skill requirements listed")
  }
  if (roleAlignment >= 0.5) {
    reasons.push(`Aligns with your target role${user.targetRoles[0] ? ` (${user.targetRoles[0]})` : ""}`)
  }
  if (preferenceFit >= 0.7) {
    reasons.push("Fits your location & work-mode preferences")
  }
  if (daysLeft > 0 && daysLeft < 14) {
    reasons.push(`Deadline in ${daysLeft} days`)
  }

  return { score, matchedSkills, missingSkills, reasons, breakdown }
}
