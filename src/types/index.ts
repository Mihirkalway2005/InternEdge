/**
 * Shared client-side API types. These mirror the JSON returned by
 * src/app/api/** routes (Prisma rows are serialized with ISO date strings).
 */

export type UserRole = "student" | "admin" | "mentor" | "placement_cell"
export type WorkType = "remote" | "hybrid" | "onsite"
export type ApplicationStatus = "saved" | "applied" | "assessment" | "interview" | "hr" | "offer" | "rejected"

export type SkillCategory = "frontend" | "backend" | "database" | "devops" | "ai_ml" | "soft_skill" | "other"
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert"
export type InterviewTrack = "technical" | "hr" | "behavioral" | "coding"

export interface Profile {
  id?: string
  headline?: string | null
  university?: string | null
  education?: string | null
  degree?: string | null
  branch?: string | null
  graduationYear?: number | null
  bio?: string | null
  github?: string | null
  linkedin?: string | null
  portfolio?: string | null
  careerGoal?: string | null
  targetRole?: string | null
  targetRoles: string[]
  preferredLocations: string[]
  preferredWorkType?: WorkType | null
  onboardedAt?: string | null
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: SkillLevel
}

export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  github?: string | null
  liveDemo?: string | null
  startDate: string
  endDate?: string | null
}

export interface Experience {
  id: string
  company: string
  role: string
  description: string
  startDate: string
  endDate?: string | null
}

export interface Company {
  id: string
  name: string
  logoUrl?: string | null
  logo?: string | null
  website?: string | null
  industry: string
  size?: string | null
  description: string
}

export interface InternshipWithCompany {
  id: string
  title: string
  description: string
  location: string
  workType: WorkType
  salary?: string | null
  stipendMin?: number | null
  stipendMax?: number | null
  deadline: string
  requiredSkills: string[]
  applicationUrl?: string | null
  postedAt: string
  company: Company
}

export interface MatchBreakdown {
  skillOverlap: number
  roleAlignment: number
  preferenceFit: number
  eligibility: number
  freshness: number
  resumeAlignment: number
}

export interface MatchResult {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  reasons: string[]
  breakdown?: MatchBreakdown
}

export type ScoredInternship = MatchResult & {
  internship: InternshipWithCompany
  /** Public (unauthenticated) responses return null. */
  match?: MatchResult | null
}

export interface ApplicationEventItem {
  id: string
  fromStatus: ApplicationStatus | null
  toStatus: ApplicationStatus
  note?: string | null
  createdAt: string
}

export interface ApplicationItem {
  id: string
  status: ApplicationStatus
  notes?: string | null
  savedAt: string
  appliedAt: string
  statusUpdatedAt: string
  internship: InternshipWithCompany
  events?: ApplicationEventItem[]
}

export interface ATSAnalysisPayload {
  overallScore: number
  dimensions: {
    keywordCoverage: number
    formatting: number
    impactVerbs: number
    quantification: number
    sectionCompleteness: number
    relevanceToRole: number
  }
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: {
    title: string
    detail: string
    priority: "high" | "medium" | "low"
  }[]
  summary: string
}

export interface ResumeListItem {
  id: string
  fileName?: string | null
  atsScore?: number | null
  keywords: string[]
  missingKeywords: string[]
  status: "uploaded" | "parsed" | "analyzed" | "failed"
  statusMessage?: string | null
  version: number
  isPrimary: boolean
  sizeBytes?: number | null
  analysis?: ATSAnalysisPayload | null
  createdAt: string
  updatedAt: string
}

export interface ImprovementSuggestionItem {
  section: string
  originalText?: string | null
  suggestedRewrite: string
  rationale: string
  isAddition: boolean
  confidence: number
}
export interface ImprovementSet {
  suggestions: ImprovementSuggestionItem[]
  generalNotes: string[]
}

export interface RoadmapTaskItem {
  id: string
  title: string
  description?: string | null
  week?: number | null
  dueDate?: string | null
  category?: string | null
  skillName?: string | null
  resourceUrl?: string | null
  priority: number
  completed: boolean
  completedAt?: string | null
}

