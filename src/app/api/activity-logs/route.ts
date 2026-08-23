import { z } from "zod"
import { prisma } from "@/lib/db"
import { handleRoute, json, parseBody, requireUser } from "@/lib/api-helpers"

export const GET = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 20)
  const logs = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" },
    take: Math.min(Math.max(limit, 1), 50),
  })
  return json(logs)
})

/**
 * Explicit user-event logging. Internal service events are logged by the
 * services themselves; this endpoint accepts only a curated action list.
 */
const createSchema = z.object({
  action: z.enum([
    "profile_updated",
    "resume_viewed",
    "internship_searched",
    "portfolio_previewed",
  ]),
  entityType: z.string().max(60).optional(),
  entityId: z.string().max(64).optional(),
  details: z.string().max(300).optional(),
})

export const POST = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()
  const body = await parseBody(req, createSchema)
  const log = await prisma.activityLog.create({
    data: { userId, ...body },
  })
  return json(log, 201)
})
