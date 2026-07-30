"use client" /* Header & Logo */ /* Navigation Items */ /* Tooltip for collapsed mode */ /* Footer Vector Widget */ /* Desktop Fixed Sidebar */ /* Mobile Drawer Overlay */
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { InternEdgeLogo } from "@/components/brand/InternEdgeLogo"
import {
  LayoutDashboard,
  Briefcase,
  Compass,
  Kanban,
  FileCheck2,
  Bot,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Globe,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Internships",
    href: "/internships",
    icon: Briefcase,
    badge: "AI Match",
  },
  { label: "Learning Path", href: "/roadmap", icon: Compass },
  {
    label: "Applications",
    href: "/applications",
    icon: Kanban,
    badge: "3 Active",
  },
  { label: "Resume ATS", href: "/resume", icon: FileCheck2 },
  { label: "Mock Interview", href: "/interviews", icon: Bot },
  { label: "Portfolio Site", href: "/portfolio", icon: Globe },
  { label: "Student Profile", href: "/profile", icon: User },
]

interface SidebarNavProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function SidebarNav({
  isCollapsed,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
}: SidebarNavProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <aside
      className={`h-full material-smoked-glass border-r border-white/10 transition-all duration-300 flex flex-col justify-between p-4 backdrop-blur-2xl ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div>
        {}
        <div className="flex items-center justify-between mb-8 px-2 pt-2">
          {!isCollapsed && <InternEdgeLogo variant="default" size="sm" />}
          {isCollapsed && <InternEdgeLogo variant="icon-only" size="sm" />}

          <button
            type="button"
            onClick={onToggle}
            className="hidden md:flex p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="md:hidden p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href} onClick={onMobileClose}>
                <div
                  className={`relative flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition group ${
                    isActive
                      ? "bg-gradient-to-r from-sky-500/20 to-blue-500/10 text-sky-400 border border-sky-500/30 shadow-lg shadow-sky-500/5"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition ${
                      isActive
                        ? "text-sky-400"
                        : "text-zinc-400 group-hover:text-white"
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {item.badge}
                    </span>
                  )}

                  {}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl material-glass border border-white/10 text-xs text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-xl">
                      {item.label}
                    </div>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute left-0 w-1 h-6 bg-sky-400 rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {}
      {!isCollapsed && (
        <div className="p-3.5 rounded-2xl material-titanium border border-white/10 space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> AI
            Readiness Boost
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Your readiness score increased by{" "}
            <span className="text-emerald-400 font-semibold">+14%</span> this
            week!
          </p>
        </div>
      )}
    </aside>
  )

  return (
    <>
      {}
      <div className="hidden md:block fixed top-0 left-0 bottom-0 z-40">
        {sidebarContent}
      </div>

      {}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-10 w-64 h-full"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
