import { prisma } from "@/lib/db"
import { handleRoute, json } from "@/lib/api-helpers"

/** Public reference data for internship listings. */
export const GET = handleRoute(async () => {
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      website: true,
      industry: true,
      size: true,
      description: true,
    },
  })
  return json(companies)
})
