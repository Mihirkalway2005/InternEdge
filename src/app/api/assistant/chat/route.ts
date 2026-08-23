import { z } from "zod"
import { prisma } from "@/lib/db"
import {
  ApiError,
  handleRoute,
  json,
  parseBody,
  requireUser,
} from "@/lib/api-helpers"
import { assistantReply, isAIEnabled } from "@/lib/ai/services"
import { checkRateLimit } from "@/lib/rate-limit"

/**
 * Contextual AI assistant. The context digest is built SERVER-SIDE from the
 * authenticated user's own records — a user can never reference another
 * user's data, and the model only sees a compact summary.
 */
async function buildContextDigest(userId: string): Promise<string> {
  const [profile, skills, appsByStatus, roadmap, resume, interviews] =
    await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.skill.findMany({
        where: { userId },
        select: { name: true, level: true },
        take: 25,
      }),
      prisma.application.groupBy({
        by: ["status"],
        where: { userId },
        _count: { status: true },
      }),
      prisma.roadmap.findFirst({
        where: { userId, isActive: true },
        include: { tasks: { select: { completed: true }, take: 30 } },
      }),
      prisma.resume.findFirst({
        where: { userId, atsScore: { not: null } },
        orderBy: { createdAt: "desc" },
        select: { atsScore: true, missingKeywords: true },
      }),
      prisma.interview.findMany({
        where: { userId, status: "completed" },
        select: { score: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])

  if (!profile && skills.length === 0) {
    return "New user; onboarding incomplete. Encourage completing their profile."
  }

  const parts: string[] = []
  if (profile) {
    parts.push(
      [
        profile.headline,
        profile.university,
        profile.degree,
        profile.graduationYear ? `graduating ${profile.graduationYear}` : null,
        profile.targetRoles?.length
          ? `target roles: ${profile.targetRoles.join(", ")}`
          : null,
        profile.preferredLocations?.length
          ? `preferred locations: ${profile.preferredLocations.join(", ")}`
          : null,
        profile.careerGoal ? `goal: ${profile.careerGoal}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
    )
  }
  if (skills.length > 0) {
    parts.push(
      `Skills: ${skills.map((s) => `${s.name} (${s.level})`).join(", ")}`,
    )
  }
  if (appsByStatus.length > 0) {
    parts.push(
      `Applications: ${appsByStatus.map((a) => `${a._count.status} ${a.status}`).join(", ")}`,
    )
  }
  if (roadmap) {
    const done = roadmap.tasks.filter((t) => t.completed).length
    parts.push(
      `Roadmap "${roadmap.title ?? roadmap.targetRole}" progress: ${done}/${roadmap.tasks.length} tasks`,
    )
  }
  if (resume) {
    parts.push(
      `Latest resume ATS score: ${resume.atsScore}. Missing keywords: ${resume.missingKeywords.slice(0, 8).join(", ") || "none"}`,
    )
  }
  if (interviews.length > 0) {
    parts.push(
      `Recent interview scores: ${interviews.map((i) => i.score).join(", ")}`,
    )
  }

  return parts.join("\n")
}

const chatSchema = z.object({
  conversationId: z.string().max(64).default("default"),
  message: z.string().min(1).max(4000),
})

export const POST = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()

  if (!checkRateLimit(`assistant:${userId}`, 20, 60 * 60 * 1000)) {
    throw new ApiError(429, "Assistant limit reached (20 messages/hour)")
  }
  if (!isAIEnabled()) {
    throw new ApiError(
      503,
      "AI provider not configured. Set GROQ_API_KEY to enable the assistant.",
    )
  }

  const body = await parseBody(req, chatSchema)

  // Rolling window of this user's own conversation.
  const history = await prisma.assistantMessage.findMany({
    where: { userId, conversationId: body.conversationId },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  const digest = await buildContextDigest(userId)
  const reply = await assistantReply({
    history: history
      .reverse()
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    contextDigest: digest,
    message: body.message,
  })

  await prisma.assistantMessage.createMany({
    data: [
      {
        userId,
        conversationId: body.conversationId,
        role: "user",
        content: body.message.slice(0, 4000),
      },
      {
        userId,
        conversationId: body.conversationId,
        role: "assistant",
        content: reply.answer.slice(0, 6000),
      },
    ],
  })

  return json(reply)
})
