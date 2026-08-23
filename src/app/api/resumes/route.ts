import { prisma } from "@/lib/db"
import { ApiError, handleRoute, json, requireUser } from "@/lib/api-helpers"
import { processResumeUpload } from "@/lib/services/resume-pipeline"
import { checkRateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const maxDuration = 60

export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: [{ createdAt: "desc" }, { isPrimary: "desc" }],
    // Never ship full parsed text to list views.
    select: {
      id: true,
      fileName: true,
      atsScore: true,
      keywords: true,
      missingKeywords: true,
      status: true,
      statusMessage: true,
      version: true,
      isPrimary: true,
      sizeBytes: true,
      analysis: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  return json(resumes)
})

export const POST = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()

  if (!checkRateLimit(`resume-upload:${userId}`, 5, 60 * 60 * 1000)) {
    throw new ApiError(
      429,
      "Upload limit reached (5 per hour). Try again later.",
    )
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    throw new ApiError(400, "Expected multipart form data with a 'file' field")
  }
  const file = form.get("file")
  if (!(file instanceof File)) throw new ApiError(400, "Missing resume file")

  const { resumeId } = await processResumeUpload({ userId, file })

  const resume = await prisma.resume.findUnique({
    where: { id: resumeId },
    select: {
      id: true,
      fileName: true,
      status: true,
      statusMessage: true,
      atsScore: true,
      analysis: true,
      structured: false as never,
    },
  })
  return json(resume, 201)
})
