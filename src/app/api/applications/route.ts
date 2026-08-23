import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        internship: { include: { company: true } },
      },
      orderBy: { appliedAt: "desc" },
    })
    return NextResponse.json(applications)
  } catch {
    return NextResponse.json({ error: "Failed to list applications" }, {
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
    const application = await prisma.application.create({
      data: { ...body, userId },
    })
    return NextResponse.json(application, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create application" }, {
      status: 500,
    })
  }
}
