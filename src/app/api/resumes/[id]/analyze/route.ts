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
import { reanalyzeResume } from "@/lib/services/resume-pipeline"
import { checkRateLimit } from "@/lib/rate-limit"

type Params = { params: Promise<{ id: string }> }

export const runtime = "nodejs"
export const maxDuration = 60

export const POST = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params

  if (!checkRateLimit(`resume-analyze:${userId}`, 10, 60 * 60 * 1000)) {
    throw new ApiError(429, "Analysis limit reached (10 per hour)")
  }

  const existing = await prisma.resume.findUnique({
    where: { id },
    select: { userId: true, status: true },
  })
  assertOwned(existing, userId)

  try {
    await reanalyzeResume(userId, id)
  } catch (err) {
    if (err instanceof Error && err.message.includes("No parsed text")) {
      throw new ApiError(400, err.message)
    }
    throw err
  }

  const resume = await prisma.resume.findUnique({
    where: { id },
    select: {
      id: true,
      atsScore: true,
      keywords: true,
      missingKeywords: true,
      analysis: true,
      status: true,
      statusMessage: true,
      updatedAt: true,
    },
  })
  return json(resume)
})
