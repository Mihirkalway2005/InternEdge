"use client" /* Page Header */ /* Filter & Search Bar */ /* Search Input */ /* Work Type Filter Pills */ /* Split-Pane Listing & Detail View */ /* Left Listing Column (5 Cols) */ /* Right Detail Preview Column (7 Cols) */ /* Header */ /* AI Match Breakdown Card */ /* Description */ /* Required Skills Badges */ /* Bottom Actions */
import React, { useState } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  Check,
} from "lucide-react"
import { motion } from "framer-motion"

const SAMPLE_INTERNSHIPS = [
  {
    id: "internship_1",
    company: "OpenAI",
    title: "AI Research & Systems Engineering Intern",
    location: "San Francisco, CA",
    workType: "hybrid",
    stipend: "$55 - $65 / hr",
    deadline: "25 Days Left",
    match: 96,
    skills: ["Python", "PyTorch", "CUDA", "Distributed Systems", "LLMs"],
    description:
      "Work alongside leading researchers on LLM alignment, high-throughput inference engines, and distributed GPU training infrastructure.",
  },
  {
    id: "internship_2",
    company: "Vercel",
    title: "Frontend Engineering Intern (Next.js Core)",
    location: "Remote",
    workType: "remote",
    stipend: "$45 - $55 / hr",
    deadline: "18 Days Left",
    match: 94,
    skills: [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Web Performance",
    ],
    description:
      "Help build the future of the web with React 19, Server Components, and Turbopack compiler engineering.",
  },
  {
    id: "internship_3",
    company: "Google",
    title: "Software Engineering Intern - Cloud Systems",
    location: "Mountain View, CA",
    workType: "onsite",
    stipend: "$50 - $60 / hr",
    deadline: "30 Days Left",
    match: 91,
    skills: ["Go", "C++", "Kubernetes", "Distributed Systems", "gRPC"],
    description:
      "Design and implement scalable microservices powering Google Cloud Platform Kubernetes and serverless infrastructure.",
  },
  {
    id: "internship_4",
    company: "Stripe",
    title: "Backend Engineering Intern (Fintech Core)",
    location: "Seattle, WA",
    workType: "hybrid",
    stipend: "$52 - $58 / hr",
    deadline: "14 Days Left",
    match: 88,
    skills: [
      "Ruby",
      "Go",
      "PostgreSQL",
      "API Design",
      "Distributed Transactions",
    ],
    description:
      "Architect high-reliability payment APIs handling millions of global transactions daily with microsecond latency.",
  },
  {
    id: "internship_5",
    company: "Figma",
    title: "WebGL & Graphics Engine Intern",
    location: "New York, NY",
    workType: "hybrid",
    stipend: "$48 - $56 / hr",
    deadline: "22 Days Left",
    match: 85,
    skills: ["TypeScript", "WebGL", "WebAssembly", "C++", "Canvas API"],
    description:
      "Optimize high-performance 2D/3D canvas rendering engine for real-time multiplayer vector graphics.",
  },
]

export default function InternshipsPage() {
  const [search, setSearch] = useState("")
  const [selectedWorkType, setSelectedWorkType] = useState<string>("all")
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [selectedInternship, setSelectedInternship] = useState(
    SAMPLE_INTERNSHIPS[0],
  )

  const filtered = SAMPLE_INTERNSHIPS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))

    const matchesType =
      selectedWorkType === "all" || item.workType === selectedWorkType
    return matchesSearch && matchesType
  })

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Internship Discovery Portal{" "}
            <Briefcase className="w-6 h-6 text-sky-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time AI Match Scoring based on your active skills, ATS resume,
            and career goals
          </p>
        </div>
      </div>

      {}
      <div className="material-glass p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        {}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, company, or tech stack (e.g. Next.js, Python)..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-400"
          />
        </div>

        {}
        <div className="flex items-center gap-2">
          {["all", "remote", "hybrid", "onsite"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedWorkType(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                selectedWorkType === type
                  ? "bg-sky-500 text-black shadow-lg shadow-sky-500/20"
                  : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {}
        <div className="lg:col-span-5 space-y-4">
          {filtered.map((item) => {
            const isSelected = selectedInternship.id === item.id
            const isSaved = savedIds.includes(item.id)

            return (
              <div
                key={item.id}
                onClick={() => setSelectedInternship(item)}
                className={`cursor-pointer p-5 rounded-3xl border transition-all duration-300 ${
                  isSelected
                    ? "material-glass border-sky-400/50 shadow-xl shadow-sky-500/10"
                    : "bg-white/[0.02] hover:bg-white/[0.04] border-white/10"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-sky-400">
                      {item.company}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {item.title}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold font-mono">
                    {item.match}% Match
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-zinc-400 mt-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />{" "}
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-zinc-300">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-500" />{" "}
                    {item.stipend}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                  {item.skills.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-zinc-500">
                      +{item.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {}
        <div className="lg:col-span-7">
          {selectedInternship && (
            <div className="sticky top-24 material-glass p-8 rounded-3xl border border-white/10 space-y-6">
              {}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-sky-400">
                      {selectedInternship.company}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400 uppercase tracking-wider">
                      {selectedInternship.workType}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {selectedInternship.title}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    {selectedInternship.location}
                  </p>
                </div>

                <button
                  onClick={() => toggleSave(selectedInternship.id)}
                  className={`p-3 rounded-2xl border transition ${
                    savedIds.includes(selectedInternship.id)
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-zinc-400"
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              {}
              <div className="p-5 rounded-2xl material-titanium border border-sky-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-sky-400" />
                    <span className="text-xs font-bold text-white">
                      AI Compatibility Breakdown
                    </span>
                  </div>
                  <span className="text-lg font-extrabold text-emerald-400 font-mono">
                    {selectedInternship.match}% Match
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-zinc-400">
                      Tech Skill Match
                    </p>
                    <p className="font-bold text-white font-mono mt-0.5">92%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-zinc-400">ATS Keyword Fit</p>
                    <p className="font-bold text-white font-mono mt-0.5">95%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-[10px] text-zinc-400">Estimated Prep</p>
                    <p className="font-bold text-sky-400 font-mono mt-0.5">
                      4 Days
                    </p>
                  </div>
                </div>
              </div>

              {}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Role Description
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedInternship.description}
                </p>
              </div>

              {}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInternship.skills.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-sky-400" /> {s}
                    </span>
                  ))}
                </div>
              </div>

              {}
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <Link
                  href={`/internships/${selectedInternship.id}`}
                  className="flex-1"
                >
                  <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-semibold text-xs text-white hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20">
                    View Full Analysis & Apply{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
