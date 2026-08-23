import { prisma } from "@/lib/db"
import { handleRoute, json, requireUser } from "@/lib/api-helpers"
import { computeUserReadiness } from "@/lib/services/dashboard-service"

type StatusCounts = Record<string, number>

/**
 * All analytics derived from real records via SQL aggregations:
 * - funnel: applications by status
 * - weeklyApplications: last 8 weeks (date_trunc)
 * - conversion: interview÷applied, offer÷applied
 * - interviewTrend: last 10 completed sessions (chronological)
 * - atsProgression: per-resume scores (chronological)
 * - readinessHistory: snapshot timeline
 * - learningStreak: distinct active days over last 30 days
 */
export const GET = handleRoute(async () => {
  const { userId } = await requireUser()

  const [
    statusGroups,
    weeklyRows,
    interviews,
    resumes,
    snapshots,
    roadmap,
    activityDays,
    totalInternships,
  ] = await Promise.all([
    prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    prisma.$queryRaw<{ week: Date; count: bigint }[]>`
      SELECT date_trunc('week', "savedAt") AS week, COUNT(*)::bigint AS count
      FROM applications
      WHERE "userId" = ${userId}
        AND "savedAt" > now() - interval '8 weeks'
      GROUP BY 1 ORDER BY 1 ASC`,
    prisma.interview.findMany({
      where: { userId, status: "completed", score: { not: null } },
      select: { score: true, createdAt: true, track: true },
      orderBy: { createdAt: "asc" },
      take: 20,
    }),
    prisma.resume.findMany({
      where: { userId, atsScore: { not: null } },
      select: { id: true, atsScore: true, fileName: true, version: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.readinessSnapshot.findMany({
      where: { userId },
      select: { score: true, createdAt: true },
      orderBy: { createdAt: "asc" },
      take: 60,
    }),
    prisma.roadmap.findFirst({
      where: { userId, isActive: true },
      include: { tasks: { select: { completed: true } } },
    }),
    prisma.activityLog.findMany({
      where: { userId, timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { timestamp: true },
    }),
    prisma.internship.count({ where: { isActive: true } }),
  ])

  const byStatus: StatusCounts = Object.fromEntries(
    statusGroups.map((g) => [g.status, g._count.status]),
  )
  const applied = (byStatus.applied ?? 0) + (byStatus.assessment ?? 0) +
    (byStatus.interview ?? 0) + (byStatus.hr ?? 0) + (byStatus.offer ?? 0) + (byStatus.rejected ?? 0)
  const interviewStage = (byStatus.interview ?? 0) + (byStatus.hr ?? 0) + (byStatus.offer ?? 0)
  const offers = byStatus.offer ?? 0

  const uniqueActiveDays = new Set(
    activityDays.map((a) => a.timestamp.toISOString().slice(0, 10)),
  ).size

  // Consecutive-day streak ending today/yesterday.
  let streak = 0
  {
    const days = new Set(uniqueActiveDays ? Array.from(new Set(activityDays.map((a) => a.timestamp.toISOString().slice(0, 10)))) : [])
    const cursor = new Date()
    for (let i = 0; i < 30; i++) {
      const key = cursor.toISOString().slice(0, 10)
      if (days.has(key)) streak++
      else if (i > 0 || !days.has(key)) break
      cursor.setDate(cursor.getDate() - 1)
    }
  }

  const roadmapProgress = roadmap?.tasks.length
    ? Math.round((roadmap.tasks.filter((t) => t.completed).length / roadmap.tasks.length) * 100)
    : null

  const readiness = await computeUserReadiness(userId)

  return json({
    totalInternships,
    funnel: {
      saved: byStatus.saved ?? 0,
      applied,
      assessment: byStatus.assessment ?? 0,
      interview: interviewStage,
      hr: byStatus.hr ?? 0,
      offer: offers,
      rejected: byStatus.rejected ?? 0,
      total: Object.values(byStatus).reduce((s, n) => s + n, 0),
    },
    conversionRates: {
      interviewRate: applied === 0 ? null : Math.round((interviewStage / applied) * 100),
      offerRate: applied === 0 ? null : Math.round((offers / applied) * 100),
    },
    weeklyApplications: weeklyRows.map((r) => ({
      week: r.week,
      count: Number(r.count),
    })),
    interviews: {
      avgScore:
        interviews.length === 0
          ? null
          : Math.round(
              (interviews.reduce((s, i) => s + (i.score ?? 0), 0) / interviews.length) * 10,
            ) / 10,
      trend: interviews.slice(-10).map((i) => ({ score: i.score, date: i.createdAt })),
      count: interviews.length,
    },
    resume: {
      latestAtsScore: resumes.length ? resumes[resumes.length - 1].atsScore : null,
      progression: resumes.map((r) => ({
        score: r.atsScore,
        label: r.fileName ?? `v${r.version}`,
        date: r.createdAt,
      })),
    },
    readiness: {
      current: readiness.score,
      history: snapshots.map((s) => ({ score: s.score, date: s.createdAt })),
    },
    learning: {
      activeDays30d: uniqueActiveDays,
      streak,
      roadmapProgress,
    },
  })
})
