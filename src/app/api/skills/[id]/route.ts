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

type Params = { params: Promise<{ id: string }> }

const updateSchema = z.object({
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
})

export const PATCH = handleRoute(async (req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const body = await parseBody(req, updateSchema)

  const existing = await prisma.skill.findUnique({ where: { id } })
  assertOwned(existing, userId)

  const skill = await prisma.skill.update({
    where: { id, userId },
    data: { level: body.level, updatedAt: new Date() },
  })
  return json(skill)
})

export const DELETE = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params

  const existing = await prisma.skill.findUnique({ where: { id } })
  assertOwned(existing, userId)

  await prisma.skill.delete({ where: { id, userId } })
  return json({ ok: true })
})
