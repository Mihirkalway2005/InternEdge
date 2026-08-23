"use client"

// ---------------- Analyzer ----------------
/* Dropzone / current file */ /* Analysis results */

// ---------------- Improver ----------------

// ---------------- Shared bits ----------------

import React, { useCallback, useEffect, useRef, useState } from "react"
import { api, useApi } from "@/lib/api-client"
import type { ImprovementSet, ResumeListItem } from "@/types"
import {
  FileCheck2,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileText,
  RefreshCw,
  Star,
  Wand2,
} from "lucide-react"

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState<"analyzer" | "builder">("analyzer")
  const {
    data: resumes,
    loading,
    error,
    refetch,
  } = useApi<ResumeListItem[]>("/api/resumes")

  const latest =
    resumes?.[0] ??
    null

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            AI Resume Analyzer & Builder{" "}
            <FileCheck2 className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Upload a PDF → parsed & scored with a reproducible ATS breakdown
          </p>
        </div>
        <div className="flex gap-2 p-1.5 rounded-2xl material-glass border border-white/10">
          {(["analyzer", "builder"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab ===
                tab
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab ===
              "analyzer"
                ? "ATS Score Analyzer"
                : "AI Resume Improver"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Skeleton />
      ) : error ? (
        <StateCard
          tone="error"
          title="Couldn't load resumes"
          message={error}
          onRetry={refetch}
        />
      ) : activeTab ===
        "analyzer" ? (
        <AnalyzerTab resume={latest} onChanged={refetch} />
      ) : (
        <ImproverTab resume={latest} />
      )}
    </div>
  )
}

