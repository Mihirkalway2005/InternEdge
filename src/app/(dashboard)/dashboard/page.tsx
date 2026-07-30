"use client" /* Welcome Banner */ /* Top 4 Metric Cards */ /* Metric 1 */ /* Metric 2 */ /* Metric 3 */ /* Metric 4 */ /* Main Grid Section */ /* Left 2 Columns: Recommended Internships & Focus Roadmap */ /* Top Matches Feed */ /* Daily Roadmap Tasks */ /* Right Column: Application Funnel & AI Mock Interview Shortcut */ /* Application Pipeline Status */ /* AI Mock Interview Callout Card */
import React from "react"
import Link from "next/link"
import { useAuth } from "@/providers/AuthProvider"
import {
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Briefcase,
  Compass,
  FileCheck2,
  Bot,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Welcome back, {user?.name || "Alex"}{" "}
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            AI Readiness Vector:{" "}
            <span className="text-sky-400 font-semibold">88% Match</span> for
            Full-Stack & AI Systems roles
          </p>
        </div>

        <Link href="/internships">
          <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 font-semibold text-xs text-white hover:opacity-95 transition flex items-center gap-2 shadow-lg shadow-sky-500/20">
            Explore 20+ Matched Internships <ArrowUpRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {}
        <div className="material-glass p-5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">
              AI Readiness Score
            </span>
            <ShieldCheck className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              88%
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              +6% this week
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full w-[88%]" />
          </div>
        </div>

        {}
        <div className="material-glass p-5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">
              Resume ATS Rating
            </span>
            <FileCheck2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              92/100
            </span>
            <span className="text-xs text-amber-300 font-semibold">
              ATS Passed
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full w-[92%]" />
          </div>
        </div>

        {}
        <div className="material-glass p-5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">
              Active Applications
            </span>
            <Briefcase className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              3
            </span>
            <span className="text-xs text-purple-300 font-semibold">
              1 Interview Prep
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full w-[60%]" />
          </div>
        </div>

        {}
        <div className="material-glass p-5 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-zinc-400">
              Weekly Learning Goal
            </span>
            <Compass className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              4/5
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              80% Done
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full w-[80%]" />
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-2 space-y-8">
          {}
          <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-sky-400" /> Top AI-Matched
                  Internships
                </h3>
                <p className="text-xs text-zinc-400">
                  Real-time match scoring against your student profile
                </p>
              </div>
              <Link
                href="/internships"
                className="text-xs text-sky-400 hover:underline font-semibold"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  company: "OpenAI",
                  title: "AI Research & Systems Engineering Intern",
                  location: "San Francisco, CA (Hybrid)",
                  match: 96,
                  stipend: "$55 - $65 / hr",
                  tags: ["Python", "PyTorch", "CUDA", "LLMs"],
                },
                {
                  company: "Vercel",
                  title: "Frontend Engineering Intern (Next.js Core)",
                  location: "Remote",
                  match: 94,
                  stipend: "$45 - $55 / hr",
                  tags: ["TypeScript", "Next.js", "React", "Tailwind"],
                },
                {
                  company: "Stripe",
                  title: "Backend Engineering Intern (Fintech Core)",
                  location: "Seattle, WA (Hybrid)",
                  match: 88,
                  stipend: "$52 - $58 / hr",
                  tags: ["Go", "Ruby", "PostgreSQL", "Microservices"],
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="material-glass-interactive p-4 rounded-2xl border border-white/10 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-400">
                        {item.company}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-xs text-zinc-400">
                        {item.location}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 pt-1">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right space-y-2 shrink-0 ml-4">
                    <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                      {item.match}% Match
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">
                      {item.stipend}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-400" /> Daily Learning
                  Focus
                </h3>
                <p className="text-xs text-zinc-400">
                  Target tasks to close skill gaps for Summer 2026
                </p>
              </div>
              <Link
                href="/roadmap"
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                Open Roadmap →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: "Master Next.js App Router & Server Components",
                  done: true,
                  cat: "Frontend",
                },
                {
                  title: "Implement Real-time Convex Backend Mutations",
                  done: true,
                  cat: "Backend",
                },
                {
                  title: "Practice 15 Advanced LeetCode Graph & DP Problems",
                  done: false,
                  cat: "Algorithm",
                },
                {
                  title: "Build & Deploy AI Agent Prototype with Embeddings",
                  done: false,
                  cat: "AI/ML",
                },
              ].map((task) => (
                <div
                  key={task.title}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1 rounded-full ${
                        task.done ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          task.done
                            ? "text-zinc-400 line-through"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>
                      <span className="text-[10px] text-zinc-500">
                        {task.cat}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      task.done
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {task.done ? "Completed" : "In Progress"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="space-y-8">
          {}
          <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" /> Application
              Pipeline
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">OpenAI - AI Systems</p>
                  <p className="text-[10px] text-purple-300">
                    Online Assessment Passed
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/30 text-purple-200 font-bold text-[10px]">
                  OA Stage
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Vercel - Frontend Core</p>
                  <p className="text-[10px] text-sky-300">
                    Application Submitted
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-500/30 text-sky-200 font-bold text-[10px]">
                  Applied
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-800/50 border border-white/10 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Stripe - Fintech Core</p>
                  <p className="text-[10px] text-zinc-400">
                    Resume Customization
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 font-bold text-[10px]">
                  Saved
                </span>
              </div>
            </div>

            <Link
              href="/applications"
              className="block text-center w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 transition"
            >
              Open Application Kanban →
            </Link>
          </div>

          {}
          <div className="material-glass p-6 rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-purple-500/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  AI Mock Interview Hub
                </h4>
                <p className="text-xs text-zinc-400">
                  Practice Technical DSA & Behavioral Qs
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Your OpenAI Technical assessment is scheduled in 2 days. Run an AI
              simulator session now to receive instant feedback on confidence &
              keyword accuracy.
            </p>

            <Link href="/interviews" className="block">
              <button className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs transition shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2">
                Start AI Mock Session <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
