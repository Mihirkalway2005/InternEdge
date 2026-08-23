"use client"

// Debounce search input into the query.
/* Filters */ /* List */ /* Detail */

import React, { Suspense, useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { api, useApi, daysLeft } from "@/lib/api-client"
import type { ApplicationItem, ScoredInternship } from "@/types"
import {
  Search,
  Briefcase,
  MapPin,
  Calendar,
  ShieldCheck,
  Bookmark,
  Check,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react"

const WORK_TYPES = ["all", "remote", "hybrid", "onsite"] as const

export default function InternshipsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
        </div>
      }
    >
      <InternshipsContent />
    </Suspense>
  )
}

function InternshipsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get("id")

  const [searchInput, setSearchInput] = useState("")
  const [workType, setWorkType] = useState<string>("all")
  const [sort, setSort] = useState<"match" | "deadline">("match")
  const [page, setPage] = useState(1)

  const query = useMemo(() => {
    const params = new URLSearchParams({
      sort,
      page: String(page),
      limit: "24",
    })
    if (searchInput.trim()) params.set("q", searchInput.trim())
    if (
      workType !==
      "all"
    )
      params.set("workType", workType)
    return `/api/internships?${params.toString()}`
  }, [searchInput, workType, sort, page])
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350)
    return () => clearTimeout(t)
  }, [query])

  const { data, loading, error } = useApi<{
    items: ScoredInternship[]
    total: number
    page: number
  }>(debouncedQuery)
  const { data: appsData, refetch: refetchApps } =
    useApi<ApplicationItem[]>("/api/applications")

  const savedIds = useMemo(
    () => new Set((appsData ?? []).map((a) => a.internship.id)),
    [appsData],
  )

  const items = data?.items ?? []
  const selected =
    items.find((i) => i.internship.id === selectedId) ?? items[0] ?? null

  const toggleSave = useCallback(
    async (internshipId: string) => {
      const existing = (appsData ?? []).find(
        (a) => a.internship.id === internshipId,
      )
      try {
        if (existing) {
          await api(`/api/applications/${existing.id}`, { method: "DELETE" })
        } else {
          await api("/api/applications", {
            method: "POST",
            body: JSON.stringify({ internshipId, status: "saved" }),
          })
        }
        refetchApps()
      } catch (err) {
        console.error(err)
      }
    },
    [appsData, refetchApps],
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Internship Discovery <Briefcase className="w-6 h-6 text-sky-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {data ? `${data.total} active listings` : "Loading…"} — match scores
            computed from your profile
          </p>
        </div>
        <Link
          href="/applications"
          className="text-xs text-sky-400 hover:underline font-semibold"
        >
          View tracker →
        </Link>
      </div>

      {}
      <div className="material-glass p-4 rounded-3xl border border-white/10 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setPage(1)
            }}
            placeholder="Search title, company, description…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400"
          />
        </div>
        <div className="flex gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
          {WORK_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => {
                setWorkType(t)
                setPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition ${
                workType === t
                  ? "bg-sky-500 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as "match" | "deadline")
            setPage(1)
          }}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none [&>option]:bg-zinc-900"
        >
          <option value="match">Best match</option>
          <option value="deadline">Closing soon</option>
        </select>
      </div>

      {error && (
        <div className="material-glass p-6 rounded-3xl border border-red-500/30 flex items-center gap-3 text-sm text-red-300">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {loading && !data ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="material-glass p-10 rounded-3xl border border-dashed border-white/15 text-center space-y-2">
          <Briefcase className="w-8 h-8 mx-auto text-zinc-600" />
          <h3 className="text-sm font-bold text-white">
            No internships match your filters
          </h3>
          <p className="text-xs text-zinc-500">
            Try clearing the search or switching work type.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {}
          <div className="lg:col-span-5 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
            {items.map(({ internship, match }) => {
              const isSaved = savedIds.has(internship.id)
              return (
                <div
                  key={internship.id}
                  onClick={() =>
                    router.push(`/internships?id=${internship.id}`, {
                      scroll: false,
                    })
                  }
                  className={`p-4 rounded-2xl border space-y-2 cursor-pointer transition ${
                    selected?.internship.id === internship.id
                      ? "material-glass border-sky-400/50"
                      : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-sky-400 truncate">
                      {internship.company.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        void toggleSave(internship.id)
                      }}
                      title={
                        isSaved ? "Remove from tracker" : "Save to tracker"
                      }
                      className={`p-1.5 rounded-lg transition ${
                        isSaved
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-zinc-500 hover:text-white bg-white/5"
                      }`}
                    >
                      {isSaved ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {internship.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {internship.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {daysLeft(internship.deadline)}
                    </span>
                  </div>
                  {match && match.score != null && (
                    <MatchBadge score={match.score} />
                  )}
                </div>
              )
            })}

            {data && data.total > data.page * 24 && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2"
              >
                Load more ({data.total - data.page * 24} remaining){" "}
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {}
          <div className="lg:col-span-7">
            {selected && (
              <DetailPanel
                item={selected}
                isSaved={savedIds.has(selected.internship.id)}
                onToggleSave={() => toggleSave(selected.internship.id)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function MatchBadge({ score }: { score: number }) {
  return (
    <div
      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold font-mono border ${
        score >= 70
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
          : score >= 45
            ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
            : "bg-white/10 text-zinc-300 border-white/10"
      }`}
    >
      <ShieldCheck className="w-3.5 h-3.5 mr-1.5 inline" /> {score}% Match
    </div>
  )
}

function DetailPanel({
  item,
  isSaved,
  onToggleSave,
}: {
  item: ScoredInternship
  isSaved: boolean
  onToggleSave: () => void
}) {
  const { internship, match } = item
  return (
    <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-5 sticky top-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <span className="text-xs font-bold text-sky-400">
            {internship.company.name}
          </span>
          <h2 className="text-xl font-extrabold text-white">
            {internship.title}
          </h2>
          <div className="flex flex-wrap gap-3 text-[11px] text-zinc-400 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {internship.location} · {internship.workType}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {daysLeft(internship.deadline)}
            </span>
            {internship.salary && <span>💰 {internship.salary}</span>}
          </div>
        </div>
        {match?.score != null && <MatchBadge score={match.score} />}
      </div>

      {match && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Why this match
          </h4>
          <ul className="space-y-1">
            {match.reasons.map((r) => (
              <li
                key={r}
                className="text-[11px] text-zinc-300 flex items-start gap-1.5"
              >
                <span className="text-sky-400 mt-0.5">•</span> {r}
              </li>
            ))}
          </ul>
          {match.missingSkills.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-amber-300 font-semibold mb-1">
                Skills to build
              </p>
              <div className="flex flex-wrap gap-1.5">
                {match.missingSkills.slice(0, 8).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <h4 className="text-sm font-bold text-white mb-2">Description</h4>
        <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line line-clamp-6">
          {internship.description}
        </p>
      </div>

      {internship.requiredSkills.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-white mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {internship.requiredSkills.map((s) => {
              const matched = match?.matchedSkills.includes(s.toLowerCase())
              return (
                <span
                  key={s}
                  className={`px-2.5 py-1 rounded-md border text-[11px] ${
                    matched
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                      : "border-white/10 bg-white/5 text-zinc-300"
                  }`}
                >
                  {matched ? "✓ " : ""}
                  {s}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          onClick={onToggleSave}
          className={`flex-1 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
            isSaved
              ? "bg-red-500/10 border border-red-500/40 text-red-300 hover:bg-red-500/20"
              : "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white hover:opacity-95"
          }`}
        >
          {isSaved ? <>Remove from Tracker</> : <>+ Add to Tracker</>}
        </button>
        {internship.applicationUrl && (
          <a
            href={internship.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs flex items-center gap-2"
          >
            Apply <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}
