"use client" /* Background ambient lighting */
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { InternEdgeLogo } from "@/components/brand/InternEdgeLogo"
import {
  ArrowRight,
  Lock,
  Mail,
  Globe,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("alex.rivera@stanford.edu")
  const [password, setPassword] = useState("password123")
  const [validationError, setValidationError] = useState<string | null>(null)
  const { signInEmail, signInSocial, isLoading, error, clearError } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      setValidationError("Please enter a valid university email address.")
      return false
    }
    if (!password || password.length < 6) {
      setValidationError("Password must be at least 6 characters long.")
      return false
    }
    setValidationError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validateForm()) return

    const success = await signInEmail(email, password)
    if (success) {
      router.push("/dashboard")
    }
  }

  const handleSocialSignIn = async (provider: "google" | "github") => {
    clearError()
    await signInSocial(provider)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md material-glass p-8 rounded-3xl relative z-10 border border-white/10 shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <InternEdgeLogo iconSize={36} variant="liquid-glass" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-400">
            Sign in to access your AI Career Readiness Dashboard
          </p>
        </div>

        {(validationError || error) && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{validationError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              University Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (validationError) setValidationError(null)
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-400/50 transition"
                placeholder="student@university.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (validationError) setValidationError(null)
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-sky-400/50 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-semibold text-sm text-white hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                Sign In to Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center text-xs text-zinc-500">
          <span className="bg-[#0A0A0A] px-3 relative z-10 uppercase tracking-wider">
            Or continue with
          </span>
          <div className="absolute inset-0 top-1/2 border-t border-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium flex items-center justify-center gap-2 transition text-white"
          >
            <Globe className="w-4 h-4 text-sky-400" /> GitHub
          </button>
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium flex items-center justify-center gap-2 transition text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
              />
            </svg>
            Google
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-sky-400 font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
