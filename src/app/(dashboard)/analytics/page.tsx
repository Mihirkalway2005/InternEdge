"use client"

import React from "react"
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Compass,
  FileCheck2,
} from "lucide-react"

export default function AnalyticsPage() {
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
          <p className="text-3xl font-extrabold text-white font-mono">66.7%</p>
          <p className="text-xs text-sky-400">2 OAs out of 3 Applications</p>
        </div>

        <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-zinc-400">
            Roadmap Consistency
          </span>
          <p className="text-3xl font-extrabold text-white font-mono">92%</p>
          <p className="text-xs text-amber-400">12 Days Active Streak</p>
        </div>
      </div>
    </div>
  )
}
