import { z } from "zod"
import { prisma } from "@/lib/db"
import {
  assertOwned,
  handleRoute,
  json,
  requireUser,
} from "@/lib/api-helpers"
import { computeSkillGaps } from "@/lib/engine/skillgap"
import { generateRoadmapPlan } from "@/lib/ai/services"
import { logActivity } from "@/lib/services/notifier"

export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  const roadmaps = await prisma.roadmap.findMany({
    where: { userId },
    include: {
      tasks: { orderBy: [{ week: "asc" }, { priority: "asc" }, { createdAt: "asc" }] },
    },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  })
  return json(roadmaps)
})

const generateSchema = z.object({
  regenerate: z.boolean().optional(),
})

/**
 * Generate a roadmap grounded in the user's real skill gaps.
 * Uses the LLM when configured; falls back to a deterministic template.
 * Previous active roadmap is archived (versioned, never silently replaced).
 */
export const POST = handleRoute(async (_req: Request) => {
  const { userId } = await requireUser()

  const [profile, skills, demanded] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.skill.findMany({ where: { userId } }),
    // Demand signal: requiredSkills across the user's saved/active applications
    prisma.application.findMany({
      where: { userId },
      select: { internship: { select: { requiredSkills: true } } },
      distinct: ["internshipId"],
    }),
  ])

  const targetRole =
    profile?.targetRoles?.[0] ?? profile?.targetRole ?? "Software Engineering Intern"

  const demandMap = new Map<string, number>()
  for (const app of demanded) {
    for (const skill of app.internship.requiredSkills) {
      demandMap.set(skill.toLowerCase(), (demandMap.get(skill.toLowerCase()) ?? 0) + 1)
    }
  }

  const gaps = computeSkillGaps({
    skills,
    targetRoles: profile?.targetRoles?.length ? profile.targetRoles : [targetRole],
    demandedSkills: [...demandMap].map(([skill, demandCount]) => ({ skill, demandCount })),
  })

  if (gaps.length === 0 && skills.length === 0) {
    return json(
      {
        error:
          "Add your target role and some skills in your profile first — roadmaps are generated from your skill gaps.",
      },
      400,
    )
  }

  const plan =
    (await generateRoadmapPlan({
      targetRole,
      gaps,
      knownSkills: skills.map((s) => s.name),
    })) ?? deterministicPlan(targetRole, gaps)

  // Archive previous active roadmap(s).
  await prisma.roadmap.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  })

  const now = new Date()
  const roadmap = await prisma.roadmap.create({
    data: {
      userId,
      title: plan.title,
      targetRole,
      isActive: true,
      tasks: {
        create: plan.weeks.flatMap((week) =>
          week.tasks.map((task) => ({
            title: task.title,
            description: task.detail ?? null,
            category: task.category ?? null,
            skillName: task.skillName ?? null,
            resourceUrl: task.resourceUrl ?? null,
            priority: task.priority,
            week: week.week,
            dueDate: new Date(now.getTime() + week.week * 7 * 24 * 60 * 60 * 1000),
          })),
        ),
      },
    },
    include: { tasks: true },
  })

  await logActivity({
    userId,
    action: "roadmap_generated",
    entityType: "roadmap",
    entityId: roadmap.id,
    details: `${targetRole}: ${roadmap.tasks.length} tasks`,
  })

  return json(roadmap, 201)
})

function deterministicPlan(
  targetRole: string,
  gaps: ReturnType<typeof computeSkillGaps>,
) {
  const topGaps = gaps.slice(0, 12)
  return {
    title: `${targetRole} Readiness Plan`,
    weeks: [1, 2, 3, 4].map((week) => ({
      week,
      focus:
        week === 1
          ? "Foundations"
          : week === 2
            ? "Core skills"
            : week === 3
              ? "Applied practice"
              : "Interview readiness",
      tasks: topGaps.slice((week - 1) * 3, week * 3).map((gap) => ({
        title: `Learn & practice: ${gap.skill}`,
        detail: gap.reason,
        category: null,
        skillName: gap.skill,
        resourceUrl: `https://www.google.com/search?q=${encodeURIComponent(gap.skill + " tutorial")}`,
        priority: gap.weight > 0.7 ? 1 : 2,
      })),
    })).filter((w) => w.tasks.length > 0),
  }
}
