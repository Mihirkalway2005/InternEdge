"use client"
// Rejected can be revived to applied; others advance one step.
/* Detail modal */ /* Status history */

import React, { useMemo, useState } from "react"
import { api, useApi } from "@/lib/api-client"
import type {
  ApplicationItem,
  ApplicationStatus,
  ScoredInternship,
} from "@/types"
import {
  Kanban,
  Plus,
  ChevronRight,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Search,
} from "lucide-react"

const STAGES: ApplicationStatus[] = [
  "saved",
  "applied",
  "assessment",
  "interview",
  "hr",
  "offer",
  "rejected",
]

const STAGE_LABEL: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  assessment: "Online Assessment",
  interview: "Interview",
  hr: "HR Round",
  offer: "Offer",
  rejected: "Rejected",
}

const STAGE_COLOR: Record<ApplicationStatus, string> = {
  saved: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  applied: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  assessment: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  interview: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  hr: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  offer: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  rejected: "bg-red-500/10 text-red-400 border-red-500/30",
}

export default function ApplicationsPage() {
  const {
    data: apps,
    loading,
    error,
    refetch,
  } = useApi<ApplicationItem[]>("/api/applications")
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [movingId, setMovingId] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const map = new Map<ApplicationStatus, ApplicationItem[]>()
    for (const stage of STAGES) map.set(stage, [])
    for (const app of apps ??
      []) {
      map.get(app.status)?.push(app)
    }
    return map
  }, [apps])

  const moveStage = async (
    app: ApplicationItem,
    newStage: ApplicationStatus,
  ) => {
    if (
      app.status ===
      newStage
    )
      return
    setMovingId(app.id)
    try {
      await api(`/api/applications/${app.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStage }),
      })
      refetch()
    } catch (err) {
      console.error(err)
      refetch()
    } finally {
      setMovingId(null)
    }
  }

  const remove = async (id: string) => {
    setMovingId(id)
    try {
      await api(`/api/applications/${id}`, { method: "DELETE" })
      setSelectedApp(null)
      refetch()
    } catch (err) {
      console.error(err)
    } finally {
      setMovingId(null)
    }
  }

  if (loading && !apps)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
      </div>
    )

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Application Tracker <Kanban className="w-6 h-6 text-purple-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {apps?.length ??
              0}{" "}
            applications · every move is saved with full status history
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-black font-semibold text-xs transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {error && (
        <div className="material-glass p-6 rounded-3xl border border-red-500/30 flex items-center gap-3 text-sm text-red-300">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {!error &&
      (apps?.length ??
        0) ===
        0 ? (
        <div className="material-glass p-10 rounded-3xl border border-dashed border-white/15 text-center space-y-3">
          <Kanban className="w-8 h-8 mx-auto text-zinc-600" />
          <h3 className="text-base font-bold text-white">
            Your tracker is empty
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Browse internships and save the ones you like — they&apos;ll appear
            here so you can move them through Applied → Assessment → Interview →
            Offer.
          </p>
          <a
            href="/internships"
            className="inline-block px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs"
          >
            Discover Internships →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto pb-6">
          {STAGES.map((stage) => {
            const stageApps =
              grouped.get(stage) ??
              []
            return (
              <div key={stage} className="space-y-3 min-w-[200px]">
                <div className="p-3 rounded-2xl material-glass border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">
                    {STAGE_LABEL[stage]}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold ${STAGE_COLOR[stage].split(" ")[1]}`}
                  >
                    {stageApps.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[80px]">
                  {stageApps.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="p-4 rounded-2xl material-glass-interactive border border-white/10 space-y-2 cursor-pointer relative"
                    >
                      {movingId ===
                        app.id && (
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                        </div>
                      )}
                      <span className="text-xs font-bold text-sky-400">
                        {app.internship.company.name}
                      </span>
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                        {app.internship.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                        {app.internship.location}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500 border-t border-white/5">
                        <span>
                          {new Date(app.statusUpdatedAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const idx = STAGES.indexOf(stage)
                            if (stage === "rejected")
                              void moveStage(app, "applied")
                            else if (idx >= 0 && idx < STAGES.length - 2)
                              void moveStage(app, STAGES[idx + 1])
                          }}
                          disabled={
                            movingId === app.id ||
                            (stage !== "rejected" &&
                              STAGES.indexOf(stage) >= STAGES.length - 2)
                          }
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-40"
                          title={
                            stage === "rejected"
                              ? "Reopen as Applied"
                              : "Move to next stage"
                          }
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {stageApps.length === 0 && (
                    <div className="rounded-xl border border-dashed border-white/5 py-4 text-center text-[10px] text-zinc-700">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {}
      {selectedApp && (
        <ApplicationModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onMove={(s) =>
            moveStage(selectedApp, s).then(() => setSelectedApp(null))
          }
          onDelete={() => remove(selectedApp.id)}
        />
      )}

      {showAdd && (
        <AddModal onClose={() => setShowAdd(false)} onAdded={refetch} />
      )}
    </div>
  )
}

function ApplicationModal({
  app,
  onClose,
  onMove,
  onDelete,
}: {
  app: ApplicationItem
  onClose: () => void
  onMove: (s: ApplicationStatus) => void
  onDelete: () => void
}) {
  const [notes, setNotes] = useState(app.notes ?? "")
  const [savingNotes, setSavingNotes] = useState(false)

  const saveNotes = async () => {
    setSavingNotes(true)
    try {
      await api(`/api/applications/${app.id}`, {
        method: "PATCH",
        body: JSON.stringify({ notes }),
      })
    } catch (err) {
      console.error(err)
    } finally {
      setSavingNotes(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="material-glass p-6 rounded-3xl border border-white/10 max-w-lg w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <span className="text-xs font-bold text-sky-400">
              {app.internship.company.name}
            </span>
            <h3 className="text-lg font-bold text-white">
              {app.internship.title}
            </h3>
            <p className="text-xs text-zinc-400">
              {app.internship.location} · saved{" "}
              {new Date(app.savedAt).toLocaleDateString()}
              {app.internship.deadline &&
                ` · closes ${new Date(app.internship.deadline).toLocaleDateString()}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-zinc-300">Stage</span>
          <select
            value={app.status}
            onChange={(e) => onMove(e.target.value as ApplicationStatus)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none [&>option]:bg-zinc-900"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABEL[s]}
              </option>
            ))}
          </select>
        </label>

        {}
        {app.events && app.events.length > 0 && (
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-500">
              History
            </p>
            {[...app.events].reverse().map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between text-[11px]"
              >
                <span className="text-zinc-400 capitalize">
                  {ev.fromStatus ?? "created"} → {ev.toStatus}
                </span>
                <span className="text-zinc-600">
                  {new Date(ev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
            Notes{" "}
            {savingNotes && (
              <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
            )}
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
            rows={4}
            placeholder="Recruiter contacts, OA dates, prep notes…"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none resize-none"
          />
        </label>

        <div className="flex justify-between gap-2 pt-2">
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 text-xs font-bold flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 text-black font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function AddModal({
  onClose,
  onAdded,
}: {
  onClose: () => void
  onAdded: () => void
}) {
  const [search, setSearch] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)
  const query = `/api/internships?sort=match&limit=12${
    search.trim() ? `&q=${encodeURIComponent(search.trim())}` : ""
  }`
  const { data, loading } = useApi<{ items: ScoredInternship[] }>(query)

  const add = async (internshipId: string) => {
    setBusyId(internshipId)
    try {
      await api("/api/applications", {
        method: "POST",
        body: JSON.stringify({ internshipId, status: "applied" }),
      })
      onAdded()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="material-glass p-6 rounded-3xl border border-white/10 max-w-lg w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Track an application
          </h3>
          <button onClick={onClose}>
            <X className="w-4 h-4 text-zinc-400 hover:text-white" />
          </button>
        </div>
        <p className="text-[11px] text-zinc-500 -mt-2">
          Pick an internship you already applied to — it starts in
          &quot;Applied&quot;. To bookmark one first, save it from Discovery.
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search internships…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400"
          />
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2">
          {(data?.items ?? []).map(({ internship }) => (
            <button
              key={internship.id}
              onClick={() => add(internship.id)}
              disabled={busyId != null}
              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between gap-2 disabled:opacity-50"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {internship.title}
                </p>
                <p className="text-[10px] text-zinc-500">
                  {internship.company.name} · {internship.location}
                </p>
              </div>
              {busyId === internship.id ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-400 shrink-0" />
              ) : (
                <Plus className="w-4 h-4 text-sky-400 shrink-0" />
              )}
            </button>
          ))}
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin text-sky-400 mx-auto my-4" />
          )}
          {!loading && (data?.items ?? []).length === 0 && (
            <p className="text-xs text-zinc-500 text-center py-4">
              No internships found.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
