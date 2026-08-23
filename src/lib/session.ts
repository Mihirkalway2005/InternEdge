import { headers } from "next/headers"
import { auth } from "./auth"

export type AuthSession = {
  userId: string
  userEmail: string
  userName: string
  userRole: string
}

/**
 * Single source of truth for the authenticated user.
 * Returns null when there is no valid session — callers must fail closed.
 * Never fall back to a demo/shared user; that would leak data across accounts.
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const result = await auth.api.getSession({ headers: await headers() })
    if (!result?.user?.id) return null
    return {
      userId: result.user.id,
      userEmail: result.user.email ?? "",
      userName: result.user.name ?? "",
      userRole: (result.user as { role?: string }).role ?? "student",
    }
  } catch {
    return null
  }
}
