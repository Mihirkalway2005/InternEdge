"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { authClient, useSession } from "@/lib/auth-client"

export interface UserSession {
  id: string
  name: string
  email: string
  role: "student" | "admin" | "mentor" | "placement_cell"
  isOnboarded: boolean
  avatarUrl?: string
  provider?: string
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
  completeOnboarding: (data: Partial<UserSession>) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  clearError: () => {},
  signInEmail: async () => true,
  signUpEmail: async () => true,
  signInSocial: async () => {},
  logout: () => {},
  completeOnboarding: () => {},
})

const PROFILE_FIELDS = [
  "headline",
  "university",
  "education",
  "degree",
  "branch",
  "graduationYear",
  "bio",
  "github",
  "linkedin",
  "portfolio",
  "careerGoal",
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession()
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const sessionUser = session.data?.user
  const user: UserSession | null = sessionUser
    ? {
        id: sessionUser.id,
        name:
          sessionUser.name ||
          (sessionUser.email ? sessionUser.email.split("@")[0] : "Student"),
        email: sessionUser.email,
        role: "student",
        isOnboarded,
        avatarUrl: sessionUser.image || undefined,
      }
    : null

  const clearError = () => setError(null)

  const signInEmail = async (
    email: string,
    password?: string,
  ): Promise<boolean> => {
    setError(null)
    try {
      const res = await authClient.signIn.email({
        email,
        password: password || "password123",
      })
      if (res?.error) {
        setError(res.error.message || "Failed to sign in")
        return false
      }
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
      return false
    }
  }

  const signUpEmail = async (
    email: string,
    password?: string,
    name?: string,
  ): Promise<boolean> => {
    setError(null)
    try {
      const res = await authClient.signUp.email({
        email,
        password: password || "Password123!",
        name: name || email.split("@")[0],
      })
      if (res?.error) {
        setError(res.error.message || "Failed to sign up")
        return false
      }
      setIsOnboarded(false)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up")
      return false
    }
  }

  const signInSocial = async (provider: "google" | "github") => {
    setError(null)
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
    }
  }

  const logout = () => {
    try {
      authClient.signOut()
    } catch {}
  }

  const completeOnboarding = (data: Partial<UserSession>) => {
    const profile: Record<string, unknown> = {}
    for (const field of PROFILE_FIELDS) {
      const value = (data as Record<string, unknown>)[field]
      if (value !== undefined) profile[field] = value
    }
    if (Object.keys(profile).length > 0) {
      fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      }).catch(() => {})
    }
    setIsOnboarded(true)
  }

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
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
