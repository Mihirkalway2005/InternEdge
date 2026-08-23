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
import { logActivity } from "@/lib/services/notifier"

type Params = { params: Promise<{ id: string }> }

const updateSchema = z.object({
  completed: z.boolean().optional(),
  title: z.string().min(1).max(160).optional(),
  description: z.string().max(1000).nullish(),
  dueDate: z.coerce.date().nullish(),
  priority: z.number().int().min(1).max(3).optional(),
})

export const PATCH = handleRoute(async (req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const body = await parseBody(req, updateSchema)

  // Ownership check through the parent roadmap BEFORE any mutation.
  const task = await prisma.roadmapTask.findUnique({
    where: { id },
    include: { roadmap: { select: { userId: true } } },
  })
  if (!task || task.roadmap.userId !== userId) {
    throw new ApiError(404, "Resource not found")
  }

  const updated = await prisma.roadmapTask.update({
    where: { id },
    data: {
      ...(body.completed !== undefined
        ? {
            completed: body.completed,
            completedAt: body.completed ? new Date() : null,
          }
        : {}),
      ...(body.title != null ? { title: body.title } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.dueDate !== undefined ? { dueDate: body.dueDate } : {}),
      ...(body.priority != null ? { priority: body.priority } : {}),
    },
  })

  // Recompute roadmap progress transactionally.
  if (body.completed !== undefined) {
    await prisma.$transaction(async (tx) => {
      const [total, done] = await Promise.all([
        tx.roadmapTask.count({ where: { roadmapId: task.roadmapId } }),
        tx.roadmapTask.count({
          where: { roadmapId: task.roadmapId, completed: true },
        }),
      ])
      const progress = total === 0 ? 0 : Math.round((done / total) * 100)
      await tx.roadmap.update({
        where: { id: task.roadmapId },
        data: { overallProgress: progress },
      })
      return progress
    })
    if (body.completed) {
      await logActivity({
        userId,
        action: "task_completed",
        entityType: "roadmap_task",
        entityId: id,
        details: updated.title,
      })
    }
  }

  return json(updated)
})

export const DELETE = handleRoute(async (_req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const task = await prisma.roadmapTask.findUnique({
    where: { id },
    include: { roadmap: { select: { userId: true } } },
  })
  if (!task || task.roadmap.userId !== userId) {
    throw new ApiError(404, "Resource not found")
  }

  await prisma.roadmapTask.delete({ where: { id } })
  return json({ ok: true })
})
