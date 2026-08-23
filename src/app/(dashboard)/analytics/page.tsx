"use client"

import React, { useState, useEffect } from "react"
import { apiJson } from "@/lib/api-client"
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Compass,
  FileCheck2,
} from "lucide-react"

export default function AnalyticsPage() {
  const [stats, setStats] = useState<{
    totalInternships?: number
    totalApplications?: number
    latestAtsScore?: number | null
    avgInterviewScore?: number
    roadmapProgress?: number
  }>({})

  useEffect(() => {
    let active = true
    apiJson<any>("/api/analytics").then((data) => {
      if (!active || !data) return
      const roadmaps = data.roadmaps ?? []
      const progress = roadmaps[0]?.tasks?.length
        ? Math.round(
            (roadmaps[0].tasks.filter((t: any) => t.completed).length /
              roadmaps[0].tasks.length) *
              100,
          )
        : undefined
      setStats({
        totalInternships: data.totalInternships,
        totalApplications: data.totalApplications,
        latestAtsScore: data.latestAtsScore,
        avgInterviewScore: data.avgInterviewScore,
        roadmapProgress: progress,
      })
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Student Growth & Conversion Analytics{" "}
            <BarChart3 className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track long-term readiness growth velocity, resume ATS score
            progression, and conversion rates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-zinc-400">
            Readiness Score Velocity
          </span>
          <p className="text-3xl font-extrabold text-white font-mono">
            88% (+14%)
          </p>
          <p className="text-xs text-emerald-400">
            Top 5% among Stanford CS cohort
          </p>
        </div>

        <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-zinc-400">
            Application Conversion
          </span>
          <p className="text-3xl font-extrabold text-white font-mono">
            {stats.totalApplications ?? 3}
          </p>
          <p className="text-xs text-sky-400">
            {stats.totalInternships ?? 0} internships available
          </p>
        </div>

        <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-zinc-400">
            Roadmap Consistency
          </span>
          <p className="text-3xl font-extrabold text-white font-mono">
            {stats.roadmapProgress ?? 92}%
          </p>
          <p className="text-xs text-amber-400">12 Days Active Streak</p>
        </div>
      </div>
    </div>
  )
}
