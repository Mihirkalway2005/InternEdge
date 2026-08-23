"use client" /* Share link */ /* Live preview */ /* Hero */ /* Skills */ /* Projects */ /* Experience */

import React, { useState } from "react"
import { api, useApi } from "@/lib/api-client"
import type { PortfolioRecord, Project } from "@/types"
import {
  Globe,
  ExternalLink,
  Code2,
  Sparkles,
  Mail,
  RefreshCw,
  Loader2,
  AlertCircle,
  Link2,
  CheckCircle2,
} from "lucide-react"

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Familiar",
  intermediate: "Proficient",
  advanced: "Advanced",
  expert: "Expert",
}

export default function PortfolioPage() {
  const {
    data: portfolio,
    loading,
    error,
    refetch,
  } = useApi<PortfolioRecord>("/api/portfolio")
  const [busy, setBusy] = useState<"regen" | "publish" | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const regenerate = async () => {
    setBusy("regen")
    setActionError(null)
    try {
      await api("/api/portfolio", { method: "PUT" })
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Regeneration failed")
    } finally {
      setBusy(null)
    }
  }

  const togglePublish = async () => {
    if (!portfolio) return
    setBusy("publish")
    try {
      await api("/api/portfolio", {
        method: "POST",
        body: JSON.stringify({ isPublic: !portfolio.isPublic }),
      })
      refetch()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Publish failed")
    } finally {
      setBusy(null)
    }
  }

  if (loading || !portfolio)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
      </div>
    )

  const data = portfolio.data
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${portfolio.slug}`
      : `/p/${portfolio.slug}`

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            AI Portfolio Generator{" "}
            <Globe className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Assembled live from your profile, projects & skills — regenerate any
            time
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={regenerate}
            disabled={busy != null}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50"
          >
            {busy === "regen" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh Data
          </button>
          <button
            onClick={togglePublish}
            disabled={busy != null}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 disabled:opacity-50 ${
              portfolio.isPublic
                ? "bg-red-500/10 border border-red-500/40 text-red-300 hover:bg-red-500/20"
                : "bg-emerald-500 hover:bg-emerald-400 text-black"
            }`}
          >
            {busy === "publish" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            {portfolio.isPublic ? "Unpublish" : "Publish Publicly"}
          </button>
        </div>
      </div>

      {actionError && (
        <div className="material-glass p-4 rounded-2xl border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {actionError}
        </div>
      )}

      {}
      {portfolio.isPublic && (
        <div className="material-glass p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-emerald-200 flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Live at{" "}
            <a
              href={`/p/${portfolio.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono underline truncate"
            >
              {shareUrl}
            </a>
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold shrink-0 flex items-center gap-1.5"
          >
            <Link2 className="w-3 h-3" /> {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}

      {}
      <div className="material-glass p-8 rounded-3xl border border-white/10 space-y-8 relative overflow-hidden">
        {!portfolio.isPublic && (
          <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-zinc-800 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Draft — private preview
          </span>
        )}

        {}
        <div className="space-y-3 border-b border-white/10 pb-8">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono ${
              data.graduationYear &&
              data.graduationYear >= new Date().getFullYear()
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
            }`}
          >
            {data.graduationYear
              ? `Class of ${data.graduationYear}`
              : "Student"}
            {data.university ? ` · ${data.university}` : ""}
          </span>
          <h2 className="text-4xl font-extrabold text-white">{data.name}</h2>
          <p className="text-sm font-semibold text-sky-300">{data.headline}</p>
          {data.bio && (
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              {data.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            {data.github && (
              <a
                href={data.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
              >
                <Code2 className="w-4 h-4 text-sky-400" /> GitHub
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
              >
                <ExternalLink className="w-4 h-4 text-sky-400" /> LinkedIn
              </a>
            )}
            {data.email && (
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Mail className="w-4 h-4 text-emerald-400" /> {data.email}
              </span>
            )}
          </div>
        </div>

        {}
        {data.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span
                  key={s.id}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-200"
                >
                  {s.name}
                  <span className="ml-1.5 text-[10px] text-zinc-500">
                    {LEVEL_LABEL[s.level] ?? s.level}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Projects
          </h3>
          {data.projects.length === 0 ? (
            <p className="text-xs text-zinc-500">
              No projects yet — add them on your Profile page.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(data.projects as Project[]).map((project) => (
                <div
                  key={project.id}
                  className="p-5 rounded-2xl material-titanium border border-white/10 space-y-3"
                >
                  <h4 className="text-base font-bold text-white">
                    {project.title}
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(project.techStack ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {(project.github || project.liveDemo) && (
                    <div className="flex gap-3 text-[11px] pt-1">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:underline"
                        >
                          Code ↗
                        </a>
                      )}
                      {project.liveDemo && (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline"
                        >
                          Live ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {}
        {data.experiences.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Experience
            </h3>
            <div className="space-y-3">
              {data.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-white">
                      {exp.role} ·{" "}
                      <span className="text-sky-300">{exp.company}</span>
                    </p>
                    <span className="text-[10px] text-zinc-500">
                      {exp.startDate}
                      {exp.endDate ? ` – ${exp.endDate}` : " – Present"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
