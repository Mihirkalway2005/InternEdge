import type { StructuredResume } from "@/lib/ai/schemas"
import { normalizeSkillList } from "./taxonomy"

/**
 * Deterministic ATS heuristics. These produce the base scores which the LLM
 * layer refines (relevanceToRole + suggestions). Fully unit-testable.
 */

const ACTION_VERBS = [
  "built",
  "designed",
  "developed",
  "implemented",
  "led",
  "launched",
  "created",
  "optimized",
  "improved",
  "reduced",
  "increased",
  "automated",
  "architected",
  "deployed",
  "migrated",
  "integrated",
  "delivered",
  "engineered",
  "scaled",
  "shipped",
  "mentored",
  "owned",
  "drove",
]

const EXPECTED_SECTIONS = [
  "education",
  "experience",
  "project",
  "skill",
] as const

export type ATSHeuristicResult = {
  impactVerbs: number
  quantification: number
  sectionCompleteness: number
  formatting: number
  wordCount: number
}

function countQuantifiedBullets(
  bullets: string[],
): {
  quantified: number
  total: number
} {
  let total = 0
  let quantified = 0
  for (const bullet of bullets) {
    if (bullet.trim().length < 8) continue
    total++
    if (
      /\d+\s?(%|percent|x|ms|k\b|hours|users|requests|rps|qps)/i.test(bullet) ||
      /\d{2,}/.test(bullet)
    ) {
      quantified++
    }
  }
  return { quantified, total }
}

export function computeATSHeuristics(
  text: string,
  structured: Partial<StructuredResume> | null,
): ATSHeuristicResult {
  // --- Impact verbs ---
  const bullets: string[] = []
  for (const exp of structured?.experience ?? []) bullets.push(...exp.bullets)
  for (const proj of structured?.projects ?? []) {
    if (proj.description) bullets.push(proj.description)
  }

  let verbHits = 0
  let verbTotal = Math.max(bullets.length, 1)
  for (const b of bullets) {
    const lower = b.toLowerCase()
    if (
      ACTION_VERBS.some((v) => lower.startsWith(v) || lower.includes(` ${v}`))
    ) {
      verbHits++
    }
  }
  const impactVerbs =
    bullets.length === 0 ? 50 : Math.round((verbHits / verbTotal) * 100)

  // --- Quantification ---
  const { quantified, total } = countQuantifiedBullets(
    bullets.length > 0 ? bullets : text.split(/\.\n/),
  )
  const quantification =
    total === 0 ? 30 : Math.min(Math.round((quantified / total) * 100), 100)

  // --- Section completeness ---
  const lower = text.toLowerCase()
  const found = EXPECTED_SECTIONS.filter((s) => lower.includes(s)).length
  const hasContact = Boolean(structured?.email) || /@/.test(text)
  const sectionCompleteness = Math.round(
    ((found + (hasContact ? 1 : 0)) / (EXPECTED_SECTIONS.length + 1)) * 100,
  )

  // --- Formatting proxies ---
  const lines = text.split("\n").filter((l) => l.trim())
  const avgLineLen =
    lines.reduce((sum, l) => sum + l.length, 0) / Math.max(lines.length, 1)
  const hasWeirdChars = (text.match(/[^\x09\x0A\x0D\x20-\x7E]/g) ?? []).length
  const formatting = Math.max(
    0,
    Math.min(
      100,
      Math.round(100 - Math.abs(avgLineLen - 80) * 0.5 - hasWeirdChars * 2),
    ),
  )

  return {
    impactVerbs,
    quantification,
    sectionCompleteness,
    formatting,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  }
}

/** Role keyword coverage against a target-role taxonomy. */
export function computeKeywordCoverage(
  resumeText: string,
  roleKeywords: string[],
): { matched: string[] missing: string[] coveragePct: number } {
  const normalizedText = normalizeSkillList(resumeText.split(/[^a-zA-Z+#.]+/))
  const textSet = new Set(normalizedText)
  const matched: string[] = []
  const missing: string[] = []
  for (const kw of normalizeSkillList(roleKeywords)) {
    if (textSet.has(kw)) matched.push(kw)
    else missing.push(kw)
  }
  return {
    matched,
    missing,
    coveragePct:
      roleKeywords.length === 0
        ? 0
        : Math.round((matched.length / roleKeywords.length) * 100),
  }
}
