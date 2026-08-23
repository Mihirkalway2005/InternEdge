import { z } from "zod"
import { prisma } from "@/lib/db"
import {
  ApiError,
  assertOwned,
  handleRoute,
  json,
  parseBody,
  requireUser,
} from "@/lib/api-helpers"
import { evaluateAnswer } from "@/lib/ai/services"

type Params = { params: Promise<{ id: string }> }

const answerSchema = z.object({ answer: z.string().max(8000) })

type TranscriptItem = {
  question: string
  rubricKeywords: string[]
  answer: string
  score: number | null
  strengths: string[]
  improvements: string[]
  keywordCoverage: string[]
  followUpAsked?: boolean
}

/**
 * Submit an answer for the current question.
 * Stateful flow: evaluate → store result in the transcript → advance index
 * (or inject a follow-up question when the evaluator produces one).
 */
export const POST = handleRoute(async (req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const { answer } = await parseBody(req, answerSchema)

  const interview = await prisma.interview.findUnique({ where: { id } })
  assertOwned(interview, userId)
  if (interview.status !== "in_progress") {
    throw new ApiError(409, "This interview session is already finished")
  }

  const transcript = (interview.questions as unknown as { items: TranscriptItem[] }).items
  const idx = Math.min(interview.currentQuestionIndex, transcript.length - 1)
  if (transcript[idx].answer && !transcript[idx].followUpAsked) {
    throw new ApiError(409, "This question was already answered")
  }

  const evaluation = await evaluateAnswer({
    question: transcript[idx].question,
    rubricKeywords: transcript[idx].rubricKeywords,
    answer,
  })

  // Store evaluation on this slot; append a follow-up as a new slot when present.
  transcript[idx] = {
    ...transcript[idx],
    answer,
    score: evaluation.score,
    strengths: evaluation.strengths,
    improvements: evaluation.improvements,
    keywordCoverage: evaluation.keywordCoverage,
    followUpAsked: Boolean(evaluation.followUpQuestion),
  }

  let nextIndex = idx + 1
  if (evaluation.followUpQuestion && nextIndex < transcript.length + 3) {
    // Follow-up replaces remaining queue position — insert after current.
    transcript.splice(nextIndex, 0, {
      question: evaluation.followUpQuestion,
      rubricKeywords: [],
      answer: "",
      score: null,
      strengths: [],
      improvements: [],
      keywordCoverage: [],
      followUpAsked: false,
    })
    nextIndex = nextIndex // stays at the follow-up
  } else if (evaluation.followUpQuestion) {
    transcript.push({
      question: evaluation.followUpQuestion,
      rubricKeywords: [],
      answer: "",
      score: null,
      strengths: [],
      improvements: [],
      keywordCoverage: [],
      followUpAsked: false,
    })
  }

  await prisma.interview.update({
    where: { id },
    data: {
      questions: { items: transcript } as unknown as object,
      currentQuestionIndex: Math.min(nextIndex, transcript.length),
    },
  })

  return json({
    evaluation,
    nextIndex: Math.min(nextIndex, transcript.length),
    totalQuestions: transcript.length,
    isLast: Math.min(nextIndex, transcript.length) >= transcript.length,
  })
})
