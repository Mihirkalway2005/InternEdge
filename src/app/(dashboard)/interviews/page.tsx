"use client" /* Track selection */ /* History */
// busy resets when parent swaps view; keep spinner on failure only

// ---------------- Session runner ----------------

// Completed or viewing a past session → summary.
/* Question */ /* Last evaluation feedback */ /* Answer input */ /* Full transcript */

import React, { useState } from "react"
import { api, useApi } from "@/lib/api-client"
import type {
  AnswerEvaluationResult,
  InterviewSession,
  InterviewTrack,
} from "@/types"
import {
  Bot,
  Play,
  Award,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
  History,
  Code2,
} from "lucide-react"

const TRACKS: {
  value: InterviewTrack
  label: string
  desc: string
  color: string
  icon: React.ReactNode
}[] = [
  {
    value: "technical",
    label: "Technical & Systems",
    desc: "Algorithms, system design, web internals.",
    color: "sky",
    icon: <Bot className="w-6 h-6" />,
  },
  {
    value: "coding",
    label: "Coding & DSA",
    desc: "Data structures & algorithm reasoning.",
    color: "emerald",
    icon: <Code2 className="w-6 h-6" />,
  },
  {
    value: "behavioral",
    label: "Behavioral STAR",
    desc: "Conflict, leadership, deadline stories.",
    color: "amber",
    icon: <Award className="w-6 h-6" />,
  },
  {
    value: "hr",
    label: "HR & Fit",
    desc: "Motivation, goals, culture alignment.",
    color: "purple",
    icon: <Clock className="w-6 h-6" />,
  },
]

const COLOR_CLS: Record<string, {
  border: string
  bg: string
  text: string
  btn: string
}> = {
  sky: {
    border: "border-sky-400/50",
    bg: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    text: "text-sky-400",
    btn: "bg-sky-500 hover:bg-sky-400",
  },
  emerald: {
    border: "border-emerald-400/50",
    bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    text: "text-emerald-400",
    btn: "bg-emerald-500 hover:bg-emerald-400",
  },
  amber: {
    border: "border-amber-400/50",
    bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    text: "text-amber-400",
    btn: "bg-amber-500 hover:bg-amber-400",
  },
  purple: {
    border: "border-purple-400/50",
    bg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    text: "text-purple-400",
    btn: "bg-purple-500 hover:bg-purple-400",
  },
}

