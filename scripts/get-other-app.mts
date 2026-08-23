import { loadEnvFile } from "node:process"
try { loadEnvFile() } catch {}
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client.js"
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
const a = await p.application.findFirst({ where: { NOT: { user: { email: "smoke.tester@internedge.dev" } } }, select: { id: true, userId: true } })
console.log(a?.id ?? "")
await p.$disconnect()