export interface RoadmapItem {
  id: string
  title?: string | null
  targetRole: string
  overallProgress: number
  isActive: boolean
  createdAt: string
  tasks: RoadmapTaskItem[]
}

export interface InterviewTranscriptEntry {
  question: string
  rubricKeywords: string[]
  answer: string
  score: number | null
  strengths: string[]
  improvements: string[]
  keywordCoverage: string[]
  followUpAsked?: boolean
}

export interface InterviewSession {
  id: string
  track: InterviewTrack
  status: "in_progress" | "completed" | "abandoned"
  title?: string | null
  difficulty?: string | null
  roleContext?: string | null
  score?: number | null
  feedback?: string | null
  questions: { items: InterviewTranscriptEntry[] }
  currentQuestionIndex: number
  startedAt: string
  completedAt?: string | null
  durationSec?: number | null
}

export interface AnswerEvaluationResult {
  evaluation: {
    score: number
    strengths: string[]
    improvements: string[]
    followUpQuestion?: string | null
    keywordCoverage: string[]
  }
  nextIndex: number
  totalQuestions: number
  isLast: boolean
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: "deadline" | "roadmap" | "interview" | "resume" | "application" | "system"
  link?: string | null
  read: boolean
  createdAt: string
}

export interface ActivityLogItem {
  id: string
  action: string
  entityType?: string | null
  entityId?: string | null
  details?: string | null
  timestamp: string
}

export interface ReadinessComponents {
  resumeQuality: { value: number weight: number }
  skillCoverage: { value: number weight: number }
  projectSignal: { value: number weight: number }
  experienceSignal: { value: number weight: number }
  interviewAvg: { value: number weight: number }
  roadmapProgress: { value: number weight: number }
  applicationActivity: { value: number weight: number }
}

export interface DashboardOverview {
  userName: string
  memberSince?: string | null
  readiness: {
    score: number
    components: ReadinessComponents
    targetRole: string
  }
  atsScore?: number | null
  resumeFileName?: string | null
  applications: {
    total: number
    active: number
    byStatus: Partial<Record<ApplicationStatus, number>>
  }
  topMatches: Array<{
    id: string
    company: string
    title: string
    location: string
    workType: WorkType
    salary?: string | null
    deadline: string
    requiredSkills: string[]
    matchedSkills: string[]
    missingSkills: string[]
    reasons: string[]
    score: number
  }>
  todaysTasks: Array<{
    id: string
    title: string
    category?: string | null
    skillName?: string | null
    dueDate?: string | null
    priority: number
  }>
  upcomingDeadlines: Array<{
    applicationId: string
    company: string
    title: string
    deadline: string
    status: ApplicationStatus
  }>
  recentActivity: ActivityLogItem[]
  unreadNotifications: number
  hasRoadmap: boolean
}

export interface AnalyticsResponse {
  totalInternships: number
  funnel: Record<string, number> & { total: number }
  conversionRates: { interviewRate: number | null offerRate: number | null }
  weeklyApplications: { week: string count: number }[]
  interviews: {
    avgScore: number | null
    trend: { score: number | null date: string }[]
    count: number
  }
  resume: {
    latestAtsScore?: number | null
    progression: { score: number | null label: string date: string }[]
  }
  readiness: { current: number history: { score: number date: string }[] }
  learning: {
    activeDays30d: number
    streak: number
    roadmapProgress: number | null
  }
}

export interface PortfolioData {
  name: string
  email?: string | null
  headline: string
  bio?: string | null
  university?: string | null
  degree?: string | null
  branch?: string | null
  graduationYear?: number | null
  github?: string | null
  linkedin?: string | null
  externalPortfolio?: string | null
  skills: {
    id: string
    name: string
    level: SkillLevel
    category: SkillCategory
  }[]
  projects: Project[]
  experiences: Experience[]
  resumeProjects: unknown[]
}

export interface PortfolioRecord {
  id: string
  slug: string
  headline?: string | null
  bio?: string | null
  data: PortfolioData
  isPublic: boolean
  publishedAt?: string | null
}

export interface AssistantReplyPayload {
  answer: string
  suggestedActions: { label: string href: string }[]
}

/** Standard error envelope from /api routes. */
export interface ApiErrorPayload {
  error: string
  details?: unknown
}
