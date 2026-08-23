import { prisma } from "@/lib/db"
import { scoreInternship, type UserMatchContext } from "@/lib/engine/matching"
import { skillCoverageScore } from "@/lib/engine/skillgap"
import { computeReadiness } from "@/lib/engine/readiness"
import { sweepDeadlines } from "./notifier"

/** Build the user's match context (skills, targets, resume keywords). */
export async function getUserMatchContext(userId: string): Promise<UserMatchContext> {
  const [profile, skills, primaryResume] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.skill.findMany({ where: { userId }, select: { name: true, level: true } }),
    prisma.resume.findFirst({
      where: { userId, status: "analyzed" },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
      select: { keywords: true },
    }),
  ])

  return {
    skills,
    targetRoles:
      profile?.targetRoles?.length ? profile.targetRoles : profile?.targetRole ? [profile.targetRole] : [],
    preferredLocations: profile?.preferredLocations ?? [],
    preferredWorkType: profile?.preferredWorkType ?? null,
    graduationYear: profile?.graduationYear ?? null,
    resumeKeywords: primaryResume?.keywords ?? [],
  }
}

export async function computeMatches(userId: string, limit = 20) {
  const [context, internships] = await Promise.all([
    getUserMatchContext(userId),
    prisma.internship.findMany({
      where: { isActive: true },
      include: { company: true },
      orderBy: { deadline: "asc" },
      take: 120,
    }),
  ])

  return internships
    .map((internship) => {
      const result = scoreInternship(context, {
        title: internship.title,
        description: internship.description,
        location: internship.location,
        workType: internship.workType,
        requiredSkills: internship.requiredSkills,
        deadline: internship.deadline,
        stipendMin: internship.stipendMin,
        stipendMax: internship.stipendMax,
      })
      return { ...result, internship }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/** Full readiness computation over real user signals. */
export async function computeUserReadiness(userId: string) {
  const [profile, skills, projects, experiences, interviews, roadmaps, resumes, applications] =
    await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.skill.findMany({ where: { userId } }),
      prisma.project.findMany({ where: { userId } }),
      prisma.experience.findMany({ where: { userId } }),
      prisma.interview.findMany({
        where: { userId, status: "completed" },
        select: { score: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.roadmap.findFirst({
        where: { userId, isActive: true },
        include: { tasks: true },
      }),
      prisma.resume.findFirst({
        where: { userId, atsScore: { not: null } },
        orderBy: { createdAt: "desc" },
        select: { atsScore: true },
      }),
      prisma.application.count({
        where: { userId, status: { not: "saved" } },
      }),
    ])

  const targetRole =
    profile?.targetRoles?.[0] ?? profile?.targetRole ?? "software engineer"

  const roadmapProgress = roadmaps?.tasks.length
    ? Math.round(
        (roadmaps.tasks.filter((t) => t.completed).length / roadmaps.tasks.length) * 100,
      )
    : 0

  const result = computeReadiness({
    latestAtsScore: resumes?.atsScore ?? null,
    skillCoverage: skillCoverageScore(skills, targetRole),
    projects,
    experiences,
    interviewScores: interviews.map((i) => i.score ?? 0),
    roadmapProgress,
    activeApplicationCount: applications,
  })

  return { ...result, roadmapProgress, targetRole }
}

/** Persist a readiness snapshot (max one per day per user). */
export async function recordReadinessSnapshot(userId: string) {
  const latest = await prisma.readinessSnapshot.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
  // Throttle to one snapshot/day unless score changed significantly.
  if (
    latest &&
    Date.now() - latest.createdAt.getTime() < 20 * 60 * 60 * 1000
  ) {
    return null
  }
  const readiness = await computeUserReadiness(userId)
  return prisma.readinessSnapshot.create({
    data: {
      userId,
      score: readiness.score,
      components: readiness.components as unknown as object,
    },
  })
}

/** Dashboard aggregate — everything on the home screen in one round trip. */
export async function getDashboardOverview(userId: string) {
  void sweepDeadlines(userId).catch(() => {})

  const [user, readiness, matches, appsByStatus, todaysTasks, upcomingDeadlines, recentActivity, latestResume, unreadNotifications] =
    await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, createdAt: true } }),
      computeUserReadiness(userId),
      computeMatches(userId, 3),
      prisma.application.groupBy({
        by: ["status"],
        where: { userId },
        _count: { status: true },
      }),
      prisma.roadmapTask.findMany({
        where: {
          completed: false,
          OR: [
            { dueDate: null },
            { dueDate: { lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) } },
          ],
          roadmap: { userId, isActive: true },
        },
        include: { roadmap: { select: { targetRole: true } } },
        orderBy: [{ dueDate: "asc" }],
        take: 5,
      }),
      prisma.application.findMany({
        where: {
          userId,
          status: { in: ["saved", "applied", "assessment"] },
          internship: { isActive: true, deadline: { gt: new Date() } },
        },
        include: { internship: { include: { company: true } } },
        orderBy: { internship: { deadline: "asc" } },
        take: 3,
      }),
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take: 6,
      }),
      prisma.resume.findFirst({
        where: { userId, atsScore: { not: null } },
        orderBy: { createdAt: "desc" },
        select: { atsScore: true, fileName: true, updatedAt: true },
      }),
      prisma.notification.count({ where: { userId, read: false } }),
    ])

  const totalApplications = appsByStatus.reduce((sum, s) => sum + s._count.status, 0)
  const activeApplications = appsByStatus
    .filter((s) => s.status !== "saved" && s.status !== "rejected")
    .reduce((sum, s) => sum + s._count.status, 0)

  return {
    userName: user?.name ?? "Student",
    memberSince: user?.createdAt ?? null,
    readiness: {
      score: readiness.score,
      components: readiness.components,
      targetRole: readiness.targetRole,
    },
    atsScore: latestResume?.atsScore ?? null,
    resumeFileName: latestResume?.fileName ?? null,
    applications: {
      total: totalApplications,
      active: activeApplications,
      byStatus: Object.fromEntries(appsByStatus.map((s) => [s.status, s._count.status])),
    },
    topMatches: matches.map((m) => ({
      id: m.internship.id,
      company: m.internship.company.name,
      title: m.internship.title,
      location: m.internship.location,
      workType: m.internship.workType,
      salary: m.internship.salary,
      deadline: m.internship.deadline,
      requiredSkills: m.internship.requiredSkills.slice(0, 4),
      score: m.score,
      matchedSkills: m.matchedSkills.slice(0, 3),
      missingSkills: m.missingSkills.slice(0, 3),
      reasons: m.reasons,
    })),
    todaysTasks: todaysTasks.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      dueDate: t.dueDate,
      priority: t.priority,
    })),
    upcomingDeadlines: upcomingDeadlines.map((a) => ({
      applicationId: a.id,
      company: a.internship.company.name,
      title: a.internship.title,
      deadline: a.internship.deadline,
      status: a.status,
    })),
    recentActivity,
    unreadNotifications,
    hasRoadmap: Boolean(readiness.roadmapProgress != null),
  }
}
