import { z } from "zod"
import { prisma } from "@/lib/db"
import { handleRoute, json, parseBody, requireUser } from "@/lib/api-helpers"

const createSchema = z.object({
  company: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  description: z.string().min(1).max(4000),
  startDate: z.string().max(40),
  endDate: z.string().max(40).nullish(),
})

export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  const experiences = await prisma.experience.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
  return json(experiences)
})

export const POST = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()
  const body = await parseBody(req, createSchema)
  const experience = await prisma.experience.create({
    data: { ...body, endDate: body.endDate ?? null, userId },
  })
  return json(experience, 201)
})
