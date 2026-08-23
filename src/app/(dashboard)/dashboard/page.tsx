"use client" /* Header */ /* Metric Cards */ /* Top matches */ /* Daily tasks */ /* Right column */ /* Recent activity */
// Roadmap component value is 0..1 of completion.

import React from "react"
import Link from "next/link"
import { useApi, timeAgo } from "@/lib/api-client"
import type { DashboardOverview } from "@/types"
import {
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Briefcase,
  Compass,
  FileCheck2,
  Bot,
  TrendingUp,
  CalendarClock,
  Loader2,
  AlertCircle,
} from "lucide-react"

export default function DashboardPage() {
  const { data, loading, error } = useApi<DashboardOverview>("/api/dashboard")

  if (loading) return <LoadingState />
  if (error || !data) {
    return (
      <ErrorState
        message={
          error ??
          "Failed to load your dashboard"
        }
      />
    )
  }

  const readiness = Math.round(data.readiness.score)
  const isNewUser =
    data.applications.total ===
      0 &&
    !data.atsScore &&
    data.topMatches.length ===
      0

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Welcome back, {data.userName.split(" ")[0]}{" "}
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            AI Readiness Score{" "}
            <span className="text-sky-400 font-semibold">{readiness}%</span> for{" "}
            {data.readiness.targetRole} roles
          </p>
        </div>
        <Link href="/internships">
          <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 font-semibold text-xs text-white hover:opacity-95 transition flex items-center gap-2 shadow-lg shadow-sky-500/20">
            Explore Matched Internships <ArrowUpRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      {isNewUser && <NewUserBanner />}

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <MetricCard
          label="AI Readiness Score"
          icon={<ShieldCheck className="w-5 h-5 text-sky-400" />}
          value={`${readiness}%`}
          sub={atsComponentLabel(data)}
          progress={readiness}
          progressCls="bg-gradient-to-r from-sky-400 to-blue-500"
        />
        <MetricCard
          label="Resume ATS Rating"
          icon={<FileCheck2 className="w-5 h-5 text-amber-400" />}
          value={
            data.atsScore !=
            null
              ? `${Math.round(data.atsScore)}/100`
              : "—"
          }
          sub={
            data.resumeFileName
              ? data.resumeFileName.slice(0, 28)
              : "No resume analyzed yet"
          }
          progress={
            data.atsScore ??
            0
          }
          progressCls="bg-amber-400"
        />
        <MetricCard
          label="Active Applications"
          icon={<Briefcase className="w-5 h-5 text-purple-400" />}
          value={String(data.applications.active)}
          sub={`${data.applications.total} total tracked`}
          progress={Math.min(
            data.applications.active *
              20,
            100,
          )}
          progressCls="bg-purple-400"
        />
        <MetricCard
          label="Roadmap Progress"
          icon={<Compass className="w-5 h-5 text-emerald-400" />}
          value={roadmapProgressLabel(data)}
          sub={
            data.todaysTasks.length >
            0
              ? `${data.todaysTasks.length} tasks due`
              : "All caught up"
          }
          progress={roadmapProgressValue(data)}
          progressCls="bg-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {}
          <Section
            title="Top AI-Matched Internships"
            subtitle="Deterministic scoring against your profile & skills"
            icon={<Briefcase className="w-5 h-5 text-sky-400" />}
            action={{ href: "/internships", label: "View All →" }}
            empty={
              data.topMatches.length ===
              0
            }
            emptyMessage="No active internships to match yet."
          >
            <div className="space-y-3">
              {data.topMatches.map((item) => (
                <Link
                  key={item.id}
                  href={`/internships?id=${item.id}`}
                  className="material-glass-interactive p-4 rounded-2xl border border-white/10 flex items-center justify-between hover:border-sky-500/30 transition"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-400">
                        {item.company}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-xs text-zinc-400 truncate">
                        {item.location} ({item.workType})
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {item.requiredSkills.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right space-y-2 shrink-0 ml-4">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                        item.score >=
                        70
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : item.score >=
                              45
                            ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                            : "bg-white/10 text-zinc-300 border border-white/10"
                      }`}
                    >
                      {item.score}% Match
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">
                      {item.salary ??
                        "Competitive"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          {}
          <Section
            title="Daily Learning Focus"
            subtitle={
              data.todaysTasks.length >
              0
                ? "Upcoming roadmap tasks"
                : "Complete tasks appear here"
            }
            icon={<Compass className="w-5 h-5 text-amber-400" />}
            action={{ href: "/roadmap", label: "Open Roadmap →" }}
            empty={
              data.todaysTasks.length ===
              0
            }
            emptyMessage={
              data.hasRoadmap
                ? "No pending tasks right now — great pace!"
                : "Generate a roadmap to get daily learning tasks."
            }
          >
            <div className="space-y-3">
              {data.todaysTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Circle className="w-5 h-5 text-zinc-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {task.title}
                      </p>
                      <span className="text-[10px] text-zinc-500">
                        {task.category ?? task.skillName ?? "General"}
                        {task.dueDate
                          ? ` · due ${new Date(task.dueDate).toLocaleDateString()}`
                          : ""}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                      task.priority ===
                      1
                        ? "bg-red-500/10 text-red-300"
                        : "bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {task.priority ===
                    1
                      ? "High Priority"
                      : "In Progress"}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {}
        <div className="space-y-8">
          <Section
            title="Application Pipeline"
            subtitle="Deadlines on your active applications"
            icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
            action={{ href: "/applications", label: "Open Kanban →" }}
            empty={
              data.upcomingDeadlines.length ===
              0
            }
            emptyMessage="Save internships to start tracking deadlines."
            hideActionWhenEmpty={false}
          >
            <div className="space-y-3 text-xs">
              {data.upcomingDeadlines.map((d) => {
                const days = Math.ceil(
                  (new Date(d.deadline).getTime() - Date.now()) /
                    (24 * 60 * 60 * 1000),
                )
                return (
                  <div
                    key={d.applicationId}
                    className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex justify-between items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">
                        {d.company}
                      </p>
                      <p className="text-[10px] text-purple-300 truncate">
                        {d.title}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/30 text-purple-200 font-bold text-[10px] shrink-0 ml-2 flex items-center gap-1">
                      <CalendarClock className="w-3 h-3" />{" "}
                      {days <=
                      0
                        ? "Closed"
                        : `${days}d`}
                    </span>
                  </div>
                )
              })}
              {data.applications.byStatus.saved ? (
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
                  <p className="font-bold text-zinc-300">
                    {data.applications.byStatus.saved} saved
                  </p>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 font-bold text-[10px]">
                    Saved
                  </span>
                </div>
              ) : null}
            </div>
          </Section>

          <div className="material-glass p-6 rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-purple-500/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  AI Mock Interview Hub
                </h4>
                <p className="text-xs text-zinc-400">
                  Technical, behavioral & HR rounds
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Run an AI simulator session and get per-answer feedback with
              scores that count toward your readiness score.
            </p>
            <Link href="/interviews" className="block">
              <button className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs transition shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2">
                Start AI Mock Session <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {}
          <Section
            title="Recent Activity"
            subtitle="Your latest actions"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            empty={
              data.recentActivity.length ===
              0
            }
            emptyMessage="Activity will appear as you use InternEdge."
            hideActionWhenEmpty
          >
            <div className="space-y-2.5">
              {data.recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-2 text-xs"
                >
                  <div className="min-w-0">
                    <p className="text-zinc-200 font-medium truncate">
                      {formatAction(log.action)}
                    </p>
                    {log.details && (
                      <p className="text-zinc-500 truncate">{log.details}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-600 shrink-0">
                    {timeAgo(log.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function atsComponentLabel(d: DashboardOverview): string {
  const c = d.readiness.components
  if (!c) return ""
  const weakest = Object.entries(c)
    .filter(
      ([, v]) =>
        v.weight >
        0,
    )
    .sort(
      (a, b) =>
        a[1].value -
        b[1].value,
    )[0]
  if (!weakest) return ""
  return `Weakest signal: ${
    weakest[0] ===
    "resumeQuality"
      ? "resume quality"
      : weakest[0].replace(/([A-Z])/g, " $1").toLowerCase()
  }`
}

function roadmapProgressLabel(d: DashboardOverview): string {
  const rp = d.readiness.components?.roadmapProgress?.value
  if (
    rp ==
      null ||
    d.readiness.score ===
      undefined
  )
    return "—"
  return `${Math.round(rp * 100)}%`
}

function roadmapProgressValue(d: DashboardOverview): number {
  const rp = d.readiness.components?.roadmapProgress?.value
  return rp == null ? 0 : Math.round(rp * 100)
}

function formatAction(action: string): string {
  return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function MetricCard({
  label,
  icon,
  value,
  sub,
  progress,
  progressCls,
}: {
  label: string
  icon: React.ReactNode
  value: string
  sub?: string | null
  progress?: number
  progressCls?: string
}) {
  return (
    <div className="material-glass p-5 rounded-3xl border border-white/10 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-400">{label}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-white font-mono">
          {value}
        </span>
      </div>
      {sub && <p className="text-[11px] text-zinc-500 mt-1 truncate">{sub}</p>}
      <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${progressCls}`}
          style={{ width: `${progress ?? 0}%` }}
        />
      </div>
    </div>
  )
}

function Section({
  title,
  subtitle,
  icon,
  action,
  children,
  empty,
  emptyMessage,
  hideActionWhenEmpty = true,
}: {
  title: string
  subtitle?: string
  icon: React.ReactNode
  action?: { href: string label: string }
  children: React.ReactNode
  empty: boolean
  emptyMessage: string
  hideActionWhenEmpty?: boolean
}) {
  return (
    <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            {icon} {title}
          </h3>
          {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
        </div>
        {action && (!empty || !hideActionWhenEmpty) && (
          <Link
            href={action.href}
            className="text-xs text-sky-400 hover:underline font-semibold shrink-0"
          >
            {action.label}
          </Link>
        )}
      </div>
      {empty ? (
        <p className="text-xs text-zinc-500 py-4 text-center">{emptyMessage}</p>
      ) : (
        children
      )}
    </div>
  )
}

function NewUserBanner() {
  return (
    <div className="material-glass p-5 rounded-3xl border border-sky-500/30 bg-sky-500/5 space-y-2">
      <h3 className="text-sm font-bold text-sky-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4" /> Get started with InternEdge
      </h3>
      <p className="text-xs text-zinc-300">
        Upload your resume for AI scoring → save matched internships → generate
        a skill roadmap. Every card above fills in with your real data as you
        go.
      </p>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="material-glass h-32 rounded-3xl animate-pulse"
          />
        ))}
      </div>
      <div className="material-glass h-64 rounded-3xl animate-pulse" />
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="material-glass p-8 rounded-3xl border border-red-500/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm font-bold text-white">
            Couldn&apos;t load dashboard
          </p>
          <p className="text-xs text-zinc-400">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}