function AnalyzerTab({
  resume,
  onChanged,
}: {
  resume: ResumeListItem | null
  onChanged: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(
    async (file: File) => {
      setUploadError(null)
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return setUploadError("Only PDF files are supported")
      }
      setUploading(true)
      try {
        const form = new FormData()
        form.append("file", file)
        await api("/api/resumes", { method: "POST", body: form })
        onChanged()
      } catch (err) {
        setUploadError(
          err instanceof
            Error
            ? err.message
            : "Upload failed",
        )
      } finally {
        setUploading(false)
      }
    },
    [onChanged],
  )

  const reanalyze = async () => {
    if (!resume) return
    setUploading(true)
    try {
      await api(`/api/resumes/${resume.id}/analyze`, { method: "POST" })
      onChanged()
    } catch (err) {
      setUploadError(
        err instanceof
          Error
          ? err.message
          : "Analysis failed",
      )
    } finally {
      setUploading(false)
    }
  }

  const analysis =
    resume?.analysis ??
    null
  const isProcessing =
    uploading ||
    resume?.status ===
      "uploaded" ||
    resume?.status ===
      "parsed"

  return (
    <div className="space-y-8">
      {}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          void upload(e.dataTransfer.files[0])
        }}
        className={`material-glass p-8 rounded-3xl border transition ${
          dragOver ? "border-sky-400 bg-sky-500/10" : "border-white/10"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 min-w-0">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Your Resume
            </span>
            <h2 className="text-2xl font-extrabold text-white truncate">
              {resume?.fileName ??
                "No resume uploaded yet"}
            </h2>
            {resume && (
              <p className="text-xs text-zinc-400 flex items-center gap-2">
                Status:
                <StatusPill
                  status={resume.status}
                  message={resume.statusMessage}
                />
              </p>
            )}
          </div>

          {resume?.status ===
            "analyzed" && (
            <ScoreDial
              score={Math.round(
                resume.atsScore ??
                  0,
              )}
            />
          )}

          <div className="flex gap-2 shrink-0">
            {!isProcessing && (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    upload(e.target.files[0])
                  }
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs flex items-center gap-2 hover:opacity-95"
                >
                  <Upload className="w-4 h-4" />{" "}
                  {resume ? "Upload New Version" : "Upload Resume (PDF)"}
                </button>
                {resume && (
                  <button
                    onClick={reanalyze}
                    disabled={uploading}
                    className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-bold text-xs text-white flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${uploading ? "animate-spin" : ""}`}
                    />{" "}
                    Re-analyze
                  </button>
                )}
              </>
            )}
            {isProcessing && (
              <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs font-bold">
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploading ? "Uploading & analyzing…" : "Finishing analysis…"}
              </div>
            )}
          </div>
        </div>

        {uploadError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {uploadError}
          </div>
        )}
        {!resume && !uploadError && (
          <p className="mt-4 text-xs text-zinc-500 text-center">
            Drag & drop a PDF here, or use the button. Max 5 MB. Text-based PDFs
            only (no scans).
          </p>
        )}
      </div>

      {}
      {resume?.status ===
        "failed" && (
        <StateCard
          tone="error"
          title="Resume processing failed"
          message={
            resume.statusMessage ??
            "Try a different PDF"
          }
          onRetry={() => fileRef.current?.click()}
        />
      )}

      {analysis && (
        <>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {analysis.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {Object.entries(analysis.dimensions).map(([key, value]) => (
              <div
                key={key}
                className="material-glass p-4 rounded-2xl border border-white/10 space-y-2"
              >
                <span className="text-[11px] text-zinc-400 font-semibold capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <p className="text-xl font-bold text-white font-mono">
                  {value}%
                </p>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      value >=
                      70
                        ? "bg-emerald-400"
                        : value >=
                            45
                          ? "bg-amber-400"
                          : "bg-red-400"
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {(analysis.matchedKeywords.length >
            0 ||
            analysis.missingKeywords.length >
              0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KeywordList
                title="Matched Keywords"
                keywords={analysis.matchedKeywords.slice(0, 18)}
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                cls="text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
              />
              <KeywordList
                title="Missing Keywords"
                keywords={analysis.missingKeywords.slice(0, 12)}
                icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
                cls="text-amber-300 border-amber-500/30 bg-amber-500/10"
              />
            </div>
          )}

          <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Recommended
              Improvements
            </h3>
            <div className="space-y-3">
              {analysis.suggestions.map((s, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    s.priority ===
                    "high"
                      ? "bg-amber-500/10 border-amber-500/20"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  {s.priority ===
                  "high" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-bold text-white">
                      {s.title}
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-zinc-500">
                        {s.priority}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-300">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!resume && <EmptyAnalyzer />}
    </div>
  )
}

function EmptyAnalyzer() {
  return (
    <div className="material-glass p-10 rounded-3xl border border-dashed border-white/15 text-center space-y-3">
      <FileText className="w-10 h-10 mx-auto text-zinc-600" />
      <h3 className="text-base font-bold text-white">How it works</h3>
      <ol className="text-xs text-zinc-400 space-y-1.5 max-w-md mx-auto list-decimal list-inside text-left">
        <li>Upload a text-based PDF of your resume</li>
        <li>We extract and structure your education, experience & skills</li>
        <li>A deterministic ATS engine + LLM critique produce your score</li>
        <li>Fix the flagged issues and re-upload to watch your score climb</li>
      </ol>
    </div>
  )
}

function ImproverTab({ resume }: { resume: ResumeListItem | null }) {
  const [targetRole, setTargetRole] = useState("")
  const [jdText, setJdText] = useState("")
  const [result, setResult] = useState<ImprovementSet | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = async () => {
    if (!resume) return
    setBusy(true)
    setError(null)
    setResult(null)
    try {
      const res = await api<ImprovementSet>(
        `/api/resumes/${resume.id}/improve`,
        {
          method: "POST",
          body: JSON.stringify({
            targetRole:
              targetRole ||
              undefined,
            jdText:
              jdText ||
              undefined,
          }),
        },
      )
      setResult(res)
    } catch (err) {
      setError(
        err instanceof
          Error
          ? err.message
          : "Improvement failed",
      )
    } finally {
      setBusy(false)
    }
  }

  if (
    !resume ||
    resume.status !==
      "analyzed"
  ) {
    return (
      <StateCard
        tone="info"
        title="Analyze a resume first"
        message="The AI improver works from your uploaded, analyzed resume. Switch to the analyzer tab and upload one."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-amber-400" /> Constrained AI
          Suggestions
        </h3>
        <p className="text-xs text-zinc-400 -mt-2">
          The model may only rephrase content you already have — additions are
          clearly flagged and require your judgment. Nothing overwrites your
          stored resume automatically.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-zinc-300">
              Target Role (optional)
            </span>
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Backend Engineering Intern"
              className={inputCls}
            />
          </label>
          <label className="space-y-1.5 block">
            <span className="text-xs font-bold text-zinc-300">
              Paste Job Description (optional)
            </span>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              rows={2}
              placeholder="Tailors suggestions to a specific listing…"
              className={`${inputCls} resize-none`}
            />
          </label>
        </div>
        <button
          onClick={run}
          disabled={busy}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs flex items-center gap-2 hover:opacity-95 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Generate Suggestions
        </button>
        {error && <p className="text-xs text-red-300">{error}</p>}
      </div>

      {result && (
        <div className="space-y-3">
          {result.generalNotes.length >
            0 && (
            <div className="material-glass p-4 rounded-2xl border border-white/10 space-y-1">
              {result.generalNotes.map((n, i) => (
                <p key={i} className="text-xs text-zinc-300">
                  • {n}
                </p>
              ))}
            </div>
          )}
          {result.suggestions.map((s, i) => (
            <div
              key={i}
              className={`material-glass p-5 rounded-2xl border space-y-2 ${
                s.isAddition ? "border-sky-500/30" : "border-white/10"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  {s.section}
                </span>
                {s.isAddition ? (
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-[10px] font-bold text-sky-200">
                    Suggested Addition — verify before using
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-bold text-purple-200">
                    Rewrite · confidence{" "}
                    {Math.round(
                      s.confidence *
                        100,
                    )}
                    %
                  </span>
                )}
              </div>
              {s.originalText && (
                <p className="text-xs text-zinc-500 line-through decoration-red-400/50">
                  {s.originalText}
                </p>
              )}
              <p className="text-xs text-emerald-200 font-mono leading-relaxed">
                {s.suggestedRewrite}
              </p>
              <p className="text-[11px] text-zinc-400">
                <span className="font-bold text-zinc-300">Why:</span>{" "}
                {s.rationale}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400"

function ScoreDial({ score }: { score: number }) {
  const passed = score >= 70
  return (
    <div
      className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${
        passed
          ? "border-emerald-400 bg-emerald-500/10"
          : score >= 45
            ? "border-amber-400 bg-amber-500/10"
            : "border-red-400 bg-red-500/10"
      }`}
    >
      <span className="text-3xl font-extrabold text-white font-mono">
        {score}
      </span>
      <span
        className={`text-[10px] font-bold uppercase ${
          passed
            ? "text-emerald-300"
            : score >= 45
              ? "text-amber-300"
              : "text-red-300"
        }`}
      >
        {passed ? "Passed" : score >= 45 ? "Needs Work" : "At Risk"}
      </span>
    </div>
  )
}

function StatusPill({
  status,
  message,
}: {
  status: string
  message?: string | null
}) {
  if (status === "analyzed")
    return <span className="text-emerald-300 font-semibold">Analyzed ✓</span>
  if (status === "failed")
    return (
      <span className="text-red-300 font-semibold">
        Failed{message ? ` — ${message}` : ""}
      </span>
    )
  if (status === "parsed")
    return (
      <span className="text-amber-300 font-semibold">Parsed — analyzing…</span>
    )
  return <span className="text-zinc-300">Uploaded…</span>
}

function KeywordList({
  title,
  keywords,
  icon,
  cls,
}: {
  title: string
  keywords: string[]
  icon: React.ReactNode
  cls: string
}) {
  return (
    <div className="material-glass p-4 rounded-2xl border border-white/10 space-y-3">
      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
        {icon} {title}
      </h4>
      {keywords.length === 0 ? (
        <p className="text-[11px] text-zinc-500">None detected.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((k) => (
            <span
              key={k}
              className={`px-2 py-0.5 rounded-md border text-[10px] font-mono ${cls}`}
            >
              {k}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function StateCard({
  tone,
  title,
  message,
  onRetry,
}: {
  tone: "error" | "info"
  title: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div
      className={`material-glass p-8 rounded-3xl border ${
        tone === "error" ? "border-red-500/30" : "border-sky-500/30"
      } text-center space-y-2`}
    >
      {tone === "error" ? (
        <AlertTriangle className="w-8 h-8 mx-auto text-red-400" />
      ) : (
        <Star className="w-8 h-8 mx-auto text-sky-400" />
      )}
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {message && (
        <p className="text-xs text-zinc-400 max-w-md mx-auto">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white"
        >
          Try Again
        </button>
      )}
    </div>
  )
}

function Skeleton() {
  return <div className="material-glass h-48 rounded-3xl animate-pulse" />
}
