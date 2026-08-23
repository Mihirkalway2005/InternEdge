import { prisma } from "@/lib/db"
import { assertOwned, handleRoute, json, requireUser } from "@/lib/api-helpers"

type Params = { params: Promise<{ id: string }> }

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

export const GET = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const interview = await prisma.interview.findUnique({ where: { id } })
  assertOwned(interview, userId)
  return json(interview)
})

export const DELETE = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const existing = await prisma.interview.findUnique({
    where: { id },
    select: { userId: true },
  })
  assertOwned(existing, userId)
  await prisma.interview.delete({ where: { id, userId } })
  return json({ ok: true })
})
