"use client" /* Left Area: Mobile Menu Toggle & Search Bar Trigger */ /* Right Controls */ /* AI Readiness Score Pill */ /* Ambient AI Assistant Trigger */ /* Notifications Popover Trigger */ /* User Profile Dropdown Menu */ /* Global Command Bar Modal */
import React, { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/providers/AuthProvider"
import { useApi } from "@/lib/api-client"
import type {
  DashboardOverview,
  NotificationItem as NotificationType,
} from "@/types"
import {
  Search,
  Bell,
  Sparkles,
  LogOut,
  User,
  ShieldCheck,
  Command,
  Menu,
  FileText,
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

  const { data: overview } = useApi<DashboardOverview>("/api/dashboard")
  const { data: notifications } = useApi<{
    items: NotificationType[]
    unread: number
  }>("/api/notifications")

  const readiness = overview ? Math.round(overview.readiness.score) : null
  const unread = notifications?.unread ?? 0
  const latest = (notifications?.items ?? []).slice(0, 3)

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
            <span className="font-bold text-sky-300 font-mono">
              {readiness != null ? `${readiness}%` : "—"}
            </span>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 material-glass p-3 rounded-xl border border-white/10 shadow-2xl w-48 text-[11px] space-y-1 text-left z-50">
              <p className="font-semibold text-white">Readiness Breakdown</p>
              {overview &&
                Object.entries(overview.readiness.components).map(
                  ([key, c]) => (
                    <p key={key} className="text-zinc-400 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}:{" "}
                      <span className="text-sky-400 font-mono">
                        {Math.round(c.value * 100)}%
                      </span>
                    </p>
                  ),
                )}
              {!overview && (
                <p className="text-zinc-500">
                  Complete your profile to build your score.
                </p>
              )}
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
              {unread > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-sky-400 rounded-full animate-ping" />
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-3.5 h-3.5 px-0.5 rounded-full bg-sky-500 text-[8px] font-bold text-black">
                    {unread > 9 ? "9+" : unread}
                  </span>
                </>
              )}
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
                      View All{unread > 0 ? ` (${unread})` : ""}
                    </Link>
                  </div>

                  <div className="space-y-2 text-xs max-h-64 overflow-y-auto pr-1">
                    {latest.length === 0 && (
                      <p className="text-[11px] text-zinc-500 py-3 text-center">
                        No notifications yet.
                      </p>
                    )}
                    {latest.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link ?? "/notifications"}
                        onClick={() => setShowNotifications(false)}
                      >
                        <div
                          className={`p-2.5 rounded-xl border hover:bg-white/10 transition ${
                            n.read
                              ? "bg-white/5 border-white/5"
                              : "bg-sky-500/10 border-sky-500/20"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-[11px] font-semibold mb-0.5 text-sky-300">
                            <Bell className="w-3.5 h-3.5" /> {n.title}
                          </div>
                          <p className="text-[10px] text-zinc-400 line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      </Link>
                    ))}
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
                {user?.name || "Student"}
              </span>
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-7 h-7 rounded-lg object-cover border border-white/20"
                />
              ) : (
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-[11px] font-extrabold text-black">
                  {(user?.name || "U").slice(0, 1).toUpperCase()}
                </span>
              )}
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
                      {user?.name || "Student"}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {user?.email || ""}
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
