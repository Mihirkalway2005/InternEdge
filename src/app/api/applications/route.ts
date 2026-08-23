import { z } from "zod"
import { prisma } from "@/lib/db"
import {
  ApiError,
  handleRoute,
  json,
  parseBody,
  requireUser,
} from "@/lib/api-helpers"
import { logActivity, notify } from "@/lib/services/notifier"

const createSchema = z.object({
  internshipId: z.string().min(1).max(64),
  status: z
    .enum([
      "saved",
      "applied",
      "assessment",
      "interview",
      "hr",
      "offer",
      "rejected",
    ])
    .default("saved"),
  notes: z.string().max(4000).optional(),
})

export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      internship: { include: { company: true } },
      events: { orderBy: { createdAt: "asc" }, take: 20 },
    },
    orderBy: { updatedAt: "desc" },
  })
  return json(applications)
})

export const POST = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()
  const body = await parseBody(req, createSchema)

  const internship = await prisma.internship.findUnique({
    where: { id: body.internshipId },
  })
  if (!internship || !internship.isActive) {
    throw new ApiError(404, "Internship not found")
  }

  const existing = await prisma.application.findUnique({
    where: { userId_internshipId: { userId, internshipId: body.internshipId } },
  })
  if (existing) {
    throw new ApiError(409, "You already have this internship in your tracker")
  }

  const application = await prisma.application.create({
    data: {
      userId,
      internshipId: body.internshipId,
      status: body.status,
      notes: body.notes ?? null,
      appliedAt: body.status === "saved" ? new Date() : undefined,
      events: {
        create: {
          fromStatus: null,
          toStatus: body.status,
          note:
            body.status === "saved"
              ? "Added to tracker"
              : "Application created",
        },
      },
    },
    include: { internship: { include: { company: true } }, events: true },
  })

  await logActivity({
    userId,
    action:
      body.status === "saved" ? "internship_saved" : "application_created",
    entityType: "application",
    entityId: application.id,
    details:
      `${internship.title} at ${internship.title ? "" : ""}`.trim() ||
      internship.companyId,
  })
  void (async () => {
    const company = await prisma.internship.findUnique({
      where: { id: body.internshipId },
      select: { title: true, company: { select: { name: true } } },
    })
    if (company && body.status !== "saved") {
      await notify({
        userId,
        type: "application",
        title: `Application created: ${company.company.name}`,
        message: `"${company.title}" is now in your tracker at "${body.status}" stage.`,
        link: "/applications",
        dedupeKey: `app-created:${application.id}`,
      })
    }
  })()

  return json(application, 201)
})
