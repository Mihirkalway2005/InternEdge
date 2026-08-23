import { z } from "zod"
import { prisma } from "@/lib/db"
import {
  ApiError,
  handleRoute,
  json,
  parseBody,
  requireUser,
} from "@/lib/api-helpers"
import { logActivity } from "@/lib/services/notifier"

async function buildPortfolioData(userId: string) {
  const [user, profile, skills, projects, experiences, resume] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.skill.findMany({
        where: { userId },
        orderBy: [{ level: "desc" }, { name: "asc" }],
      }),
      prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.experience.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.resume.findFirst({
        where: { userId, status: "analyzed" },
        select: { structured: true },
        orderBy: { isPrimary: "desc" },
      }),
    ])

  return {
    name: user?.name ?? "Student",
    email: user?.email ?? null,
    headline:
      profile?.headline ??
      profile?.targetRoles?.[0] ??
      profile?.targetRole ??
      "Aspiring Software Engineer",
    bio: profile?.bio ?? profile?.careerGoal ?? null,
    university: profile?.university,
    degree: profile?.degree,
    branch: profile?.branch,
    graduationYear: profile?.graduationYear,
    github: profile?.github,
    linkedin: profile?.linkedin,
    externalPortfolio: profile?.portfolio,
    skills,
    projects,
    experiences,
    resumeProjects:
      (resume?.structured as { projects?: unknown[] } | null)?.projects ?? [],
  }
}

function slugify(name: string, fallback: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
  return base || fallback.slice(0, 12)
}

export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  let portfolio = await prisma.portfolio.findUnique({ where: { userId } })
  if (!portfolio) {
    // Materialize a draft on first visit from real user data.
    const data = await buildPortfolioData(userId)
    portfolio = await prisma.portfolio.create({
      data: {
        userId,
        slug: `${slugify(data.name, userId)}-${userId.slice(-6)}`,
        headline: data.headline,
        bio: data.bio,
        data: data as unknown as object,
      },
    })
  }
  return json(portfolio)
})

/** Regenerate the render payload from the user's current live data. */
export const PUT = handleRoute(async () => {
  const { userId } = await requireUser()
  const data = await buildPortfolioData(userId)

  const existing = await prisma.portfolio.findUnique({ where: { userId } })
  const portfolio = await prisma.portfolio.upsert({
    where: { userId },
    create: {
      userId,
      slug: `${slugify(data.name, userId)}-${userId.slice(-6)}`,
      headline: data.headline,
      bio: data.bio,
      data: data as unknown as object,
    },
    update: {
      headline: data.headline,
      bio: data.bio,
      data: data as unknown as object,
    },
  })
  void logActivity({
    userId,
    action: "portfolio_updated",
    entityType: "portfolio",
    entityId: portfolio.id,
  })
  return json({ ...portfolio, regenerated: Boolean(existing) })
})

const publishSchema = z.object({ isPublic: z.boolean() })

/** Publish/unpublish toggles the public /p/[slug] route. */
export const POST = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()
  const body = await parseBody(req, publishSchema)

  const existing = await prisma.portfolio.findUnique({ where: { userId } })
  if (!existing) throw new ApiError(404, "Generate your portfolio first")

  const portfolio = await prisma.portfolio.update({
    where: { userId },
    data: {
      isPublic: body.isPublic,
      publishedAt: body.isPublic ? (existing.publishedAt ?? new Date()) : null,
    },
  })

  await logActivity({
    userId,
    action: body.isPublic ? "portfolio_published" : "portfolio_unpublished",
    entityType: "portfolio",
    entityId: portfolio.id,
    details: `/p/${portfolio.slug}`,
  })

  return json(portfolio)
})
