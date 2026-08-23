import { z } from "zod"
import { prisma } from "@/lib/db"
import { handleRoute, json, parseBody, requireUser } from "@/lib/api-helpers"

const createSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(4000),
  techStack: z.array(z.string().max(40)).max(20).default([]),
  github: z.string().url().max(300).nullish(),
  liveDemo: z.string().url().max(300).nullish(),
  startDate: z.string().max(40),
  endDate: z.string().max(40).nullish(),
})

export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
  return json(projects)
})

export const POST = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()
  const body = await parseBody(req, createSchema)
  const project = await prisma.project.create({
    data: { ...body, github: body.github ?? null, liveDemo: body.liveDemo ?? null, userId },
  })
  return json(project, 201)
})
