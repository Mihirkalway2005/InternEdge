import { prisma } from "@/lib/db"
import {
  handleRoute,
  json,
  ApiError,
  requireAdmin,
  parseBody,
} from "@/lib/api-helpers"
import { z } from "zod"
import { getAuthSession } from "@/lib/session"
import { getUserMatchContext } from "@/lib/services/dashboard-service"

type Params = { params: Promise<{ id: string }> }

export const GET = handleRoute(async (_req: Request, { params }: Params) => {
  const { id } = await params
  const internship = await prisma.internship.findUnique({
    where: { id, isActive: true },
    include: { company: true },
  })
  if (!internship) throw new ApiError(404, "Internship not found")

  const session = await getAuthSession()
  if (!session) return json({ internship, match: null })

  const context = await getUserMatchContext(session.userId)
  const { scoreInternship } = await import("@/lib/engine/matching")
  const match = scoreInternship(context, internship)

  const application = await prisma.application.findUnique({
    where: {
      userId_internshipId: { userId: session.userId, internshipId: id },
    },
    select: { id: true, status: true },
  })

  return json({ internship, match, application })
})
