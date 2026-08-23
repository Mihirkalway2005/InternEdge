import { z } from "zod"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/db"
import {
  ApiError,
  handleRoute,
  json,
  parseBody,
  parseQuery,
  requireAdmin,
} from "@/lib/api-helpers"
import { getAuthSession } from "@/lib/session"
import { computeMatches, getUserMatchContext } from "@/lib/services/dashboard-service"

const querySchema = z.object({
  q: z.string().max(120).optional(),
  workType: z.enum(["remote", "hybrid", "onsite"]).optional(),
  location: z.string().max(80).optional(),
  skill: z.string().max(60).optional(),
  sort: z.enum(["match", "deadline", "recent"]).default("deadline"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(24),
})

/** Public catalog; per-item match scores added when a session exists. */
export const GET = handleRoute(async (req: Request) => {
  const query = parseQuery(req, querySchema)
  const session = await getAuthSession()

  const where = {
    isActive: true,
    ...(query.workType ? { workType: query.workType } : {}),
    ...(query.location
      ? { location: { contains: query.location, mode: "insensitive" as const } }
      : {}),
    ...(query.skill ? { requiredSkills: { has: query.skill } } : {}),
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q, mode: "insensitive" as const } },
            { description: { contains: query.q, mode: "insensitive" as const } },
            { company: { name: { contains: query.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  }

  if (!session) {
    const [total, items] = await Promise.all([
      prisma.internship.count({ where }),
      prisma.internship.findMany({
        where,
        include: { company: true },
        orderBy: { deadline: "asc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
    ])
    return json({ items: items.map((i) => ({ internship: i, match: null })), total, page: query.page })
  }

  // Authenticated + match sort: score the full active pool deterministically.
  if (query.sort === "match") {
    const allMatches = await computeMatches(session.userId, 200)
    const filtered = allMatches.filter((m) => {
      if (query.workType && m.internship.workType !== query.workType) return false
      if (query.location && !m.internship.location.toLowerCase().includes(query.location.toLowerCase())) return false
      if (query.skill && !m.internship.requiredSkills.some(s => s.toLowerCase() === query.skill!.toLowerCase())) return false
      if (query.q) {
        const hay = `${m.internship.title} ${m.internship.description} ${m.internship.company.name}`.toLowerCase()
        if (!hay.includes(query.q!.toLowerCase())) return false
      }
      return true
    })
    return json({
      total: filtered.length,
      page: query.page,
      items: filtered.slice((query.page - 1) * query.limit, query.page * query.limit),
    })
  }

  const [total, items] = await Promise.all([
    prisma.internship.count({ where }),
    prisma.internship.findMany({
      where,
      include: { company: true },
      orderBy:
        query.sort === "recent" ? { postedAt: "desc" } : { deadline: "asc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ])

  const context = await getUserMatchContext(session.userId)
  const { scoreInternship } = await import("@/lib/engine/matching")
  const scored = items.map((internship) => {
    const result = scoreInternship(context, internship)
    return { ...result, internship }
  })

  return json({ total, page: query.page, items: scored })
})

const createSchema = z.object({
  companyName: z.string().min(1).max(120),
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(8000),
  location: z.string().min(1).max(120),
  workType: z.enum(["remote", "hybrid", "onsite"]),
  salary: z.string().max(80).nullish(),
  stipendMin: z.number().int().min(0).max(1_000_000).nullish(),
  stipendMax: z.number().int().min(0).max(1_000_000).nullish(),
  deadline: z.coerce.date(),
  requiredSkills: z.array(z.string().max(40)).max(30).default([]),
  applicationUrl: z.string().url().max(500).nullish(),
})

/** Admin-only listing creation (future ingestion pipeline hooks in here). */
export const POST = handleRoute(async (req: Request) => {
  await requireAdmin()
  const body = await parseBody(req, createSchema)

  if (body.stipendMin != null && body.stipendMax != null && body.stipendMin > body.stipendMax) {
    throw new ApiError(400, "stipendMin must be ≤ stipendMax")
  }

  const company = await prisma.company.upsert({
    where: { name: body.companyName },
    create: {
      name: body.companyName,
      industry: "Technology",
      description: `${body.companyName} hiring via InternEdge.`,
    },
    update: {},
  })

  const internship = await prisma.internship.create({
    data: {
      companyId: company.id,
      title: body.title,
      description: body.description,
      location: body.location,
      workType: body.workType,
      salary: body.salary ?? null,
      stipendMin: body.stipendMin ?? null,
      stipendMax: body.stipendMax ?? null,
      deadline: body.deadline,
      requiredSkills: body.requiredSkills,
      applicationUrl: body.applicationUrl ?? null,
      source: "admin",
    },
    include: { company: true },
  })

  return json(internship, 201)
})
