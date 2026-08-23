import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const experiences = await prisma.experience.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(experiences)
  } catch {
    return NextResponse.json({ error: "Failed to list experiences" }, {
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
    const experience = await prisma.experience.create({
      data: { ...body, userId },
    })
    return NextResponse.json(experience, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create experience" }, {
      status: 500,
    })
  }
}
