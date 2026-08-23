"use client"

/**
 * Client-side session mirror. The server session (BetterAuth cookie) is the
 * only source of identity — this context exists purely for display and to
 * invoke auth actions. Authorization decisions are always made server-side.
 */

/** Shared profile-field list used by onboarding/profile forms. */

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { authClient, useSession } from "@/lib/auth-client"
import type { Profile } from "@/types"

export interface UserSession {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

interface AuthContextType {
  user: UserSession | null
  isLoading: boolean
  error: string | null
  clearError: () => void
  signInEmail: (email: string, password?: string) => Promise<boolean>
  signUpEmail: (
    email: string,
    password?: string,
    name?: string,
  ) => Promise<boolean>
  signInSocial: (provider: "google" | "github") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  clearError: () => {},
  signInEmail: async () => false,
  signUpEmail: async () => false,
  signInSocial: async () => {},
  logout: () => {},
})
export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const sessionUser = session.data?.user
  const user: UserSession | null = sessionUser
    ? {
        id: sessionUser.id,
        name:
          sessionUser.name ||
          (sessionUser.email ? sessionUser.email.split("@")[0] : "Student"),
        email: sessionUser.email ?? "",
        avatarUrl: sessionUser.image || undefined,
      }
    : null

  const clearError = useCallback(() => setError(null), [])

  const signInEmail = useCallback(
    async (email: string, password?: string): Promise<boolean> => {
      setError(null)
      if (!password || password.length < 8) {
        setError("Password must be at least 8 characters")
        return false
      }
      try {
        const res = await authClient.signIn.email({ email, password })
        if (res?.error) {
          setError(res.error.message || "Invalid email or password")
          return false
        }
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to sign in")
        return false
      }
    },
    [],
  )

  const signUpEmail = useCallback(
    async (
      email: string,
      password?: string,
      name?: string,
    ): Promise<boolean> => {
      setError(null)
      if (!password || password.length < 8) {
        setError("Password must be at least 8 characters")
        return false
      }
      try {
        const res = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
        })
        if (res?.error) {
          setError(res.error.message || "Failed to sign up")
          return false
        }
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to sign up")
        return false
      }
    },
    [],
  )

  const signInSocial = useCallback(async (provider: "google" | "github") => {
    setError(null)
    try {
      const res = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      })
      if (res?.error) {
        setError(
          res.error.message ||
            `${provider} sign-in is not configured on this deployment.`,
        )
        return
      }
      if (res?.data?.url) {
        window.location.href = res.data.url
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? `${provider} sign-in is not available: ${err.message}`
          : `${provider} sign-in is not configured`,
      )
    }
  }, [])

  const logout = useCallback(() => {
    authClient
      .signOut()
      .then(() => router.push("/login"))
      .catch(() => router.push("/login"))
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: session.isPending,
        error,
        clearError,
        signInEmail,
        signUpEmail,
        signInSocial,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
export const PROFILE_FIELDS_URLS = ["github", "linkedin", "portfolio"] as const
export type ProfileFormValues = Omit<Profile, "id">
