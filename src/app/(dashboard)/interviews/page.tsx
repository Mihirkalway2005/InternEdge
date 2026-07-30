"use client" /* Header */
/* Track Selection View */
/* Active Interview Simulator Session */ /* Prompt Box */ /* User Answer Input */
/* Real-Time AI Feedback Report */
import React, { useState } from "react"
import {
  Bot,
  Play,
  Award,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  RotateCcw,
  Volume2,
  Mic,
} from "lucide-react"
import { motion } from "framer-motion"

export default function InterviewsPage() {
  const [selectedTrack, setSelectedTrack] =
    useState<"technical" | "behavioral" | "hr">("technical")
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)

  const QUESTIONS = {
    technical: [
      "Explain how vector embeddings are indexed for fast nearest-neighbor search in LLM RAG pipelines. What is the difference between HNSW and IVF-PQ?",
      "How does Next.js 15 App Router handle streaming server rendering with React Suspense boundaries under the hood?",
    ],
    behavioral: [
      "Tell me about a time you had to optimize a slow database query or rendering bottleneck under a tight deadline. What STAR steps did you take?",
    ],
    hr: [
      "Why do you want to join OpenAI's Systems Engineering team over other tech companies?",
    ],
  }

  const currentQuestions = QUESTIONS[selectedTrack]

  const handleNext = () => {
    setShowFeedback(true)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            AI Mock Interview Practice Hub{" "}
            <Bot className="w-6 h-6 text-sky-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Simulate technical DSA, behavioral STAR, and HR interview rounds
            with real-time feedback
          </p>
        </div>
      </div>

      {!isSessionActive ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setSelectedTrack("technical")}
            className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
              selectedTrack === "technical"
                ? "material-glass border-sky-400/50 shadow-xl shadow-sky-500/10"
                : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
            }`}
          >
            <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Technical DSA & Systems
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Algorithms, Data Structures, System Design, React internals, and
              Distributed Systems prompts.
            </p>
            <button
              onClick={() => setIsSessionActive(true)}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Start Technical Round
            </button>
          </div>

          <div
            onClick={() => setSelectedTrack("behavioral")}
            className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
              selectedTrack === "behavioral"
                ? "material-glass border-amber-400/50 shadow-xl shadow-amber-500/10"
                : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
            }`}
          >
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Behavioral STAR Method
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Conflict resolution, leadership, deadline management, and team
              collaboration prompts.
            </p>
            <button
              onClick={() => setIsSessionActive(true)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Start Behavioral Round
            </button>
          </div>

          <div
            onClick={() => setSelectedTrack("hr")}
            className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 space-y-4 ${
              selectedTrack === "hr"
                ? "material-glass border-purple-400/50 shadow-xl shadow-purple-500/10"
                : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
            }`}
          >
            <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              HR & Fit Conversation
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Company motivation, career goals, culture alignment, and
              work-style discussion.
            </p>
            <button
              onClick={() => setIsSessionActive(true)}
              className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Start HR Round
            </button>
          </div>
        </div>
      ) : (
        <div className="material-glass p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold font-mono">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </span>
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                {selectedTrack} Round
              </span>
            </div>

            <button
              onClick={() => {
                setIsSessionActive(false)
                setShowFeedback(false)
                setUserAnswer("")
              }}
              className="text-xs text-zinc-400 hover:text-white"
            >
              End Session ✕
            </button>
          </div>

          {}
          <div className="material-titanium p-6 rounded-2xl border border-sky-500/30 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
              <Bot className="w-4 h-4" /> AI Interviewer Prompt
            </div>
            <h3 className="text-base font-bold text-white leading-relaxed">
              "{currentQuestions[currentQuestionIndex]}"
            </h3>
          </div>

          {}
          {!showFeedback ? (
            <div className="space-y-4">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or dictate your answer here (e.g. HNSW creates a multi-layer graph structure where top layers contain long-range connections...)"
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-400"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 font-bold text-xs text-white hover:opacity-95 transition flex items-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  Submit Answer & Get AI Feedback <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="material-glass p-6 rounded-2xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">
                    AI Evaluation Score: 94/100
                  </h4>
                </div>
                <span className="text-xs text-emerald-400 font-bold font-mono">
                  Strong Technical Accuracy
                </span>
              </div>

              <div className="space-y-2 text-xs text-zinc-300">
                <p>
                  <span className="font-bold text-white">
                    Keyword Coverage:
                  </span>{" "}
                  HNSW, Multi-layer Graph, Small World Navigation, Distance
                  Metric (Cosine/L2).
                </p>
                <p>
                  <span className="font-bold text-white">AI Suggestions:</span>{" "}
                  Explicitly mention how IVF (Inverted File Index) partitions
                  space into Voronoi cells to contrast quantization techniques.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowFeedback(false)
                  setUserAnswer("")
                  if (currentQuestionIndex < currentQuestions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1)
                  } else {
                    setIsSessionActive(false)
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
              >
                Next Question →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
