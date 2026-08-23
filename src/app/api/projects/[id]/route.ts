import { z } from "zod"
import { prisma } from "@/lib/db"
import {
  assertOwned,
  handleRoute,
  json,
  parseBody,
  requireUser,
} from "@/lib/api-helpers"

type Params = { params: Promise<{ id: string }> }

const updateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(4000).optional(),
  techStack: z.array(z.string().max(40)).max(20).optional(),
  github: z.string().url().max(300).nullish(),
  liveDemo: z.string().url().max(300).nullish(),
})

export const PATCH = handleRoute(async (req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const body = await parseBody(req, updateSchema)
  const existing = await prisma.project.findUnique({ where: { id } })
  assertOwned(existing, userId)
  const project = await prisma.project.update({ where: { id, userId }, data: body })
  return json(project)
})

export const DELETE = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const existing = await prisma.project.findUnique({ where: { id } })
  assertOwned(existing, userId)
  await prisma.project.delete({ where: { id, userId } })
  return json({ ok: true })
})
