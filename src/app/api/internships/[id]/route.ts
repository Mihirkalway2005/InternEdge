import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const internship = await prisma.internship.findUnique({
      where: { id },
      include: { company: true },
    })
    if (!internship) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    return NextResponse.json(internship)
  } catch {
    return NextResponse.json({ error: "Failed to fetch internship" }, {
      status: 500,
    })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()
    const internship = await prisma.internship.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(internship)
  } catch {
    return NextResponse.json({ error: "Failed to update internship" }, {
      status: 500,
    })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    await prisma.internship.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete internship" }, {
      status: 500,
    })
  }
}
