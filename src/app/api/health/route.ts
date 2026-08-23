import { prisma } from "@/lib/db"
import { handleRoute, json } from "@/lib/api-helpers"

export const GET = handleRoute(async () => {
  await prisma.$queryRaw`SELECT 1`
  return json({ ok: true, service: "internedge", time: new Date().toISOString() })
})
