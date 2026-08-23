import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUserId } from "@/lib/session"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  try {
    const body = await req.json()
    const application = await prisma.application.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(application)
  } catch {
    return NextResponse.json({ error: "Failed to update application" }, {
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
    await prisma.application.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete application" }, {
      status: 500,
    })
  }
}
