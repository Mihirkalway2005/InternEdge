import { z } from "zod"
import { prisma } from "@/lib/db"
import {
  assertOwned,
  handleRoute,
  json,
  parseBody,
  requireUser,
} from "@/lib/api-helpers"
import { logActivity, notify } from "@/lib/services/notifier"

type Params = { params: Promise<{ id: string }> }

const updateSchema = z.object({
  status: z
    .enum(["saved", "applied", "assessment", "interview", "hr", "offer", "rejected"])
    .optional(),
  notes: z.string().max(4000).nullish(),
})

export const GET = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const existing = await prisma.application.findUnique({
    where: { id },
    include: { internship: { include: { company: true } }, events: true },
  })
  assertOwned(existing, userId)
  return json(existing)
})

export const PATCH = handleRoute(async (req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const body = await parseBody(req, updateSchema)

  const existing = await prisma.application.findUnique({
    where: { id },
    include: { internship: { select: { title: true, company: { select: { name: true } } } } },
  })
  assertOwned(existing, userId)

  const statusChanged =
    body.status != null && body.status !== existing.status

  const application = await prisma.$transaction(async (tx) => {
    const updated = await tx.application.update({
      where: { id, userId },
      data: {
        ...(body.status != null ? { status: body.status } : {}),
        ...(body.notes !== undefined ? { notes: body.notes } : {}),
        ...(statusChanged ? { statusUpdatedAt: new Date() } : {}),
      },
      include: {
        internship: { include: { company: true } },
        events: { orderBy: { createdAt: "asc" } },
      },
    })

    if (statusChanged) {
      await tx.applicationEvent.create({
        data: {
          applicationId: id,
          fromStatus: existing.status,
          toStatus: body.status!,
          note: `Moved ${existing.status} → ${body.status}`,
        },
      })
    }
    return updated
  })

  if (statusChanged) {
    await logActivity({
      userId,
      action: "application_status_changed",
      entityType: "application",
      entityId: id,
      details: `${existing.internship.company.name}: ${existing.status} → ${body.status}`,
    })
    if (body.status === "offer") {
      await notify({
        userId,
        type: "application",
        title: `Offer! 🎉 ${existing.internship.company.name}`,
        message: `Congratulations — your application for "${existing.internship.title}" reached the offer stage.`,
        link: "/applications",
        dedupeKey: `app-offer:${id}`,
      })
    }
    if (body.status === "interview") {
      await notify({
        userId,
        type: "interview",
        title: `Interview stage at ${existing.internship.company.name}`,
        message: `"${existing.internship.title}" moved to interview. Run a mock session to prepare.`,
        link: "/interviews",
        dedupeKey: `app-interview:${id}:${body.status}`,
      })
    }
  }

  return json(application)
})

export const DELETE = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const existing = await prisma.application.findUnique({
    where: { id },
    select: { userId: true },
  })
  assertOwned(existing, userId)

  await prisma.application.delete({ where: { id, userId } })
  await logActivity({
    userId,
    action: "application_deleted",
    entityType: "application",
    entityId: id,
  })
  return json({ ok: true })
})
