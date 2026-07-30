"use client"

// Live simulation of dynamic operating system updates
/* Chapter Text Header */ /* Living Dashboard Showcase Window */ /* Top Control Bar */ /* Column 1: Dynamic ATS Resume Score Engine */ /* Column 2: Application Pipeline Tracker */ /* Column 3: AI Interviewer Interactive Typing Simulation */ /* Footer Navigation CTA */

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  CalendarDays,
  Bot,
  ArrowRight,
  Play,
  RotateCcw,
} from "lucide-react"

interface Chapter05Props {
  onProceed: () => void
  onAudioClick?: () => void
}

export const Chapter05Platform: React.FC<Chapter05Props> = ({
  onProceed,
  onAudioClick,
}) => {
  const [atsScore, setAtsScore] = useState(72)
  const [applicationsCount, setApplicationsCount] = useState(28)
  const [activeTab, setActiveTab] =
    useState<"overview" | "resume" | "interview" | "calendar">("overview")
  const [aiTypingText, setAiTypingText] = useState("")
  useEffect(() => {
    const timer = setTimeout(() => {
      setAtsScore(98)
      setApplicationsCount(42)
    }, 1200)

    const fullMessage =
      "Based on your latest mock interview, your technical response clarity improved by +34%. Next recommended prep: Distributed Systems Caching."
    let charIdx = 0
    const typingInterval = setInterval(() => {
      if (charIdx < fullMessage.length) {
        setAiTypingText(fullMessage.slice(0, charIdx + 1))
        charIdx++
      } else {
        clearInterval(typingInterval)
      }
    }, 25)

    return () => {
      clearTimeout(timer)
      clearInterval(typingInterval)
    }
  }, [])

  return (
    <section className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {}
      <div className="relative z-30 text-center max-w-4xl mx-auto space-y-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full material-glass border border-white/10 text-xs font-mono text-zinc-300 uppercase tracking-widest"
        >
          <span>CHAPTER 05 • THE LIVING PLATFORM</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-white editorial-title"
        >
          An Operating System That Thinks With You.
        </motion.h2>
      </div>

      {}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 w-full max-w-6xl rounded-2xl material-glass border border-white/15 p-6 shadow-2xl backdrop-blur-2xl grid grid-cols-12 gap-6"
      >
        {}
        <div className="col-span-12 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-white tracking-wider">
              InternEdge OS
            </span>
            <div className="flex gap-2">
              {(["overview", "resume", "interview", "calendar"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      if (onAudioClick) onAudioClick()
                      setActiveTab(tab)
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-mono capitalize transition-all ${
                      activeTab === tab
                        ? "bg-white text-black font-semibold"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span className="text-[10px] font-mono text-zinc-400">
              Live AI Telemetry Active
            </span>
          </div>
        </div>

        {}
        <div className="col-span-12 md:col-span-4 p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                REAL-TIME ATS OPTIMIZER
              </span>
              <h4 className="text-sm font-semibold text-white mt-1">
                Master Resume (Software Eng)
              </h4>
            </div>
            <FileText size={18} className="text-zinc-400" />
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-5xl font-extrabold text-white font-mono transition-all duration-1000">
              {atsScore}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              / 100 ATS Score
            </span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-1000"
              style={{ width: `${atsScore}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/5">
            <span>KEYWORD MATCH</span>
            <span className="text-green-400 font-bold">
              98% Match (Apple / Meta / Stripe)
            </span>
          </div>
        </div>

        {}
        <div className="col-span-12 md:col-span-4 p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase">
                PIPELINE METRICS
              </span>
              <h4 className="text-sm font-semibold text-white mt-1">
                Active Applications
              </h4>
            </div>
            <CalendarDays size={18} className="text-zinc-400" />
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-5xl font-extrabold text-white font-mono transition-all duration-1000">
              {applicationsCount}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Synced Portals
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
            <div className="p-2 rounded bg-white/5 border border-white/5">
              <div className="text-zinc-400">APPLIED</div>
              <div className="text-white font-bold text-xs mt-0.5">24</div>
            </div>
            <div className="p-2 rounded bg-white/5 border border-white/5">
              <div className="text-zinc-400">INTERVIEW</div>
              <div className="text-cyan-400 font-bold text-xs mt-0.5">14</div>
            </div>
            <div className="p-2 rounded bg-white/5 border border-white/5">
              <div className="text-zinc-400">OFFER</div>
              <div className="text-emerald-400 font-bold text-xs mt-0.5">4</div>
            </div>
          </div>
        </div>

        {}
        <div className="col-span-12 md:col-span-4 p-5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-cyan-400" />
              <span className="text-xs font-semibold text-white">
                AI Mock Feedback
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              AI ACTIVE
            </span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/10 font-mono text-xs text-zinc-300 min-h-[90px] leading-relaxed">
            {aiTypingText}
            <span className="animate-pulse text-white"> |</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                if (onAudioClick) onAudioClick()
                setAiTypingText("Simulating fresh mock interview session...")
              }}
              className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw size={10} /> Restart Simulation
            </button>
            <span className="text-[10px] font-mono text-zinc-500">
              Audio Speech Score: 96/100
            </span>
          </div>
        </div>

        {}
        <div className="col-span-12 pt-4 flex justify-between items-center border-t border-white/10">
          <span className="text-xs font-mono text-zinc-400">
            Interactive Module 05 / 10 • All telemetry active
          </span>
          <button
            onClick={onProceed}
            className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-2"
          >
            <span>Launch Deep-Dive Module Tour</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </section>
  )
}
