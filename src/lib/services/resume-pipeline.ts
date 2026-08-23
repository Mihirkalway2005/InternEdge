import { prisma } from "@/lib/db"
import { storage } from "@/lib/storage"
import { analyzeResume, heuristicParse, parseResume } from "@/lib/ai/services"
import { notify, logActivity } from "./notifier"
import type { StructuredResume } from "@/lib/ai/schemas"

const MAX_SIZE = 5 * 1024 * 1024

export class ResumePipelineError extends Error {}

/** Validate + persist an uploaded PDF, extract text, structure, analyze. */
export async function processResumeUpload(input: {
  userId: string
  file: File
}): Promise<{ resumeId: string }> {
  const { file } = input

  if (file.size > MAX_SIZE) {
    throw new ResumePipelineError("File exceeds the 5 MB limit")
  }
  if (file.size < 500) {
    throw new ResumePipelineError("File appears to be empty or corrupt")
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Magic-byte sniff — never trust the client-provided MIME type.
  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    throw new ResumePipelineError("Only valid PDF files are supported")
  }
  const safeName = (file.name || "resume.pdf")
    .replace(/[^\w.\- ]/g, "")
    .slice(0, 120)

  // 1. Create DB row first so we have a stable id for the storage key.
  const existingCount = await prisma.resume.count({
    where: { userId: input.userId },
  })
  const resume = await prisma.resume.create({
    data: {
      userId: input.userId,
      fileName: safeName,
      mimeType: "application/pdf",
      sizeBytes: file.size,
      status: "uploaded",
      version: existingCount + 1,
      isPrimary: existingCount === 0,
    },
  })

  const storageKey = `${input.userId}/${resume.id}.pdf`

  try {
    await storage.putObject(storageKey, buffer, "application/pdf")
  } catch (err) {
    await prisma.resume.update({
      where: { id: resume.id },
      data: { status: "failed", statusMessage: "Failed to store file" },
    })
    throw new ResumePipelineError("Failed to store uploaded file")
  }

  await prisma.resume.update({
    where: { id: resume.id },
    data: { fileId: storageKey, storageKey },
  })
  await logActivity({
    userId: input.userId,
    action: "resume_uploaded",
    entityType: "resume",
    entityId: resume.id,
    details: safeName,
  })

  // 2. Extract text.
  let text: string
  try {
    const { PDFParse } = await import("pdf-parse")
    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    try {
      const result = await parser.getText()
      text = (result.text ?? "").replace(/\u0000/g, "").trim()
    } finally {
      await parser.destroy()
    }
  } catch (err) {
    console.error("[resume] extraction failed:", err)
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        status: "failed",
        statusMessage:
          "Could not extract text. The PDF may be a scan without embedded text.",
      },
    })
    return { resumeId: resume.id }
  }

  if (text.length < 80) {
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        status: "failed",
        statusMessage:
          "Very little text found — scanned/image-only resumes are not supported yet.",
      },
    })
    return { resumeId: resume.id }
  }

  // 3. Structure (AI-enriched with deterministic fallback).
  const aiStructured = await parseResume(text)
  const structured: StructuredResume = {
    name: null,
    email: null,
    phone: null,
    location: null,
    links: [],
    summary: null,
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
  }
  // AI parse wins; deterministic fallback fills any remaining gaps.
  Object.assign(structured, heuristicParse(text))
  if (aiStructured) {
    Object.assign(structured, {
      ...aiStructured,
      links: aiStructured.links?.length ? aiStructured.links : structured.links,
      skills: aiStructured.skills?.length
        ? aiStructured.skills
        : structured.skills,
    })
  }

  await prisma.resume.update({
    where: { id: resume.id },
    data: {
      parsedText: text.slice(0, 60_000),
      structured: structured as unknown as object,
      status: "parsed",
    },
  })

  // 4. Analyze.
  await runAnalysis(resume.id, input.userId, text, structured)
  return { resumeId: resume.id }
}

async function runAnalysis(
  resumeId: string,
  userId: string,
  text: string,
  structured: StructuredResume | unknown,
) {
  const profile = await prisma.profile.findUnique({ where: { userId } })
  const targetRole = profile?.targetRoles?.[0] ?? profile?.targetRole ?? null

  const analysis = await analyzeResume({
    text,
    structured,
    targetRole,
  })

  await prisma.resume.update({
    where: { id: resumeId },
    data: {
      status: "analyzed",
      atsScore: analysis.overallScore,
      keywords: analysis.matchedKeywords,
      missingKeywords: analysis.missingKeywords,
      analysis: analysis as unknown as object,
      statusMessage: null,
    },
  })

  await notify({
    userId,
    type: "resume",
    title: "Resume analysis complete",
    message: `Your resume scored ${analysis.overallScore}/100 on ATS readiness.`,
    link: "/resume",
    dedupeKey: `resume-analyzed:${resumeId}`,
  })
  await logActivity({
    userId,
    action: "analysis_completed",
    entityType: "resume",
    entityId: resumeId,
    details: `ATS score ${analysis.overallScore}`,
  })
}

export async function reanalyzeResume(userId: string, resumeId: string) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  })
  if (!resume?.parsedText)
    throw new ResumePipelineError("No parsed text available for this resume")

  const structured =
    resume.structured as StructuredResume | null ??
    heuristicParse(resume.parsedText)
  await runAnalysis(resume.id, userId, resume.parsedText, structured)
}
