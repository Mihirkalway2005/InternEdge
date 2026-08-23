import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const interviews = await prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(interviews)
  } catch {
    return NextResponse.json({ error: "Failed to list interviews" }, {
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
    const interview = await prisma.interview.create({
      data: { ...body, userId },
    })
    return NextResponse.json(interview, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create interview" }, {
      status: 500,
    })
  }
}
