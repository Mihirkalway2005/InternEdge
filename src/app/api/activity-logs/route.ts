import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

export async function GET(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get("limit") ?? 0)
  try {
    const logs = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      ...(limit > 0 ? { take: limit } : {}),
    })
    return NextResponse.json(logs)
  } catch {
    return NextResponse.json({ error: "Failed to list activity" }, {
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
    const log = await prisma.activityLog.create({ data: { ...body, userId } })
    return NextResponse.json(log, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to log activity" }, {
      status: 500,
    })
  }
}
