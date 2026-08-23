import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const profile = await prisma.profile.findUnique({ where: { userId } })
    return NextResponse.json(profile ?? {})
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, {
      status: 500,
    })
  }
}

export async function PUT(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const profile = await prisma.profile.upsert({
      where: { userId },
      create: { userId, ...body },
      update: body,
    })
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ error: "Failed to save profile" }, {
      status: 500,
    })
  }
}
