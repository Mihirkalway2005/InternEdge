import { createAuthClient } from "better-auth/react"

/**
 * BetterAuth Client Configuration for InternEdge
 * Connects React frontend components to BetterAuth authentication service.
 */
export const authClient = createAuthClient({
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8443",
})

export const { useSession, signIn, signUp, signOut } = authClient
