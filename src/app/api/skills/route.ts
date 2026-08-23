import { z } from "zod"
import { prisma } from "@/lib/db"
import { handleRoute, json, parseBody, requireUser } from "@/lib/api-helpers"

const createSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(60)
    .transform((s) => s.trim()),
  category: z.enum([
    "frontend",
    "backend",
    "database",
    "devops",
    "ai_ml",
    "soft_skill",
    "other",
  ]),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
})

export const GET = handleRoute(async () => {
  const { userId } = await requireUser()
  const skills = await prisma.skill.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  })
  return json(skills)
})

export const POST = handleRoute(async (req: Request) => {
  const { userId } = await requireUser()
  const body = await parseBody(req, createSchema)

  const skill = await prisma.skill.upsert({
    where: { userId_name: { userId, name: body.name } },
    create: { ...body, userId },
    update: {
      level: body.level,
      category: body.category,
      updatedAt: new Date(),
    },
  })
  return json(skill, 201)
})
