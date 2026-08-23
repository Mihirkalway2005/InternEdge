import { loadEnvFile } from "node:process"
try { loadEnvFile() } catch {}
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client.js"
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
async function main() {
  const users = await p.user.count()
  console.log(JSON.stringify({ users, companies: await p.company.count(), internships: await p.internship.count(), resumes: await p.resume.count(), applications: await p.application.count() }))
  console.log((await p.user.findMany({ select: { email: true } })).map(u => u.email))
  await p.$disconnect()
}
main()
