"use client"

import React from "react"
import {
  Bell,
  Calendar,
  Briefcase,
  Compass,
  FileCheck2,
  ShieldCheck,
} from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Notification Center <Bell className="w-6 h-6 text-sky-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Stay updated on internship application deadlines, OA schedules, and
            roadmap alerts
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            title: "OpenAI Online Technical OA Scheduled",
            desc: "Your Hackerrank technical assessment link is active. Recommended practice: 15 DP & Graph problems.",
            time: "2 hours ago",
            type: "interview",
          },
          {
            title: "Roadmap Milestone Milestone Completed",
            desc: 'You completed "Implement Real-time Convex Backend Mutations". Your Readiness Score increased +3%.',
            time: "Yesterday",
            type: "roadmap",
          },
          {
            title: "Vercel Internship Deadline Approaching",
            desc: "Application deadline for Frontend Engineering Intern is in 18 days.",
            time: "2 days ago",
            type: "deadline",
          },
        ].map((n, i) => (
          <div
            key={i}
            className="material-glass p-5 rounded-3xl border border-white/10 flex items-start justify-between"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">{n.title}</h3>
              <p className="text-xs text-zinc-300">{n.desc}</p>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono shrink-0 ml-4">
              {n.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
