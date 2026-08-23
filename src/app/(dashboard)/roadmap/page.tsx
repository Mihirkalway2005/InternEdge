"use client" /* Progress header */

// Group by week.

import React, { useState } from "react"
import Link from "next/link"
import { api, useApi } from "@/lib/api-client"
import type { RoadmapItem, RoadmapTaskItem } from "@/types"
import {
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Loader2,
  AlertCircle,
  ExternalLink,
  X,
} from "lucide-react"

export default function RoadmapPage() {
  const {
    data: roadmaps,
    loading,
    error,
    refetch,
  } = useApi<RoadmapItem[]>("/api/roadmaps")
  const active = roadmaps?.find((r) => r.isActive) ?? roadmaps?.[0] ?? null
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)

  const generate = async () => {
    setGenerating(true)
    setGenError(null)
    try {
      await api("/api/roadmaps", { method: "POST" })
      refetch()
    } catch (err) {
      setGenError(
        err instanceof
          Error
          ? err.message
          : "Generation failed",
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Learning Roadmap <Compass className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Generated from your actual skill gaps and target roles
          </p>
        </div>
        <button
          onClick={generate}
          disabled={generating}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold text-xs transition flex items-center gap-2 disabled:opacity-60"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {active ? "Regenerate Roadmap" : "Generate Roadmap"}
        </button>
      </div>

      {genError && (
        <div className="material-glass p-4 rounded-3xl border border-red-500/30 flex items-center gap-3 text-sm text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" /> {genError}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
        </div>
      ) : !active ? (
        <div className="material-glass p-10 rounded-3xl border border-dashed border-white/15 text-center space-y-3">
          <Compass className="w-8 h-8 mx-auto text-zinc-600" />
          <h3 className="text-base font-bold text-white">No roadmap yet</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Hit{" "}
            <span className="text-amber-300 font-bold">Generate Roadmap</span> —
            we&apos;ll analyze your skills vs the roles you&apos;re targeting
            (and internships you&apos;ve saved), then build a week-by-week plan
            closing your biggest gaps first.
          </p>
        </div>
      ) : (
        <>
          {}
          <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {active.title ??
                    `${active.targetRole} Readiness`}
                </h2>
                <p className="text-xs text-zinc-500">
                  Target role: {active.targetRole}
                </p>
              </div>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {active.overallProgress}%
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${active.overallProgress}%` }}
              />
            </div>
          </div>

          <TaskList
            tasks={active.tasks}
            onChanged={refetch}
            roadmapId={active.id}
          />
        </>
      )}
    </div>
  )
}

function TaskList({
  tasks,
  onChanged,
  roadmapId,
}: {
  tasks: RoadmapTaskItem[]
  onChanged: () => void
  roadmapId: string
}) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [adding, setAdding] = useState(false)

  const toggle = async (task: RoadmapTaskItem) => {
    setBusyId(task.id)
    try {
      await api(`/api/roadmap-tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !task.completed }),
      })
      onChanged()
    } catch (err) {
      console.error(err)
    } finally {
      setBusyId(null)
    }
  }

  const addTask = async () => {
    if (!newTitle.trim()) return
    setAdding(true)
    try {
      await api(`/api/roadmaps/${roadmapId}/tasks`, {
        method: "POST",
        body: JSON.stringify({ title: newTitle.trim() }),
      })
      setNewTitle("")
      setShowAdd(false)
      onChanged()
    } catch (err) {
      console.error(err)
    } finally {
      setAdding(false)
    }
  }
  const weeks = new Map<number, RoadmapTaskItem[]>()
  for (const t of tasks) {
    const w = t.week ?? 0
    if (!weeks.has(w)) weeks.set(w, [])
    weeks.get(w)!.push(t)
  }
  const sortedWeeks = [...weeks.keys()].sort((a, b) => a - b)

  return (
    <div className="space-y-6">
      {sortedWeeks.map((week) => (
        <div
          key={week}
          className="material-glass p-6 rounded-3xl border border-white/10 space-y-4"
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            {week > 0 ? `Week ${week}` : "Extra Tasks"}
            <span className="text-[10px] font-normal normal-case text-zinc-500">
              {
                tasks
                  .filter((t) => (t.week ?? 0) === week)
                  .filter((t) => t.completed).length
              }
              /{tasks.filter((t) => (t.week ?? 0) === week).length} done
            </span>
          </h3>

          <div className="space-y-3">
            {[...weeks.get(week)!]
              .sort((a, b) => a.priority - b.priority)
              .map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    task.completed
                      ? "bg-emerald-500/[0.04] border-emerald-500/20"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <button
                    onClick={() => toggle(task)}
                    disabled={busyId === task.id}
                    className="flex items-center gap-3 min-w-0 text-left group"
                  >
                    {busyId === task.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-sky-400 shrink-0" />
                    ) : task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600 group-hover:text-sky-400 shrink-0 transition" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${
                          task.completed
                            ? "text-zinc-500 line-through"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                        {task.category && <>{task.category} ·</>}
                        {task.skillName && (
                          <span className="text-sky-400/80">
                            {task.skillName} ·
                          </span>
                        )}
                        {task.dueDate && (
                          <>
                            due {new Date(task.dueDate).toLocaleDateString()} ·
                          </>
                        )}
                        {task.priority === 1 && (
                          <span className="text-red-300">high priority</span>
                        )}
                        {!task.category &&
                          !task.skillName &&
                          !task.dueDate &&
                          task.priority !== 1 &&
                          "self-paced"}
                      </span>
                    </div>
                  </button>
                  <div className="shrink-0 flex items-center gap-2">
                    {task.resourceUrl && (
                      <a
                        href={task.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open resource"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {task.priority === 1 && !task.completed && (
                      <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-300 text-[9px] font-bold uppercase">
                        P1
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => setShowAdd(true)}
        className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add Your Own Task
      </button>

      {showAdd && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="material-glass p-6 rounded-3xl border border-white/10 max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">New task</h3>
              <button onClick={() => setShowAdd(false)}>
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void addTask()}
              placeholder="e.g. Finish React Server Components tutorial"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs font-semibold text-zinc-300"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                disabled={adding || !newTitle.trim()}
                className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {adding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}{" "}
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-center text-[11px] text-zinc-600">
        Completed tasks raise your AI Readiness Score ·{" "}
        <Link href="/dashboard" className="text-sky-400 hover:underline">
          see it on your dashboard →
        </Link>
      </p>
    </div>
  )
}
