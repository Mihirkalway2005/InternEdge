import { prisma } from "@/lib/db"
import {
  ApiError,
  assertOwned,
  handleRoute,
  json,
  requireUser,
} from "@/lib/api-helpers"
import { logActivity, notify, recordSnapshotSafe } from "@/lib/services/notifier"

type Params = { params: Promise<{ id: string }> }

type TranscriptItem = { score: number | null }

/** Finalize a session: aggregate scores, produce overall feedback, persist. */
export const POST = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params

  const interview = await prisma.interview.findUnique({ where: { id } })
  assertOwned(interview, userId)
  if (interview.status === "completed") {
    throw new ApiError(409, "Session already completed")
  }

  const transcript = (interview.questions as unknown as { items: TranscriptItem[] }).items
  const answered = transcript.filter((q) => q.score != null)
  if (answered.length === 0) {
    throw new ApiError(400, "Answer at least one question before completing")
  }

  const avg =
    answered.reduce((sum, q) => sum + (q.score ?? 0), 0) / answered.length
  const score = Math.round(avg * 10) / 10

  const strongest = Math.max(...answered.map((q) => q.score ?? 0))
  const weakest = Math.min(...answered.map((q) => q.score ?? 0))
  const feedback =
    `${answered.length}/${transcript.length} questions evaluated. Average ${score}/100. ` +
    `Strongest answer scored ${strongest}, weakest ${weakest}. ` +
    (score >= 75
      ? "Overall strong performance — keep practicing edge cases and depth."
      : score >= 50
        ? "Decent foundation — focus on structuring answers with concrete examples and rubric keywords."
        : "Keep practicing: aim for specific examples, correct fundamentals, and complete (STAR) answers.")

  const durationSec = Math.round((Date.now() - interview.startedAt.getTime()) / 1000)

  const updated = await prisma.interview.update({
    where: { id },
    data: {
      status: "completed",
      score,
      feedback,
      completedAt: new Date(),
      durationSec,
    },
  })

  await notify({
    userId,
    type: "interview",
    title: "Mock interview evaluated",
    message: `Your ${interview.track} session scored ${score}/100.`,
    link: "/interviews",
    dedupeKey: `interview-done:${id}`,
  })
  await logActivity({
    userId,
    action: "interview_completed",
    entityType: "interview",
    entityId: id,
    details: `${interview.track}: ${score}/100`,
  })
  void recordSnapshotSafe(userId)

  return json(updated)
})
