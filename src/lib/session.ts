import { headers } from "next/headers"
import { auth } from "./auth"
import { prisma } from "./db"

const DEMO_USER_EMAIL = "alex.student@university.edu"

export async function getSession() {
  try {
    return await auth.api.getSession({ headers: await headers() })
  } catch {
    return null
  }
}

export async function getCurrentUserId() {
  const session = await getSession()
  if (session?.user?.id) return session.user.id
  const demo = await prisma.user.findFirst({
    where: { email: DEMO_USER_EMAIL },
  })
  return demo?.id ?? null
}
