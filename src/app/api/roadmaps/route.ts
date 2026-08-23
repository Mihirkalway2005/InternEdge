import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId },
      include: { tasks: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(roadmaps)
  } catch {
    return NextResponse.json({ error: "Failed to list roadmaps" }, {
      status: 500,
    })
  }
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const roadmap = await prisma.roadmap.create({
      data: { ...body, userId },
      include: { tasks: true },
    })
    return NextResponse.json(roadmap, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create roadmap" }, {
      status: 500,
    })
  }
}
