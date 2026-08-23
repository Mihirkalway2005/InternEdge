/**
 * Deterministic skill taxonomy: normalization + role → expected skills map.
 * Used by matching, skill-gap and readiness engines (no LLM involved).
 */

const ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  "next.js": "nextjs",
  nextjs: "nextjs",
  reactjs: "react",
  "react.js": "react",
  node: "nodejs",
  "node.js": "nodejs",
  postgres: "postgresql",
  psql: "postgresql",
  mongo: "mongodb",
  k8s: "kubernetes",
  ml: "machine learning",
  ai: "artificial intelligence",
  pytorch: "pytorch",
  tensorflow: "tensorflow",
  cpp: "c++",
  csharp: "c#",
  golang: "go",
  rb: "ruby",
  tailwindcss: "tailwind css",
  "tailwind-css": "tailwind css",
  rest: "rest apis",
  api: "rest apis",
  apis: "rest apis",
  sql: "sql",
  llms: "llm",
  "large language models": "llm",
}

/** Lowercase, trim, strip punctuation, resolve aliases. */
export function normalizeSkill(name: string): string {
  const cleaned = name.toLowerCase().trim().replace(/[^a-z0-9+#.\s/-]/g, "")
  return ALIASES[cleaned] ?? cleaned
}

export function normalizeSkillList(names: string[]): string[] {
  return [...new Set(names.map(normalizeSkill).filter(Boolean))]
}

/**
 * Expected skill profile per target-role family.
 * Keys are tokens likely to appear in role titles/descriptions.
 */
export const ROLE_TAXONOMY: Record<string, string[]> = {
  frontend: [
    "javascript", "typescript", "react", "nextjs", "html", "css",
    "tailwind css", "redux", "testing", "accessibility", "web performance",
  ],
  backend: [
    "nodejs", "python", "java", "go", "postgresql", "mongodb", "redis",
    "rest apis", "graphql", "microservices", "docker", "aws", "system design",
  ],
  fullstack: [
    "javascript", "typescript", "react", "nextjs", "nodejs", "postgresql",
    "rest apis", "git", "docker", "tailwind css", "aws",
  ],
  mobile: [
    "swift", "kotlin", "flutter", "dart", "react native", "ios", "android",
    "rest apis", "mobile architecture",
  ],
  data: [
    "python", "sql", "pandas", "numpy", "spark", "airflow", "etl",
    "data warehousing", "tableau", "dbt",
  ],
  "ai/ml": [
    "python", "pytorch", "tensorflow", "machine learning", "deep learning",
    "nlp", "llm", "computer vision", "pandas", "numpy", "scikit-learn",
    "linear algebra", "cuda",
  ],
  devops: [
    "linux", "docker", "kubernetes", "terraform", "aws", "ci/cd", "jenkins",
    "ansible", "prometheus", "bash",
  ],
  systems: [
    "c++", "rust", "go", "computer architecture", "operating systems",
    "distributed systems", "networking", "cuda", "performance engineering",
  ],
  security: [
    "networking", "linux", "python", "owasp", "penetration testing",
    "cryptography", "siem", "incident response",
  ],
}

export type RoleFamily = keyof typeof ROLE_TAXONOMY

const FAMILY_TITLE_TOKENS: [string, RoleFamily][] = [
  ["frontend", "frontend"], ["front-end", "frontend"], ["ui engineer", "frontend"],
  ["web developer", "frontend"], ["react", "frontend"],
  ["backend", "backend"], ["back-end", "backend"], ["api engineer", "backend"],
  ["platform", "backend"],
  ["fullstack", "fullstack"], ["full-stack", "fullstack"], ["software engineer", "fullstack"],
  ["swe", "fullstack"], ["web development", "fullstack"],
  ["mobile", "mobile"], ["ios", "mobile"], ["android", "mobile"], ["flutter", "mobile"],
  ["data analyst", "data"], ["data engineer", "data"], ["analytics", "data"], ["bi ", "data"],
  ["machine learning", "ai/ml"], ["ml ", "ai/ml"], ["ai engineer", "ai/ml"],
  ["deep learning", "ai/ml"], ["nlp", "ai/ml"], ["research intern", "ai/ml"],
  ["devops", "devops"], ["sre", "devops"], ["infrastructure", "devops"], ["cloud engineer", "devops"],
  ["systems", "systems"], ["embedded", "systems"], ["kernel", "systems"], ["gpu", "systems"],
  ["security", "security"], ["cybersecurity", "security"],
]

/** Infer the dominant role family from a role title (+ optional description). */
export function inferRoleFamily(title: string, description = ""): RoleFamily | null {
  const haystack = `${title} ${description.slice(0, 400)}`.toLowerCase()
  for (const [token, family] of FAMILY_TITLE_TOKENS) {
    if (haystack.includes(token)) return family
  }
  return null
}

/** Expected skills for an arbitrary target-role string. */
export function expectedSkillsForRole(roleTitle: string): string[] {
  const family = inferRoleFamily(roleTitle)
  if (family) return ROLE_TAXONOMY[family]
  // Fallback: generic SWE baseline
  return ROLE_TAXONOMY.fullstack
}

export const SKILL_LEVEL_WEIGHT: Record<string, number> = {
  beginner: 0.25,
  intermediate: 0.5,
  advanced: 0.75,
  expert: 1,
}
