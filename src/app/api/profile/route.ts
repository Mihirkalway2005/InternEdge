import { z } from "zod"
import { prisma } from "@/lib/db"
import {
  handleRoute,
  json,
  parseBody,
  requireUser,
} from "@/lib/api-helpers"

const workTypeSchema = z.enum(["remote", "hybrid", "onsite"])

const profileUpdateSchema = z.object({
  headline: z.string().max(140).nullish(),
  university: z.string().max(160).nullish(),
  education: z.string().max(240).nullish(),
  degree: z.string().max(120).nullish(),
  branch: z.string().max(120).nullish(),
  graduationYear: z.number().int().min(1980).max(2100).nullish(),
  bio: z.string().max(2000).nullish(),
  github: z.string().url().max(300).nullish().or(z.literal("")),
  linkedin: z.string().url().max(300).nullish().or(z.literal("")),
  portfolio: z.string().url().max(300).nullish().or(z.literal("")),
  careerGoal: z.string().max(1000).nullish(),
  targetRole: z.string().max(120).nullish(),
  targetRoles: z.array(z.string().max(80)).max(5).default([]),
  preferredLocations: z.array(z.string().max(80)).max(8).default([]),
  preferredWorkType: workTypeSchema.nullish(),
  completeOnboarding: z.boolean().optional(),
})

export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  const profile = await prisma.profile.findUnique({ where: { userId } })
  return json(profile ?? {})
})

export const PUT = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()
  const body = await parseBody(req, profileUpdateSchema)

  const { completeOnboarding, ...data } = body

  // Normalize empty-string URLs to null.
  for (const key of ["github", "linkedin", "portfolio"] as const) {
    if (data[key] === "") data[key] = null
  }

  const profile = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
      onboardedAt: completeOnboarding ? new Date() : undefined,
    },
    update: {
      ...data,
      ...(completeOnboarding ? { onboardedAt: new Date() } : {}),
    },
  })

  return json(profile)
})
