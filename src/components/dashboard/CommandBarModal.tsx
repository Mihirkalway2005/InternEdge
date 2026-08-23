"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Briefcase,
  Compass,
  Kanban,
  FileCheck2,
  Bot,
  User,
  BarChart3,
  Bell,
  Globe,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useApi } from "@/lib/api-client"
import type { DashboardOverview } from "@/types"

interface CommandBarModalProps {
  isOpen: boolean
  onClose: () => void
}

type Command = {
  label: string
  href: string
  icon: typeof Search
  badge?: string
}

export function CommandBarModal({ isOpen, onClose }: CommandBarModalProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { data: overview } = useApi<DashboardOverview>(
    isOpen ? "/api/dashboard" : null,
  )

  const commands: Command[] = useMemo(
    () => [
      { label: "Search Internships", href: "/internships", icon: Briefcase, badge: overview ? `${overview.topMatches.length || "…"} matched` : undefined },
      { label: "Learning Roadmap", href: "/roadmap", icon: Compass },
      { label: "Application Tracker", href: "/applications", icon: Kanban, badge: overview?.applications.total ? `${overview.applications.total} tracked` : undefined },
      { label: "Resume Analyzer", href: "/resume", icon: FileCheck2, badge: overview?.atsScore != null ? `ATS ${Math.round(overview.atsScore)}` : undefined },
      { label: "Mock Interviews", href: "/interviews", icon: Bot },
      { label: "Portfolio Builder", href: "/portfolio", icon: Globe },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Notifications", href: "/notifications", icon: Bell, badge: overview?.unreadNotifications ? `${overview.unreadNotifications} new` : undefined },
      { label: "Student Profile", href: "/profile", icon: User },
    ],
    [overview],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        if (isOpen) onClose()
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

  const filtered = commands.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-start justify-center pt-24 p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
          className="material-glass w-full max-w-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
            <Search className="w-4 h-4 text-zinc-500" />
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Jump to anything…"
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
            />
            <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-400 border border-white/10">
              ESC
            </kbd>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {filtered.length === 0 && (
              <p className="text-xs text-zinc-500 text-center py-6">
                No matches for &ldquo;{query}&rdquo;
              </p>
            )}
            {filtered.map((item) => (
              <button
                key={item.href + item.label}
                onClick={() => handleSelect(item.href)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition text-left group"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <item.icon className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-xs font-semibold text-white truncate">
                    {item.label}
                  </span>
                </span>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-600">
            <span>Navigate with real data — nothing here is static</span>
            <span className="font-mono">⌘K</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
