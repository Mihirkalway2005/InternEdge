import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const [
      totalInternships,
      totalApplications,
      applicationsByStatus,
      interviews,
      roadmaps,
      resumes,
    ] = await Promise.all([
      prisma.internship.count(),
      prisma.application.count({ where: { userId } }),
      prisma.application.groupBy({
        by: ["status"],
        where: { userId },
        _count: { status: true },
      }),
      prisma.interview.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.roadmap.findMany({
        where: { userId },
        include: { tasks: true },
      }),
      prisma.resume.findMany({ where: { userId } }),
    ])

    const latestResume = resumes[0] ?? null
    const avgInterviewScore = interviews.length
      ? Math.round(
          interviews.reduce((sum, i) => sum + i.score, 0) / interviews.length,
        )
      : 0

    return NextResponse.json({
      totalInternships,
      totalApplications,
      applicationsByStatus,
      recentInterviews: interviews,
      avgInterviewScore,
      latestAtsScore: latestResume?.atsScore ?? null,
      roadmaps,
    })
  } catch {
    return NextResponse.json({ error: "Failed to load analytics" }, {
      status: 500,
    })
  }
}
