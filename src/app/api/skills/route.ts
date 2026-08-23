import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const skills = await prisma.skill.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(skills)
  } catch {
    return NextResponse.json({ error: "Failed to list skills" }, {
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
    const skill = await prisma.skill.create({ data: { ...body, userId } })
    return NextResponse.json(skill, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create skill" }, {
      status: 500,
    })
  }
}
