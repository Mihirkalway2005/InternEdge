"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { InternEdgeLogo } from "@/components/brand/InternEdgeLogo"
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)
  const { signUpEmail, isLoading, error, clearError } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    if (!name || name.trim().length < 2) {
      setValidationError("Please enter your full name.")
      return false
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
      setValidationError("Please enter a valid university email address.")
      return false
    }
    if (!password || password.length < 8) {
      setValidationError("Password must be at least 8 characters long.")
      return false
    }
    setValidationError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validateForm()) return

    const success = await signUpEmail(email, password, name)
    if (success) {
      router.push("/onboarding")
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

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
            Create Student Account
          </h1>
          <p className="text-sm text-zinc-400">
            Accelerate your career with AI-powered readiness
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
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (validationError) setValidationError(null)
                }}
                placeholder="Alex Rivera"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition"
              />
            </div>
          </div>

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
                placeholder="alex@stanford.edu"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition"
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
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition"
              />
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">
              Must be at least 8 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-semibold text-sm text-black hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                Start Onboarding <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amber-400 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
