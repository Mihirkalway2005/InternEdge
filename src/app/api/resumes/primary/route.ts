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

export const PATCH = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params

  const existing = await prisma.resume.findUnique({
    where: { id },
    select: { userId: true },
  })
  assertOwned(existing, userId)

  // Atomically make this the only primary resume for the user.
  await prisma.$transaction([
    prisma.resume.updateMany({ where: { userId, isPrimary: true }, data: { isPrimary: false } }),
    prisma.resume.update({ where: { id, userId }, data: { isPrimary: true } }),
  ])

  return json({ ok: true })
})
