"use client" /* KPI cards */ /* Funnel */ /* Weekly applications */ /* Interview trend */ /* ATS progression */ /* Roadmap */

import React from "react"
import Link from "next/link"
import { useApi } from "@/lib/api-client"
import type { AnalyticsResponse } from "@/types"
import {
  BarChart3,
  TrendingUp,
  FileCheck2,
  Compass,
  Flame,
  Loader2,
  AlertCircle,
} from "lucide-react"

const FUNNEL_STAGES = [
  { key: "saved", label: "Saved" },
  { key: "applied", label: "Applied" },
  { key: "assessment", label: "Assessment" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
] as const

export default function AnalyticsPage() {
  const { data, loading, error, refetch } =
    useApi<AnalyticsResponse>("/api/analytics")

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
      </div>
    )
  if (error || !data)
    return (
      <div className="max-w-5xl mx-auto material-glass p-8 rounded-3xl border border-red-500/30 space-y-2">
        <AlertCircle className="w-6 h-6 text-red-400" />
        <p className="font-bold">Couldn&apos;t load analytics</p>
        <p className="text-xs text-zinc-400">{error}</p>
        <button
          onClick={refetch}
          className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
        >
          Retry
        </button>
      </div>
    )

  const hasAnyData =
    data.funnel.total > 0 ||
    data.interviews.count > 0 ||
    data.resume.progression.length > 0 ||
    data.readiness.history.length > 0

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Growth & Conversion Analytics{" "}
          <BarChart3 className="w-6 h-6 text-emerald-400" />
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Every number here is computed from your real activity — no estimates
        </p>
      </div>

      {!hasAnyData && (
        <div className="material-glass p-10 rounded-3xl border border-dashed border-white/15 text-center space-y-3">
          <BarChart3 className="w-8 h-8 mx-auto text-zinc-600" />
          <h3 className="text-base font-bold text-white">No analytics yet</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Track applications, run mock interviews and analyze your resume —
            your funnel, trends and readiness velocity will appear here.
          </p>
          <Link
            href="/internships"
            className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs"
          >
            Start with internships →
          </Link>
        </div>
      )}

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Kpi
          label="Readiness Score"
          value={`${data.readiness.current}%`}
          icon={<TrendingUp className="w-5 h-5 text-sky-400" />}
          sub={
            data.readiness.history.length >= 2
              ? `${
                  data.readiness.history[data.readiness.history.length - 1]
                    .score -
                    data.readiness.history[0].score >=
                  0
                    ? "+"
                    : ""
                }${data.readiness.history[data.readiness.history.length - 1].score - data.readiness.history[0].score} since first snapshot`
              : "Snapshot history builds over time"
          }
        />
        <Kpi
          label="Interview Rate"
          value={
            data.conversionRates.interviewRate != null
              ? `${data.conversionRates.interviewRate}%`
              : "—"
          }
          icon={<BarChart3 className="w-5 h-5 text-purple-400" />}
          sub={`${data.funnel.applied} applications submitted`}
        />
        <Kpi
          label="Offer Rate"
          value={
            data.conversionRates.offerRate != null
              ? `${data.conversionRates.offerRate}%`
              : "—"
          }
          icon={<Compass className="w-5 h-5 text-emerald-400" />}
          sub={`${data.funnel.offer} offers`}
        />
        <Kpi
          label="Learning Streak"
          value={`${data.learning.streak}d`}
          icon={<Flame className="w-5 h-5 text-amber-400" />}
          sub={`${data.learning.activeDays30d} active days (30d)`}
        />
      </div>

      {}
      <Card title="Application Funnel">
        {data.funnel.total === 0 ? (
          <Empty text="Save and track internships to build your funnel." />
        ) : (
          <div className="space-y-3">
            {FUNNEL_STAGES.map((stage) => {
              const count = data.funnel[stage.key] ?? 0
              const pct =
                data.funnel.total === 0
                  ? 0
                  : Math.round((count / data.funnel.total) * 100)
              return (
                <div key={stage.key} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 w-24 shrink-0">
                    {stage.label}
                  </span>
                  <div className="flex-1 h-7 bg-white/5 rounded-lg overflow-hidden">
                    <div
                      className={`h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-700 ${
                        stage.key === "offer"
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                          : stage.key === "saved"
                            ? "bg-gradient-to-r from-zinc-700 to-zinc-500"
                            : "bg-gradient-to-r from-sky-700 to-sky-400"
                      }`}
                      style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                    >
                      {count > 0 && (
                        <span className="text-[10px] font-bold text-white">
                          {count}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-600 w-10 text-right">
                    {pct}%
                  </span>
                </div>
              )
            })}
            {data.funnel.rejected > 0 && (
              <p className="text-[11px] text-zinc-600 pt-1">
                {data.funnel.rejected} rejections — every application is a rep.
              </p>
            )}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <Card title="Applications per week (last 8 weeks)">
          <MiniBars
            data={(data.weeklyApplications ?? []).map((w) => ({
              label: new Date(w.week).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              }),
              value: w.count,
            }))}
            color="#38bdf8"
          />
        </Card>

        {}
        <Card
          title={`Mock interview scores${
            data.interviews.avgScore != null
              ? ` · avg ${data.interviews.avgScore}`
              : ""
          }`}
        >
          <MiniBars
            data={data.interviews.trend.map((t, i) => ({
              label: `#${i + 1}`,
              value: Math.round(t.score ?? 0),
            }))}
            color="#a78bfa"
          />
        </Card>

        {}
        <Card title="Resume ATS progression">
          {data.resume.progression.length === 0 ? (
            <Empty text="Upload a resume on the Resume page to start tracking." />
          ) : (
            <MiniBars
              data={data.resume.progression.map((r) => ({
                label: r.label?.replace(/\.pdf$/i, "").slice(0, 8) ?? "v?",
                value: Math.round(r.score ?? 0),
              }))}
              color="#fbbf24"
            />
          )}
        </Card>

        {}
        <Card title="Roadmap completion">
          {data.learning.roadmapProgress == null ? (
            <Empty text="Generate a roadmap to track learning progress." />
          ) : (
            <div className="flex items-center gap-6 py-4">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="3.5"
                    strokeDasharray={`${data.learning.roadmapProgress} ${100 - data.learning.roadmapProgress}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-extrabold font-mono">
                  {data.learning.roadmapProgress}%
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-[180px]">
                Tasks completed in your active roadmap.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function Kpi({
  label,
  value,
  icon,
  sub,
}: {
  label: string
  value: string
  icon: React.ReactNode
  sub?: string
}) {
  return (
    <div className="material-glass p-5 rounded-3xl border border-white/10 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400">{label}</span>
        {icon}
      </div>
      <p className="text-3xl font-extrabold text-white font-mono">{value}</p>
      {sub && <p className="text-[11px] text-zinc-500">{sub}</p>}
    </div>
  )
}

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-4">
      <h3 className="text-base font-bold text-white">{title}</h3>
      {children}
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="text-xs text-zinc-500 py-6 text-center">{text}</p>
}

function MiniBars({
  data,
  color,
}: {
  data: { label: string value: number }[]
  color: string
}) {
  if (data.length === 0) return <Empty text="Not enough data yet." />
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex items-end gap-2 h-40 pt-2">
      {data.slice(-12).map((d, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center gap-1.5 min-w-0"
        >
          <span className="text-[10px] text-zinc-500 font-mono">{d.value}</span>
          <div
            className="w-full rounded-t-md transition-all duration-700 min-h-[3px]"
            style={{
              height: `${(d.value / max) * 100}%`,
              backgroundColor: color,
            }}
          />
          <span className="text-[9px] text-zinc-600 truncate w-full text-center">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  )
}
