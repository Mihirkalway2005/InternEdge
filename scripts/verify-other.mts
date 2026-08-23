import { loadEnvFile } from "node:process"
try { loadEnvFile() } catch {}
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client.js"
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
const a = await p.application.findUnique({ where: { id: "cmt5owaq300346lu4lxs9uabw" } })
console.log("other app status unchanged:", a?.status, "| notes:", a?.notes)
await p.$disconnect()
