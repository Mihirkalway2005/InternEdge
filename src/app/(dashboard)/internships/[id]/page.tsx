"use client" /* Back Button */ /* Main Glass Header */ /* AI Analysis Box */ /* Detailed Sections */
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ShieldCheck,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  PlusCircle,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react"

export default function InternshipDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [addedToRoadmap, setAddedToRoadmap] = useState(false)
  const [addedToTracker, setAddedToTracker] = useState(false)

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {}
      <Link
        href="/internships"
        className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Internships
      </Link>

      {}
      <div className="material-glass p-8 rounded-3xl border border-white/10 space-y-6 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-sky-400">OpenAI</span>
              <span className="text-zinc-500">•</span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider">
                Hybrid (San Francisco, CA)
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              AI Research & Systems Engineering Intern
            </h1>
            <p className="text-xs text-zinc-400">
              Application Deadline: 25 Days Remaining • Stipend: $55 - $65 / hr
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm font-bold font-mono inline-block">
              96% AI Match
            </div>
            <p className="text-[10px] text-zinc-500">
              High Conversion Probability
            </p>
          </div>
        </div>

        {}
        <div className="material-titanium p-6 rounded-2xl border border-sky-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-bold text-white">
                AI Career Vector Insights
              </h3>
            </div>
            <span className="text-xs text-sky-300 font-mono">
              Estimated Prep: 4 Days
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Your candidate profile is strongly aligned with this role. You
            possess{" "}
            <span className="text-sky-400 font-semibold">
              4 out of 5 required core skills
            </span>{" "}
            (Python, PyTorch, Distributed Systems, LLMs). Adding{" "}
            <span className="text-amber-400 font-semibold">
              CUDA C++ Optimization
            </span>{" "}
            to your weekly roadmap will raise your match score to 99%.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setAddedToRoadmap(true)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                addedToRoadmap
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
              }`}
            >
              {addedToRoadmap ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Added to
                  Learning Roadmap
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" /> Add Missing Skill (CUDA) to
                  Roadmap
                </>
              )}
            </button>

            <button
              onClick={() => {
                setAddedToTracker(true)
                setTimeout(() => router.push("/applications"), 1000)
              }}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                addedToTracker
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                  : "bg-white/5 hover:bg-white/10 border-white/10 text-white"
              }`}
            >
              {addedToTracker ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-sky-400" /> Added to
                  Kanban Tracker!
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-sky-400" /> Track Application on
                  Kanban
                </>
              )}
            </button>
          </div>
        </div>

        {}
        <div className="space-y-6 pt-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
              Responsibilities
            </h3>
            <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1.5 leading-relaxed">
              <li>
                Architect high-throughput GPU inference pipelines for
                large-scale language models.
              </li>
              <li>
                Implement distributed training algorithms using PyTorch and CUDA
                kernels.
              </li>
              <li>
                Collaborate with AI safety researchers to evaluate model
                robustness and alignment benchmarks.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
              Requirements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {["Python", "PyTorch", "Distributed Systems", "LLMs", "CUDA"].map(
                (skill) => (
                  <div
                    key={skill}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky-400" /> {skill}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
