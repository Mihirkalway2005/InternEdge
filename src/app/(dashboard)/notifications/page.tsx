"use client"

import React from "react"
import Link from "next/link"
import { api, useApi, timeAgo } from "@/lib/api-client"
import type { NotificationItem } from "@/types"
import {
  Bell,
  CalendarClock,
  Compass,
  Bot,
  FileCheck2,
  Briefcase,
  Settings,
  CheckCheck,
  Loader2,
} from "lucide-react"

const TYPE_META: Record<string, { icon: React.ReactNode color: string }> = {
  deadline: {
    icon: <CalendarClock className="w-4 h-4" />,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  roadmap: {
    icon: <Compass className="w-4 h-4" />,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  interview: {
    icon: <Bot className="w-4 h-4" />,
    color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  },
  resume: {
    icon: <FileCheck2 className="w-4 h-4" />,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
  application: {
    icon: <Briefcase className="w-4 h-4" />,
    color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30",
  },
  system: {
    icon: <Settings className="w-4 h-4" />,
    color: "text-zinc-400 bg-white/5 border-white/10",
  },
}

export default function NotificationsPage() {
  const { data, loading, error, refetch } = useApi<{
    items: NotificationItem[]
    unread: number
  }>("/api/notifications")

  const markAll = async () => {
    await api("/api/notifications", {
      method: "PATCH",
      body: JSON.stringify({ readAll: true }),
    })
    refetch()
  }

  const markOne = async (id: string) => {
    await api("/api/notifications", {
      method: "PATCH",
      body: JSON.stringify({ id }),
    })
    refetch()
  }

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
      </div>
    )

  const items = data?.items ?? []

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Notifications <Bell className="w-6 h-6 text-sky-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {data?.unread ? `${data.unread} unread` : "You're all caught up"}
          </p>
        </div>
        {data && data.unread > 0 && (
          <button
            onClick={markAll}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      {!error && items.length === 0 ? (
        <div className="material-glass p-10 rounded-3xl border border-dashed border-white/15 text-center space-y-2">
          <Bell className="w-8 h-8 mx-auto text-zinc-600" />
          <h3 className="text-base font-bold text-white">Nothing here yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Deadline alerts, resume analysis results, interview evaluations and
            roadmap updates will land here as you use InternEdge.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((n) => {
            const meta = TYPE_META[n.type] ?? TYPE_META.system
            return (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border space-y-1.5 ${
                  n.read
                    ? "bg-white/[0.02] border-white/5"
                    : "bg-white/5 border-sky-500/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`p-2 rounded-xl border shrink-0 ${meta.color}`}
                    >
                      {meta.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{n.title}</p>
                      <p className="text-xs text-zinc-400">{n.message}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-600 shrink-0">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3 pl-11">
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => !n.read && markOne(n.id)}
                      className="text-[11px] font-bold text-sky-400 hover:underline"
                    >
                      Open →
                    </Link>
                  )}
                  {!n.read && (
                    <button
                      onClick={() => markOne(n.id)}
                      className="text-[11px] text-zinc-500 hover:text-white"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
