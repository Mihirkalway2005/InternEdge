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

export const GET = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const roadmap = await prisma.roadmap.findUnique({
    where: { id },
    include: { tasks: { orderBy: [{ week: "asc" }, { priority: "asc" }] } },
  })
  assertOwned(roadmap, userId)
  return json(roadmap)
})

export const DELETE = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const existing = await prisma.roadmap.findUnique({
    where: { id },
    select: { userId: true },
  })
  assertOwned(existing, userId)
  await prisma.roadmap.delete({ where: { id, userId } })
  return json({ ok: true })
})
