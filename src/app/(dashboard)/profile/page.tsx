"use client" /* Header */ /* Personal Details */ /* Education */ /* Skills Vector */ /* Social Links */
import React, { useState } from "react"
import { useAuth } from "@/providers/AuthProvider"
import {
  User,
  GraduationCap,
  Globe,
  Save,
  CheckCircle2,
  Code2,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)

  const [name, setName] = useState(user?.name || "Alex Rivera")
  const [headline, setHeadline] = useState(
    "CS Junior | Full-Stack & AI Systems Enthusiast",
  )
  const [education, setEducation] = useState("Stanford University")
  const [degree, setDegree] = useState("B.S. Computer Science")
  const [gradYear, setGradYear] = useState("2026")
  const [github, setGithub] = useState("https://github.com/alexrivera")
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/alexrivera")
  const [portfolio, setPortfolio] = useState("https://alexrivera.dev")
  const [skills, setSkills] = useState(
    "TypeScript, React 19, Next.js 15, Python, PyTorch, PostgreSQL, Convex DB, CUDA",
  )

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Unified Student Profile <User className="w-6 h-6 text-sky-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Every feature reads from and contributes to your single Unified
            Career Profile
          </p>
        </div>

        {saved && (
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Profile Saved!
          </span>
        )}
      </div>

      <form
        onSubmit={handleSave}
        className="material-glass p-8 rounded-3xl border border-white/10 space-y-6"
      >
        {}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-sky-400" /> Personal Identity
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>
        </div>

        {}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-400" /> Education &
            Degree
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                University
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Degree & Major
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Graduation Year
              </label>
              <input
                type="text"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" /> Technical Skills
            Vector
          </h3>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Skill Keywords (Comma Separated)
            </label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" /> Social Links &
            Portfolio
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                GitHub URL
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Portfolio Site URL
              </label>
              <input
                type="text"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-bold text-xs text-white hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
        >
          <Save className="w-4 h-4" /> Save Profile Vector
        </button>
      </form>
    </div>
  )
}
