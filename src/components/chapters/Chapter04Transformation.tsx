"use client" /* Signature Liquid Metal Canvas Background */ /* Chapter Text Header */ /* Interactive Melt Trigger Button */ /* Animation Area: Isolated Cards -> Liquid Coalescence -> Unified Dashboard */
/* Pre-melt or Melting Card Group */
/* Post-melt Cohesive Unified Operating System Interface */
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LiquidMetalCanvas } from "../canvas/LiquidMetalCanvas"
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"

interface Chapter04Props {
  onProceed: () => void
  onAudioMorph?: () => void
}

export const Chapter04Transformation: React.FC<Chapter04Props> = ({
  onProceed,
  onAudioMorph,
}) => {
  const [isMelting, setIsMelting] = useState(false)
  const [isUnified, setIsUnified] = useState(false)

  const handleStartMelt = () => {
    setIsMelting(true)
    if (onAudioMorph) onAudioMorph()
    setTimeout(() => {
      setIsUnified(true)
    }, 2000)
  }

  return (
    <section className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {}
      <LiquidMetalCanvas
        activeProgress={1}
        isAttracting={isMelting}
        className="z-10"
      />

      {}
      <div className="relative z-30 text-center max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full material-glass border border-white/10 text-xs font-mono text-zinc-300 uppercase tracking-widest"
        >
          <Sparkles size={14} className="text-white" />
          <span>CHAPTER 04 • THE TRANSFORMATION</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white editorial-title leading-tight"
        >
          One Liquid Flow. <br />
          <span className="text-zinc-400">Zero Fragmentation.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed"
        >
          Watch how InternEdge pulls every isolated workflow into a single,
          cohesive metallic architecture.
        </motion.p>

        {}
        {!isUnified && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-4"
          >
            <button
              onClick={handleStartMelt}
              disabled={isMelting}
              className="px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all shadow-2xl flex items-center gap-3 mx-auto disabled:opacity-50"
            >
              <span>
                {isMelting
                  ? "Attracting & Melting Platforms..."
                  : "Initiate Liquid Transformation"}
              </span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </div>

      {}
      <div className="relative z-30 w-full max-w-5xl h-[420px] mt-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isUnified ? (
            <motion.div
              key="fragmented"
              exit={{ opacity: 0, scale: 0.4, filter: "blur(20px)" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full px-6"
            >
              {[
                "LinkedIn DM Engine",
                "Google Drive ATS",
                "Calendar Sync",
                "LeetCode Graph",
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  animate={
                    isMelting
                      ? {
                          x: 0,
                          y: 0,
                          scale: [1, 0.8, 0],
                          opacity: [1, 0.6, 0],
                        }
                      : { y: [0, -8, 0] }
                  }
                  transition={{
                    duration: isMelting ? 1.8 : 3 + idx,
                    repeat: isMelting ? 0 : Infinity,
                  }}
                  className="p-6 rounded-2xl material-smoked-glass border border-white/10 text-center flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-mono text-white text-xs font-bold">
                    0{idx + 1}
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {item}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">
                    Isolated Node
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="unified"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-2xl material-glass border border-white/20 p-8 shadow-2xl backdrop-blur-2xl grid grid-cols-12 gap-6"
            >
              <div className="col-span-12 flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white text-black font-bold flex items-center justify-center text-xs">
                    IE
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      InternEdge Operating System
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-400">
                      All 8 Core Workflows Synchronized
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-400 font-mono">
                  <CheckCircle2 size={16} />
                  <span>Unified & Live</span>
                </div>
              </div>

              <div className="col-span-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  AUTOMATED APPLICATIONS
                </span>
                <span className="text-3xl font-extrabold text-white font-mono">
                  42 Active
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Auto-synced across 12 portals
                </span>
              </div>

              <div className="col-span-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  INTERVIEW CONFIDENCE
                </span>
                <span className="text-3xl font-extrabold text-white font-mono">
                  94% Rank
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  Verified by AI Mock Rounds
                </span>
              </div>

              <div className="col-span-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  SCHEDULED RECRUITER MEETS
                </span>
                <span className="text-3xl font-extrabold text-white font-mono">
                  6 Confirmed
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Zero Calendar Conflicts
                </span>
              </div>

              <div className="col-span-12 pt-4 flex justify-end">
                <button
                  onClick={onProceed}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-2"
                >
                  <span>Enter Full Platform Tour</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
