"use client"
// Open
/* Backdrop */ /* Modal Shell */ /* Search Input Bar */ /* Results List */ /* Footer Shortcuts */
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Briefcase,
  Compass,
  Kanban,
  FileCheck2,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  X,
  Command,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CommandBarModalProps {
  isOpen: boolean
  onClose: () => void
}

const QUICK_SEARCH_ITEMS = [
  {
    category: "Internships & Opportunities",
    items: [
      {
        label: "Search Technical Internships",
        href: "/internships",
        icon: Briefcase,
        badge: "40+ Active",
      },
      {
        label: "Google SWE Summer 2026",
        href: "/internships",
        icon: Briefcase,
        badge: "$68/hr",
      },
      {
        label: "OpenAI AI Resident",
        href: "/internships",
        icon: Briefcase,
        badge: "$88/hr",
      },
    ],
  },
  {
    category: "Career Modules & AI Tools",
    items: [
      {
        label: "AI Readiness & Learning Roadmap",
        href: "/roadmap",
        icon: Compass,
        badge: "Level 4",
      },
      {
        label: "Application Tracker Pipeline",
        href: "/applications",
        icon: Kanban,
        badge: "3 Active",
      },
      {
        label: "ATS Resume Analyzer & Scorecard",
        href: "/resume",
        icon: FileCheck2,
        badge: "96% Match",
      },
      {
        label: "Interactive Voice & Code Mock Interview",
        href: "/interviews",
        icon: Bot,
        badge: "AI Simulated",
      },
      {
        label: "Student Vector Profile & Skills",
        href: "/profile",
        icon: User,
        badge: "Stanford CS",
      },
    ],
  },
]

export function CommandBarModal({ isOpen, onClose }: CommandBarModalProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSelect = (href: string) => {
    router.push(href)
    onClose()
  }

  const filteredGroups = QUICK_SEARCH_ITEMS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase()),
    ),
  })).filter((group) => group.items.length > 0)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
        {}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-xl material-glass rounded-3xl border border-white/15 shadow-2xl overflow-hidden z-10 backdrop-blur-2xl"
        >
          {}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
            <Search className="w-5 h-5 text-sky-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search internships, skills, applications, roadmap..."
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-zinc-500 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded bg-white/10 text-zinc-400 border border-white/10">
              ESC
            </kbd>
          </div>

          {}
          <div className="max-h-[360px] overflow-y-auto p-3 space-y-4">
            {filteredGroups.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400 space-y-2">
                <Sparkles className="w-6 h-6 text-zinc-500 mx-auto" />
                <p>
                  No matching platform modules or internships found for "{query}
                  "
                </p>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.category} className="space-y-1.5">
                  <div className="px-3 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    {group.category}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10 transition group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-sky-500/20 text-zinc-400 group-hover:text-sky-300 transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 group-hover:text-sky-300 group-hover:bg-sky-500/10 border border-white/5 transition">
                            {item.badge}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {}
          <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[9px]">
                  <Command className="w-2.5 h-2.5 inline" /> K
                </kbd>
                Toggle
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[9px]">
                  ↵
                </kbd>
                Navigate
              </span>
            </div>
            <span className="text-sky-400">InternEdge Command Center</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
