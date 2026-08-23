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
import { improveResume, isAIEnabled } from "@/lib/ai/services"
import { checkRateLimit } from "@/lib/rate-limit"

type Params = { params: Promise<{ id: string }> }

const bodySchema = z.object({
  targetRole: z.string().max(120).optional(),
  jdText: z.string().max(12_000).optional(),
})

export const runtime = "nodejs"
export const maxDuration = 60

/**
 * Returns constrained improvement suggestions — never mutates the stored
 * resume. Suggestions distinguish existing text rewrites (with rationale)
 * from recommended additions the user must explicitly accept.
 */
export const POST = handleRoute(async (req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const body = await parseBody(req, bodySchema)

  if (!checkRateLimit(`resume-improve:${userId}`, 8, 60 * 60 * 1000)) {
    throw new ApiError(429, "Improvement limit reached (8 per hour)")
  }
  if (!isAIEnabled()) {
    throw new ApiError(
      503,
      "AI provider not configured. Set GROQ_API_KEY to enable AI suggestions.",
    )
  }

  const resume = await prisma.resume.findUnique({
    where: { id },
    select: {
      userId: true,
      parsedText: true,
      structured: true,
      analysis: true,
    },
  })
  assertOwned(resume, userId)

  if (!resume.parsedText) {
    throw new ApiError(400, "Upload and parse a resume first")
  }

  const analysis = resume.analysis as { missingKeywords?: string[] } | null

  try {
    const improvements = await improveResume({
      text: resume.parsedText,
      structured: resume.structured,
      targetRole: body.targetRole ?? null,
      jdText: body.jdText ?? null,
      weaknesses: analysis?.missingKeywords?.slice(0, 10),
    })

    // Persist alongside the analysis for reproducibility.
    await prisma.resume.update({
      where: { id },
      data: {
        analysis: {
          ...(resume.analysis as object | null ?? {}),
          improvements,
          improvedAt: new Date().toISOString(),
        } as object,
      },
    })

    return json(improvements)
  } catch (err) {
    if (err instanceof Error && err.message.includes("AI")) {
      throw new ApiError(502, "AI service unavailable, please retry shortly")
    }
    throw err
  }
})
