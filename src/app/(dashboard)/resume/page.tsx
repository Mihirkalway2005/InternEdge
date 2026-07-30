"use client" /* Header */ /* Tab Toggle */ /* Top Score Dial Card */ /* 4 Score Component Cards */ /* Actionable Suggestions */
/* AI Resume Builder Tab */
import React, { useState } from "react"
import Link from "next/link"
import {
  FileCheck2,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Download,
  RefreshCw,
  FileText,
} from "lucide-react"
import { motion } from "framer-motion"

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState<"analyzer" | "builder">("analyzer")
  const [atsScore, setAtsScore] = useState(92)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            AI Resume Analyzer & Builder{" "}
            <FileCheck2 className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            ATS Compatibility Scoring, Keyword Optimization, and AI Content
            Enhancer
          </p>
        </div>

        {}
        <div className="flex gap-2 p-1.5 rounded-2xl material-glass border border-white/10">
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "analyzer"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            ATS Score Analyzer
          </button>
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "builder"
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            AI Resume Builder
          </button>
        </div>
      </div>

      {activeTab === "analyzer" ? (
        <div className="space-y-8">
          {}
          <div className="material-glass p-8 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-8">
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Target Role Match: OpenAI / Vercel
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                Overall ATS Resume Readiness
              </h2>
              <p className="text-xs text-zinc-400">
                Parsed from{" "}
                <span className="text-amber-300 font-mono">
                  Alex_Rivera_Resume_2026.pdf
                </span>
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full border-4 border-amber-400 flex flex-col items-center justify-center bg-amber-500/10 shadow-xl shadow-amber-500/10">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {atsScore}
                </span>
                <span className="text-[10px] text-amber-300 font-bold uppercase">
                  Passed
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="material-glass p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] text-zinc-400 font-semibold">
                Impact Verbs
              </span>
              <p className="text-xl font-bold text-emerald-400 font-mono">
                95% (Strong)
              </p>
              <p className="text-[10px] text-zinc-500">
                Action verbiage present throughout.
              </p>
            </div>
            <div className="material-glass p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] text-zinc-400 font-semibold">
                Keyword Density
              </span>
              <p className="text-xl font-bold text-sky-400 font-mono">
                88% (High)
              </p>
              <p className="text-[10px] text-zinc-500">
                Matches 14/16 target terms.
              </p>
            </div>
            <div className="material-glass p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] text-zinc-400 font-semibold">
                Formatting Score
              </span>
              <p className="text-xl font-bold text-purple-400 font-mono">
                100% (Clean)
              </p>
              <p className="text-[10px] text-zinc-500">
                Standard single-column PDF.
              </p>
            </div>
            <div className="material-glass p-4 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] text-zinc-400 font-semibold">
                Length & Density
              </span>
              <p className="text-xl font-bold text-amber-400 font-mono">
                1 Page (Ideal)
              </p>
              <p className="text-[10px] text-zinc-500">
                Optimal word count for interns.
              </p>
            </div>
          </div>

          {}
          <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> AI Recommended
              Improvements
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">
                    Quantifiable Metrics in Project Section
                  </p>
                  <p className="text-xs text-zinc-300">
                    "Integrated Next.js App Router reducing initial page load
                    LCP by 42% and API response latency by 120ms."
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">
                    Add CUDA & GPU Optimization Keyword
                  </p>
                  <p className="text-xs text-amber-200">
                    OpenAI role listing requires CUDA C++ experience. Consider
                    adding your parallel matrix multiplication project to
                    section 2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="material-glass p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                Live AI Resume Builder
              </h3>
              <p className="text-xs text-zinc-400">
                Populating directly from Alex Rivera's student profile
              </p>
            </div>

            <button className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>

          <div className="material-titanium p-6 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Alex Rivera
              </h2>
              <p className="text-zinc-400">
                alex.rivera@stanford.edu • github.com/alexrivera •
                alexrivera.dev
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-amber-400 font-bold uppercase tracking-wider">
                Education
              </h4>
              <p className="text-white font-bold">
                Stanford University{" "}
                <span className="text-zinc-400 font-normal">
                  | B.S. Computer Science (Graduation 2026)
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-amber-400 font-bold uppercase tracking-wider">
                Technical Skills
              </h4>
              <p className="text-zinc-300">
                Languages & Frameworks: TypeScript, Python, Next.js 15, React
                19, PyTorch, Tailwind CSS, PostgreSQL, Convex DB, CUDA.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
