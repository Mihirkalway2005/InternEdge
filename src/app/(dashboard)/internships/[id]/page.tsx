"use client"

import React, { useCallback, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { api, useApi, daysLeft } from "@/lib/api-client"
import type { ApplicationItem } from "@/types"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Bookmark,
  Loader2,
  AlertCircle,
} from "lucide-react"

type DetailResponse = {
  internship: {
    id: string
    title: string
    description: string
    location: string
    workType: string
    salary?: string | null
    stipendMin?: number | null
    stipendMax?: number | null
    deadline: string
    requiredSkills: string[]
    applicationUrl?: string | null
    company: {
      name: string
      website?: string | null
      description: string
      industry: string
    }
  }
  match: {
    score: number
    matchedSkills: string[]
    missingSkills: string[]
    reasons: string[]
    breakdown?: Record<string, number>
  } | null
  application: { id: string status: string } | null
}

export default function InternshipDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data, loading, error, refetch } = useApi<DetailResponse>(
    `/api/internships/${params.id}`,
  )
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const addToTracker = useCallback(async () => {
    if (!data) return
    setBusy(true)
    setActionError(null)
    try {
      await api("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          internshipId: data.internship.id,
          status: "saved",
        }),
      })
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to add")
    } finally {
      setBusy(false)
    }
  }, [data, refetch])

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
      </div>
    )
  if (error || !data)
    return (
      <div className="max-w-3xl mx-auto material-glass p-8 rounded-3xl border border-red-500/30 space-y-3">
        <AlertCircle className="w-6 h-6 text-red-400" />
        <p className="text-sm font-bold text-white">
          Couldn&apos;t load this internship
        </p>
        <p className="text-xs text-zinc-400">{error ?? "Not found"}</p>
        <Link
          href="/internships"
          className="text-xs text-sky-400 hover:underline"
        >
          ← Back to discovery
        </Link>
      </div>
    )

  const { internship, match, application } = data

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link
        href="/internships"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to discovery
      </Link>

      <div className="material-glass p-8 rounded-3xl border border-white/10 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <span className="text-sm font-bold text-sky-400">
              {internship.company.name}
            </span>
            <h1 className="text-2xl font-extrabold text-white">
              {internship.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-400 pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {internship.location} · {internship.workType}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {daysLeft(internship.deadline)}
              </span>
              {(internship.salary || internship.stipendMin != null) && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  {internship.salary ??
                    `${internship.stipendMin}–${internship.stipendMax}`}
                </span>
              )}
            </div>
          </div>
          {match && (
            <div
              className={`px-4 py-2 rounded-full text-sm font-bold font-mono border ${
                match.score >= 70
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : match.score >= 45
                    ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
                    : "bg-white/10 text-zinc-300 border-white/10"
              }`}
            >
              <ShieldCheck className="w-4 h-4 inline mr-1" />
              {match.score}% Match
            </div>
          )}
        </div>

        {application ? (
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
            <p className="text-xs font-bold text-purple-200 capitalize">
              In your tracker · stage: {application.status}
            </p>
            <Link
              href="/applications"
              className="text-xs text-purple-300 hover:underline font-semibold"
            >
              Open Kanban →
            </Link>
          </div>
        ) : (
          <button
            onClick={addToTracker}
            disabled={busy}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold text-xs flex items-center gap-2 hover:opacity-95 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            Add to Application Tracker
          </button>
        )}
        {actionError && <p className="text-xs text-red-300">{actionError}</p>}

        {match && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Match breakdown
            </h4>
            {match.reasons.map((r) => (
              <p
                key={r}
                className="text-[11px] text-zinc-300 flex items-start gap-1.5"
              >
                <span className="text-sky-400">•</span>
                {r}
              </p>
            ))}
          </div>
        )}

        <div>
          <h3 className="text-base font-bold text-white mb-2">
            About the role
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
            {internship.description}
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-white mb-2">
            About {internship.company.name}
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {internship.company.description}
          </p>
        </div>

        {internship.requiredSkills.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-white mb-2">
              Requirements
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {internship.requiredSkills.map((skill: string) => {
                const has = match?.matchedSkills.includes(skill.toLowerCase())
                return (
                  <div
                    key={skill}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-white"
                  >
                    {has ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                    )}{" "}
                    {skill}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {match?.missingSkills && match.missingSkills.length > 0 && (
          <Link
            href="/roadmap"
            className="block p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 hover:bg-amber-500/15 transition"
          >
            You&apos;re missing {match.missingSkills.length} skills for this
            role — generate a learning roadmap →
          </Link>
        )}

        {internship.applicationUrl && (
          <a
            href={internship.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs text-center"
          >
            Apply on Company Site ↗
          </a>
        )}
      </div>
    </div>
  )
}
