"use client" /* Left Area: Mobile Menu Toggle & Search Bar Trigger */ /* Right Controls */ /* AI Readiness Score Pill */ /* Ambient AI Assistant Trigger */ /* Notifications Popover Trigger */ /* User Profile Dropdown Menu */ /* Global Command Bar Modal */
import React, { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/providers/AuthProvider"
import {
  Search,
  Bell,
  Sparkles,
  LogOut,
  User,
  ShieldCheck,
  Command,
  FileText,
  Briefcase,
  CheckCircle2,
  Menu,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CommandBarModal } from "@/components/dashboard/CommandBarModal"

interface TopHeaderProps {
  onToggleAI: () => void
  onOpenMobileSidebar?: () => void
}

export function TopHeader({ onToggleAI, onOpenMobileSidebar }: TopHeaderProps) {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 material-smoked-glass border-b border-white/10 px-6 py-3.5 flex items-center justify-between backdrop-blur-xl">
        {}
        <div className="flex items-center gap-3">
          {onOpenMobileSidebar && (
            <button
              onClick={onOpenMobileSidebar}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => setIsCommandBarOpen(true)}
            className="relative w-64 md:w-80 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-2 px-3.5 flex items-center justify-between text-xs text-zinc-400 hover:text-white transition group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-zinc-400 group-hover:text-sky-400 transition" />
              <span>Search internships, skills...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-400 border border-white/10 group-hover:border-sky-400/50">
              <Command className="w-2.5 h-2.5 inline" /> K
            </kbd>
          </button>
        </div>

        {}
        <div className="flex items-center gap-3">
          {}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full material-titanium border border-sky-400/30 text-xs shadow-lg shadow-sky-500/5 group relative cursor-pointer">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span className="text-zinc-400">AI Readiness:</span>
            <span className="font-bold text-sky-300 font-mono">88%</span>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 material-glass p-3 rounded-xl border border-white/10 shadow-2xl w-48 text-[11px] space-y-1 text-left z-50">
              <p className="font-semibold text-white">Readiness Breakdown</p>
              <p className="text-zinc-400">
                DSA/Algo: <span className="text-sky-400 font-mono">92%</span>
              </p>
              <p className="text-zinc-400">
                System Design:{" "}
                <span className="text-amber-400 font-mono">84%</span>
              </p>
              <p className="text-zinc-400">
                ATS Keyword:{" "}
                <span className="text-emerald-400 font-mono">96%</span>
              </p>
            </div>
          </div>

          {}
          <button
            onClick={onToggleAI}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-sky-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="hidden md:inline">AI Assistant</span>
          </button>

          {}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-sky-400 rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-sky-400 rounded-full" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 material-glass p-4 rounded-2xl border border-white/10 shadow-2xl z-50 space-y-3 backdrop-blur-2xl"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Notifications
                    </h4>
                    <Link
                      href="/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-sky-400 hover:underline font-medium"
                    >
                      View All (3)
                    </Link>
                  </div>

                  <div className="space-y-2 text-xs max-h-64 overflow-y-auto pr-1">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition">
                      <div className="flex items-center gap-2 text-sky-400 font-semibold text-[11px] mb-0.5">
                        <Briefcase className="w-3.5 h-3.5" /> OpenAI Technical
                        OA
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Scheduled for Friday. Practice Graph Traversals in Mock
                        Interview.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition">
                      <div className="flex items-center gap-2 text-amber-400 font-semibold text-[11px] mb-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Roadmap
                        Milestone
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        +2 System Design tasks added to Full-Stack track.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px] mb-0.5">
                        <FileText className="w-3.5 h-3.5" /> ATS Score Update
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Resume scorecard increased to 96% match for Google SWE.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              <span className="text-xs font-semibold text-white hidden sm:inline">
                {user?.name || "Alex Rivera"}
              </span>
              <img
                src={
                  user?.avatarUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                }
                alt="Avatar"
                className="w-7 h-7 rounded-lg object-cover border border-white/20"
              />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-52 material-glass p-2 rounded-2xl border border-white/10 shadow-2xl z-50 space-y-1 backdrop-blur-2xl"
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-bold text-white">
                      {user?.name || "Alex Rivera"}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {user?.email || "alex.rivera@stanford.edu"}
                    </p>
                  </div>

                  <Link href="/profile" onClick={() => setShowMenu(false)}>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition">
                      <User className="w-4 h-4 text-sky-400" /> Student Profile
                    </div>
                  </Link>

                  <Link href="/resume" onClick={() => setShowMenu(false)}>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition">
                      <FileText className="w-4 h-4 text-purple-400" /> ATS
                      Resume Scorecard
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      setShowMenu(false)
                      logout()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {}
      <CommandBarModal
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
      />
    </>
  )
}