export default function InterviewsPage() {
  const [session, setSession] = useState<InterviewSession | null>(null)
  const { data: history, refetch } =
    useApi<InterviewSession[]>("/api/interviews")

  if (session) {
    return (
      <SessionRunner
        session={session}
        onEnd={() => {
          setSession(null)
          refetch()
        }}
      />
    )
  }

  const past = (
    history ??
    []
  ).filter(
    (h) =>
      h.status ===
      "completed",
  )
  const inProgress = (
    history ??
    []
  ).find(
    (h) =>
      h.status ===
      "in_progress",
  )

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          AI Mock Interview Hub <Bot className="w-6 h-6 text-sky-400" />
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Every answer is evaluated by AI — scores feed your readiness score
        </p>
      </div>

      {inProgress && (
        <div className="material-glass p-4 rounded-2xl border border-sky-500/30 flex items-center justify-between">
          <p className="text-xs font-bold text-sky-200">
            Resume your unfinished {inProgress.track} session
          </p>
          <button
            onClick={() => setSession(inProgress)}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold"
          >
            Continue →
          </button>
        </div>
      )}

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {TRACKS.map((track) => {
          const c = COLOR_CLS[track.color]
          return (
            <StartCard
              key={track.value}
              track={track}
              cls={c}
              onStart={(difficulty) =>
                startSession(track.value, difficulty).then(setSession)
              }
            />
          )
        })}
      </div>

      {}
      <div className="material-glass p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-zinc-400" /> Session History
        </h3>
        {past.length ===
        0 ? (
          <p className="text-xs text-zinc-500 py-3 text-center">
            No completed sessions yet — finish one to build your score history.
          </p>
        ) : (
          <div className="space-y-2">
            {[...past]
              .reverse()
              .slice(0, 8)
              .map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSession(h)}
                  className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-left"
                >
                  <div>
                    <p className="text-xs font-bold text-white capitalize">
                      {h.title ??
                        `${h.track} session`}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {new Date(h.startedAt).toLocaleDateString()} ·{" "}
                      {h.durationSec
                        ? `${Math.round(
                            h.durationSec /
                              60,
                          )} min`
                        : "—"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      (h.score ??
                        0) >=
                      70
                        ? "bg-emerald-500/20 text-emerald-300"
                        : (h.score ??
                              0) >=
                            45
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-red-500/10 text-red-300"
                    }`}
                  >
                    {Math.round(
                      h.score ??
                        0,
                    )}
                    /100
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

async function startSession(
  track: InterviewTrack,
  difficulty: string,
): Promise<InterviewSession> {
  return api<InterviewSession>("/api/interviews", {
    method: "POST",
    body: JSON.stringify({ track, difficulty }),
  })
}

function StartCard({
  track,
  cls,
  onStart,
}: {
  track: typeof TRACKS[number]
  cls: typeof COLOR_CLS["sky"]
  onStart: (difficulty: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const go = async (difficulty: string) => {
    setBusy(true)
    setError(null)
    try {
      onStart(difficulty)
    } catch (err) {
      setError(
        err instanceof
          Error
          ? err.message
          : "Failed to start session",
      )
      setBusy(false)
    }
    setTimeout(() => setBusy(false), 15000)
  }

  return (
    <div
      className={`p-6 rounded-3xl border space-y-4 transition ${cls.border} material-glass`}
    >
      <div className={`p-3.5 rounded-2xl w-fit ${cls.bg}`}>{track.icon}</div>
      <h3 className="text-lg font-bold text-white">{track.label}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{track.desc}</p>
      <div className="grid grid-cols-3 gap-1.5 pt-1">
        {["easy", "medium", "hard"].map((d) => (
          <button
            key={d}
            onClick={() => go(d)}
            disabled={busy}
            className={`py-2 rounded-lg text-[11px] font-bold capitalize disabled:opacity-60 ${cls.btn} text-black flex items-center justify-center gap-1`}
          >
            {busy &&
            d ===
              "medium" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : null}
            {d}
          </button>
        ))}
      </div>
      {error && <p className="text-[11px] text-red-300">{error}</p>}
    </div>
  )
}

function SessionRunner({
  session: initialSession,
  onEnd,
}: {
  session: InterviewSession
  onEnd: () => void
}) {
  const [session, setSession] = useState(initialSession)
  const [answer, setAnswer] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResult | null>(
    null,
  )
  const [error, setError] = useState<string | null>(null)

  const transcript =
    session.questions?.items ??
    []
  const idx = Math.min(
    session.currentQuestionIndex,
    transcript.length -
      1,
  )
  const current = transcript[idx]
  const isFinished =
    session.status ===
    "completed"
  if (isFinished) {
    return <SummaryView session={session} onBack={onEnd} />
  }

  const submit = async () => {
    if (!answer.trim() || !current) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await api<AnswerEvaluationResult>(
        `/api/interviews/${session.id}/answer`,
        {
          method: "POST",
          body: JSON.stringify({ answer }),
        },
      )
      const updated = await api<InterviewSession>(
        `/api/interviews/${session.id}`,
      )
      setSession(updated)
      setEvaluation(res)
      setAnswer("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed")
    } finally {
      setSubmitting(false)
    }
  }

  const complete = async () => {
    setSubmitting(true)
    try {
      const updated = await api<InterviewSession>(
        `/api/interviews/${session.id}/complete`,
        { method: "POST" },
      )
      setSession(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to finalize")
    } finally {
      setSubmitting(false)
    }
  }

  const answeredCount = transcript.filter((t) => t.score != null).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold font-mono">
            Q{idx + 1} / {transcript.length}
          </span>
          <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
            {session.track}
          </span>
          <span className="text-[11px] text-zinc-600">
            {answeredCount} evaluated · avg{" "}
            {answeredCount > 0
              ? Math.round(
                  transcript
                    .filter((t) => t.score != null)
                    .reduce((s, t) => s + (t.score ?? 0), 0) / answeredCount,
                )
              : "—"}
            /100
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={complete}
            disabled={submitting || answeredCount === 0}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold disabled:opacity-40"
          >
            Finish Session
          </button>
          <button
            onClick={onEnd}
            className="text-xs text-zinc-400 hover:text-white"
          >
            Exit ✕
          </button>
        </div>
      </div>

      {}
      {current && (
        <div className="material-titanium p-6 rounded-2xl border border-sky-500/30 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
            <Bot className="w-4 h-4" /> AI Interviewer
          </div>
          <h3 className="text-base font-bold text-white leading-relaxed">
            &ldquo;{current.question}&rdquo;
          </h3>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {}
      {evaluation && transcript[idx]?.score != null && (
        <FeedbackCard
          entry={transcript[idx]}
          evaluation={evaluation.evaluation}
        />
      )}

      {}
      {current?.score == null ? (
        <div className="space-y-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={7}
            disabled={submitting}
            placeholder="Type your answer — structure it clearly, use concrete examples and technical terms…"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400 resize-none disabled:opacity-60"
          />
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-zinc-600">
              {answer.trim().split(/\s+/).filter(Boolean).length} words
            </p>
            <button
              onClick={submit}
              disabled={submitting || !answer.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-bold text-xs text-white hover:opacity-95 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Answer for Evaluation
            </button>
          </div>
        </div>
      ) : (
        current.score != null &&
        idx + 1 < transcript.length && (
          <button
            onClick={() => {
              setEvaluation(null)
              setSession({ ...session })
            }}
            hidden
          />
        )
      )}
    </div>
  )
}

function FeedbackCard({
  entry,
}: {
  entry: {
    score: number | null
    strengths: string[]
    improvements: string[]
    keywordCoverage: string[]
  }
  evaluation?: unknown
}) {
  const score = entry.score ?? 0
  return (
    <div className="material-glass p-6 rounded-2xl border border-emerald-500/30 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-bold text-white">
            Evaluated: {score}/100
          </h4>
        </div>
        <span
          className={`text-xs font-bold font-mono ${
            score >= 75
              ? "text-emerald-400"
              : score >= 50
                ? "text-amber-400"
                : "text-red-400"
          }`}
        >
          {score >= 75
            ? "Strong answer"
            : score >= 50
              ? "Decent — add depth"
              : "Needs work"}
        </span>
      </div>

      {entry.strengths.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wide font-bold text-emerald-300 mb-1">
            Strengths
          </p>
          {entry.strengths.map((s, i) => (
            <p key={i} className="text-xs text-zinc-300">
              • {s}
            </p>
          ))}
        </div>
      )}
      {entry.improvements.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wide font-bold text-amber-300 mb-1">
            Improve next time
          </p>
          {entry.improvements.map((s, i) => (
            <p key={i} className="text-xs text-zinc-300">
              • {s}
            </p>
          ))}
        </div>
      )}
      {entry.keywordCoverage.length > 0 && (
        <p className="text-[11px] text-zinc-500">
          Keywords covered:{" "}
          <span className="text-zinc-300">
            {entry.keywordCoverage.join(", ")}
          </span>
        </p>
      )}
    </div>
  )
}

function SummaryView({
  session,
  onBack,
}: {
  session: InterviewSession
  onBack: () => void
}) {
  const transcript = session.questions?.items ?? []
  const answered = transcript.filter((t) => t.score != null)
  const score = Math.round(session.score ?? 0)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="material-glass p-8 rounded-3xl border border-white/10 space-y-4 text-center">
        <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
        <h2 className="text-2xl font-extrabold text-white">Session Complete</h2>
        <div
          className={`inline-flex px-6 py-2 rounded-full text-2xl font-extrabold font-mono border ${
            score >= 70
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              : score >= 45
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-red-500/10 text-red-300 border-red-500/40"
          }`}
        >
          {score}/100
        </div>
        {session.feedback && (
          <p className="text-sm text-zinc-300 max-w-xl mx-auto">
            {session.feedback}
          </p>
        )}
        <p className="text-[11px] text-zinc-500">
          {answered.length}/{transcript.length} answers evaluated
          {session.durationSec
            ? ` · ${Math.round(session.durationSec / 60)} min`
            : ""}
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs"
        >
          Back to Hub
        </button>
      </div>

      {}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Transcript & per-question scores
        </h3>
        {answered.map((entry, i) => (
          <div
            key={i}
            className="material-glass p-5 rounded-2xl border border-white/10 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-bold text-white">
                {i + 1}. {entry.question}
              </p>
              <span
                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${
                  (entry.score ?? 0) >= 70
                    ? "bg-emerald-500/15 text-emerald-300"
                    : (entry.score ?? 0) >= 45
                      ? "bg-amber-500/15 text-amber-300"
                      : "bg-red-500/10 text-red-300"
                }`}
              >
                {entry.score}/100
              </span>
            </div>
            <p className="text-xs text-zinc-400 whitespace-pre-line">
              {entry.answer.slice(0, 400)}
              {entry.answer.length > 400 ? "…" : ""}
            </p>
            {(entry.strengths?.length > 0 ||
              entry.improvements?.length > 0) && (
              <div className="pt-1 space-y-1">
                {entry.strengths.slice(0, 2).map((s, j) => (
                  <p key={`s${j}`} className="text-[11px] text-emerald-300/90">
                    + {s}
                  </p>
                ))}
                {entry.improvements.slice(0, 2).map((s, j) => (
                  <p key={`i${j}`} className="text-[11px] text-amber-300/90">
                    → {s}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
