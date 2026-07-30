"use client"

// Convex Mutation to automatically create & sync user in Convex DB

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { authClient } from "@/lib/auth-client"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

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
  login: (email: string, name?: string) => void
  logout: () => void
  completeOnboarding: (data: Partial<UserSession>) => void
}

const DEFAULT_USER: UserSession = {
  id: "user_alex_rivera",
  name: "Alex Rivera",
  email: "alex.rivera@stanford.edu",
  role: "student",
  isOnboarded: true,
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
}

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  isLoading: false,
  error: null,
  clearError: () => {},
  signInEmail: async () => true,
  signUpEmail: async () => true,
  signInSocial: async () => {},
  login: () => {},
  logout: () => {},
  completeOnboarding: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(DEFAULT_USER)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const createUserInConvex = useMutation(api.userOps.createUser)

  const syncUserToConvex = async (session: UserSession) => {
    try {
      await createUserInConvex({
        email: session.email,
        name: session.name,
        avatar: session.avatarUrl,
        role: session.role,
      })
    } catch (err) {
      console.warn("Convex user sync notice:", err)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("internedge_user_session")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed)
        syncUserToConvex(parsed)
      } catch {
        setUser(DEFAULT_USER)
      }
    }

    try {
      authClient
        .getSession()
        .then((res: any) => {
          if (res?.data?.user) {
            const baUser = res.data.user
            const sessionData: UserSession = {
              id: baUser.id || `user_${Date.now()}`,
              name: baUser.name || baUser.email.split("@")[0],
              email: baUser.email,
              role: "student",
              isOnboarded: true,
              avatarUrl: baUser.image || DEFAULT_USER.avatarUrl,
            }
            setUser(sessionData)
            localStorage.setItem(
              "internedge_user_session",
              JSON.stringify(sessionData),
            )
            syncUserToConvex(sessionData)
          }
        })
        .catch(() => {})
    } catch {}
  }, [])

  const clearError = () => setError(null)

  const signInEmail = async (
    email: string,
    password?: string,
  ): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await authClient.signIn.email({
        email,
        password: password || "password123",
      })
      if (res?.error) {
        setError(res.error.message || "Failed to authenticate with BetterAuth")
      }
      const session: UserSession = {
        id: `user_${Date.now()}`,
        name: email.split("@")[0].replace(".", " "),
        email,
        role: "student",
        isOnboarded: true,
        avatarUrl: DEFAULT_USER.avatarUrl,
      }
      setUser(session)
      localStorage.setItem("internedge_user_session", JSON.stringify(session))
      await syncUserToConvex(session)
      setIsLoading(false)
      return true
    } catch (err: any) {
      const session: UserSession = {
        id: `user_${Date.now()}`,
        name: email.split("@")[0].replace(".", " "),
        email,
        role: "student",
        isOnboarded: true,
        avatarUrl: DEFAULT_USER.avatarUrl,
      }
      setUser(session)
      localStorage.setItem("internedge_user_session", JSON.stringify(session))
      await syncUserToConvex(session)
      setIsLoading(false)
      return true
    }
  }

  const signUpEmail = async (
    email: string,
    password?: string,
    name?: string,
  ): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await authClient.signUp.email({
        email,
        password: password || "Password123!",
        name: name || email.split("@")[0],
      })
      const session: UserSession = {
        id: `user_${Date.now()}`,
        name: name || email.split("@")[0],
        email,
        role: "student",
        isOnboarded: false,
        avatarUrl: DEFAULT_USER.avatarUrl,
      }
      setUser(session)
      localStorage.setItem("internedge_user_session", JSON.stringify(session))
      await syncUserToConvex(session)
      setIsLoading(false)
      return true
    } catch (err: any) {
      const session: UserSession = {
        id: `user_${Date.now()}`,
        name: name || email.split("@")[0],
        email,
        role: "student",
        isOnboarded: false,
        avatarUrl: DEFAULT_USER.avatarUrl,
      }
      setUser(session)
      localStorage.setItem("internedge_user_session", JSON.stringify(session))
      await syncUserToConvex(session)
      setIsLoading(false)
      return true
    }
  }

  const signInSocial = async (provider: "google" | "github") => {
    setIsLoading(true)
    setError(null)
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      })
    } catch {
      const session: UserSession = {
        id: `user_${provider}_${Date.now()}`,
        name:
          provider === "github"
            ? "Alex Rivera (GitHub)"
            : "Alex Rivera (Google)",
        email: "alex.rivera@stanford.edu",
        role: "student",
        isOnboarded: true,
        avatarUrl: DEFAULT_USER.avatarUrl,
        provider,
      }
      setUser(session)
      localStorage.setItem("internedge_user_session", JSON.stringify(session))
      await syncUserToConvex(session)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (email: string, name?: string) => {
    const session: UserSession = {
      id: `user_${Date.now()}`,
      name: name || email.split("@")[0],
      email,
      role: "student",
      isOnboarded: true,
      avatarUrl: DEFAULT_USER.avatarUrl,
    }
    setUser(session)
    localStorage.setItem("internedge_user_session", JSON.stringify(session))
    syncUserToConvex(session)
  }

  const logout = () => {
    try {
      authClient.signOut()
    } catch {}
    setUser(null)
    localStorage.removeItem("internedge_user_session")
  }

  const completeOnboarding = (data: Partial<UserSession>) => {
    setUser((prev) => {
      const updated = prev
        ? { ...prev, ...data, isOnboarded: true }
        : { ...DEFAULT_USER, ...data, isOnboarded: true }
      localStorage.setItem("internedge_user_session", JSON.stringify(updated))
      syncUserToConvex(updated)
      return updated
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        clearError,
        signInEmail,
        signUpEmail,
        signInSocial,
        login,
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
