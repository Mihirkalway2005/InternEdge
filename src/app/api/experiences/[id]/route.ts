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
  company: z.string().min(1).max(120).optional(),
  role: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(4000).optional(),
  startDate: z.string().max(40).optional(),
  endDate: z.string().max(40).nullish(),
})

export const PATCH = handleRoute(async (req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const body = await parseBody(req, updateSchema)
  const existing = await prisma.experience.findUnique({ where: { id } })
  assertOwned(existing, userId)
  const experience = await prisma.experience.update({ where: { id, userId }, data: body })
  return json(experience)
})

export const DELETE = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const existing = await prisma.experience.findUnique({ where: { id } })
  assertOwned(existing, userId)
  await prisma.experience.delete({ where: { id, userId } })
  return json({ ok: true })
})
