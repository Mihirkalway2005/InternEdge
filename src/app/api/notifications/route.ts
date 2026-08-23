import { z } from "zod"
import { prisma } from "@/lib/db"
import {
  assertOwned,
  handleRoute,
  json,
  parseBody,
  requireUser,
} from "@/lib/api-helpers"
import { sweepDeadlines } from "@/lib/services/notifier"

export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  void sweepDeadlines(userId).catch(() => {})
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
  const unread = notifications.filter((n) => !n.read).length
  return json({ items: notifications, unread })
})

const patchSchema = z.object({
  id: z.string().max(64).optional(),
  readAll: z.boolean().optional(),
})

export const PATCH = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()
  const body = await parseBody(req, patchSchema)

  if (body.readAll || !body.id) {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
    return json({ ok: true })
  }

  const existing = await prisma.notification.findUnique({
    where: { id: body.id },
    select: { userId: true },
  })
  assertOwned(existing, userId)

  // Ownership enforced in the update predicate itself.
  const notification = await prisma.notification.update({
    where: { id: body.id },
    data: { read: true },
  })
  return json(notification)
})
