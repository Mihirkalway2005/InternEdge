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

const createSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().max(1000).nullish(),
  category: z.string().max(60).nullish(),
  skillName: z.string().max(60).nullish(),
  dueDate: z.coerce.date().nullish(),
  priority: z.number().int().min(1).max(3).default(2),
})

export const POST = handleRoute(async (req: Request, { params }: Params) => {
  const { userId } = await requireUser()
  const { id } = await params
  const body = await parseBody(req, createSchema)

  // Ownership via the parent roadmap.
  const roadmap = await prisma.roadmap.findUnique({
    where: { id },
    select: { userId: true, isActive: true },
  })
  assertOwned(roadmap, userId)

  const task = await prisma.roadmapTask.create({
    data: {
      roadmapId: id,
      title: body.title,
      description: body.description ?? null,
      category: body.category ?? null,
      skillName: body.skillName ?? null,
      dueDate: body.dueDate ?? null,
      priority: body.priority,
    },
  })
  return json(task, 201)
})
