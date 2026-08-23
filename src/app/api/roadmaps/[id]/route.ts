import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  try {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id },
      include: { tasks: { orderBy: { createdAt: "asc" } } },
    })
    if (!roadmap) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(roadmap)
  } catch {
    return NextResponse.json({ error: "Failed to fetch roadmap" }, {
      status: 500,
    })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  try {
    await prisma.roadmap.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete roadmap" }, {
      status: 500,
    })
  }
}
