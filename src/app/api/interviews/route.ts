import { z } from "zod"
import { prisma } from "@/lib/db"
import {
  assertOwned,
  handleRoute,
  json,
  parseBody,
  requireUser,
} from "@/lib/api-helpers"
import { generateInterviewQuestions } from "@/lib/ai/services"

const startSchema = z.object({
  track: z.enum(["technical", "hr", "behavioral", "coding"]),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  roleContext: z.string().max(200).optional(),
})

export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  const interviews = await prisma.interview.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 30,
  })
  return json(interviews)
})

/** Start a new interview session: generates questions up front. */
export const POST = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()
  const body = await parseBody(req, startSchema)

  // Abandon any stale in-progress sessions.
  await prisma.interview.updateMany({
    where: { userId, status: "in_progress", startedAt: { lt: new Date(Date.now() - 2 * 60 * 60 * 1000) } },
    data: { status: "abandoned" },
  })

  const [profile] = await Promise.all([
    prisma.profile.findUnique({ where: { userId }, select: { targetRoles: true, targetRole: true } }),
  ])

  const questions = await generateInterviewQuestions({
    track: body.track,
    difficulty: body.difficulty,
    roleContext:
      body.roleContext ??
      profile?.targetRoles?.[0] ??
      profile?.targetRole ??
      null,
  })

  const interview = await prisma.interview.create({
    data: {
      userId,
      track: body.track,
      difficulty: body.difficulty,
      roleContext: body.roleContext ?? profile?.targetRoles?.[0] ?? null,
      title: `${body.track.charAt(0).toUpperCase() + body.track.slice(1)} ${body.difficulty} session`,
      status: "in_progress",
      score: 0,
      feedback: "",
      currentQuestionIndex: 0,
      questions: {
        items: questions.questions.map((q) => ({
          question: q.text,
          rubricKeywords: q.rubricKeywords,
          answer: "",
          score: null,
          strengths: [],
          improvements: [],
          keywordCoverage: [],
          followUpAsked: false,
        })),
      },
    },
  })

  return json(interview, 201)
})
