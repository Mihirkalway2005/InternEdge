import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(companies)
  } catch {
    return NextResponse.json({ error: "Failed to list companies" }, {
      status: 500,
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const company = await prisma.company.create({ data: body })
    return NextResponse.json(company, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create company" }, {
      status: 500,
    })
  }
}
