import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: "Failed to list projects" }, {
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
    const project = await prisma.project.create({ data: { ...body, userId } })
    return NextResponse.json(project, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, {
      status: 500,
    })
  }
}
