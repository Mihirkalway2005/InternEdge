import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const workType = searchParams.get("workType")
  const search = searchParams.get("search")

  try {
    const internships = await prisma.internship.findMany({
      where: {
        ...(workType ? { workType: workType as never } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" as const } },
                {
                  description: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  location: { contains: search, mode: "insensitive" as const },
                },
              ],
            }
          : {}),
      },
      include: { company: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(internships)
  } catch (err) {
    return NextResponse.json({ error: "Failed to list internships" }, {
      status: 500,
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const internship = await prisma.internship.create({ data: body })
    return NextResponse.json(internship, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to create internship" }, {
      status: 500,
    })
  }
}
