"use client" /* Warm Champagne Gold Ambient Background */ /* Chapter Text Header */ /* 4 Ecosystem Pillars Grid */ /* CTA Button to Keynote Finale */
import React from "react"
import { motion } from "framer-motion"
import { CausticBackground } from "../canvas/CausticBackground"
import {
  Sparkles,
  Building2,
  GraduationCap,
  TrendingUp,
  Compass,
  ArrowRight,
} from "lucide-react"

interface Chapter09Props {
  onProceed: () => void
}

const visionPillars = [
  {
    title: "Recruiter Direct Portal",
    desc: "Connecting top candidates directly with hiring managers using verified ATS scores and interview recordings.",
    icon: Building2,
    tag: "Enterprise Ecosystem",
  },
  {
    title: "University Placement Dashboard",
    desc: "Empowering university career centers with real-time candidate pipeline telemetry and placement analytics.",
    icon: GraduationCap,
    tag: "Academic Partner Network",
  },
  {
    title: "Macro Placement Intelligence",
    desc: "Benchmarking compensation, interview difficulty, and hiring trends across 10,000+ tech & finance roles.",
    icon: TrendingUp,
    tag: "Industry Benchmark Engine",
  },
  {
    title: "Lifelong AI Career Mentor",
    desc: "Guiding your career progression seamlessly from intern to return offer, full-time transition, and senior leadership.",
    icon: Compass,
    tag: "Career OS Expansion",
  },
]

export const Chapter09Vision: React.FC<Chapter09Props> = ({ onProceed }) => {
  return (
    <section className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {}
      <CausticBackground theme="gold" />

      {}
      <div className="relative z-30 text-center max-w-4xl mx-auto space-y-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full material-champagne text-xs font-mono text-[var(--accent-gold)] uppercase tracking-widest"
        >
          <Sparkles size={14} className="text-[#ECE3CE]" />
          <span>CHAPTER 09 • THE FUTURE ECOSYSTEM</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white editorial-gold leading-tight"
        >
          Hope Replaces Complexity. <br />
          <span className="text-zinc-400">The Future of Work Unfolded.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed"
        >
          InternEdge extends beyond student application tracking into a
          universal career infrastructure connecting students, recruiters, and
          universities.
        </motion.p>
      </div>

      {}
      <div className="relative z-30 w-full max-w-6xl grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visionPillars.map((pillar, idx) => {
          const Icon = pillar.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="p-6 rounded-2xl material-champagne border border-[#ECE3CE]/20 shadow-2xl backdrop-blur-2xl flex flex-col justify-between hover:scale-105 transition-all group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl bg-[#ECE3CE]/10 text-[#ECE3CE] border border-[#ECE3CE]/20 group-hover:bg-[#ECE3CE] group-hover:text-black transition-all">
                    <Icon size={22} />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    0{idx + 1}
                  </span>
                </div>

                <span className="text-[10px] font-mono text-[#ECE3CE] uppercase tracking-wider block mb-1">
                  {pillar.tag}
                </span>

                <h3 className="text-lg font-bold text-white mb-3">
                  {pillar.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>STATUS</span>
                <span className="text-[#ECE3CE] font-bold">2026 ROADMAP</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onProceed}
        className="relative z-30 mt-12 px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#ECE3CE] transition-all shadow-2xl flex items-center gap-3"
      >
        <span>Watch Keynote Conclusion</span>
        <ArrowRight size={16} />
      </motion.button>
    </section>
  )
}
