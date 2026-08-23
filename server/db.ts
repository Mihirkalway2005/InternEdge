import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./generated/prisma/client.ts"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const createPrismaClient = () =>
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"],
  })

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
