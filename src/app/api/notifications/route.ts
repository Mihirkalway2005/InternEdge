import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(notifications)
  } catch {
    return NextResponse.json({ error: "Failed to list notifications" }, {
      status: 500,
    })
  }
}

export async function PATCH(req: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { id, read } = body
    if (!id) {
      await prisma.notification.updateMany({
        where: { userId },
        data: { read: true },
      })
      return NextResponse.json({ ok: true })
    }
    const notification = await prisma.notification.update({
      where: { id },
      data: { read },
    })
    return NextResponse.json(notification)
  } catch {
    return NextResponse.json({ error: "Failed to update notifications" }, {
      status: 500,
    })
  }
}
