'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CausticBackground } from '../canvas/CausticBackground';
import { ArrowRight, Sparkles, ShieldCheck, Zap, BarChart3, Bot } from 'lucide-react';

interface Chapter02Props {
  onProceed: () => void;
  onPlayClick?: () => void;
}

export const Chapter02Hero: React.FC<Chapter02Props> = ({ onProceed, onPlayClick }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateY((x / rect.width) * 12);
    setRotateX(-(y / rect.height) * 12);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <section className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      <CausticBackground theme="dark" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Massive Editorial Typography */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col items-start gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full material-glass border border-white/10 text-xs font-mono tracking-widest text-zinc-400">
            <Sparkles size={12} className="text-white" />
            <span>
              <span className="text-white font-extrabold text-sm border-b border-white/40">G</span>RADUATE{' '}
              <span className="text-white font-extrabold text-sm border-b border-white/40">A</span>DVANCEMENT &{' '}
              <span className="text-white font-extrabold text-sm border-b border-white/40">N</span>AVIGATION{' '}
              <span className="text-white font-extrabold text-sm border-b border-white/40">D</span>IRECTORATE
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white editorial-title">
            OWN <br />
            EVERY <br />
            OPPORTUNITY.
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 font-light max-w-lg leading-relaxed">
            InternEdge unifies resume optimization, application auto-sync, AI mock interviews, and offer evaluation into one intelligent platform.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => {
                if (onPlayClick) onPlayClick();
                onProceed();
              }}
              className="px-8 py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95"
            >
              <span>Explore Platform</span>
              <ArrowRight size={16} />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <ShieldCheck size={14} className="text-zinc-400" />
              <span>WWDC Keynote Launch 2026</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Suspended 3D Dashboard Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1200 }}
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-full rounded-2xl material-glass border border-white/15 p-6 shadow-2xl backdrop-blur-2xl relative group overflow-hidden"
          >
            {/* Specular sheen effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Window Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                InternEdge OS v2.6 • Active Session
              </span>
            </div>

            {/* Mock Dashboard Preview */}
            <div className="grid grid-cols-12 gap-4">
              {/* Stat Card 1 */}
              <div className="col-span-6 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-zinc-400">ATS RESUME SCORE</span>
                <span className="text-3xl font-bold text-white font-mono">98/100</span>
                <span className="text-[10px] text-green-400 font-mono">Top 2% Candidate Rank</span>
              </div>

              {/* Stat Card 2 */}
              <div className="col-span-6 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-zinc-400">ACTIVE PIPELINE</span>
                <span className="text-3xl font-bold text-white font-mono">14 Interviews</span>
                <span className="text-[10px] text-cyan-400 font-mono">4 Tech Rounds Scheduled</span>
              </div>

              {/* Interactive Widget Row */}
              <div className="col-span-12 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">AI Interview Copilot</div>
                    <div className="text-[10px] text-zinc-400">Apple System Architecture Practice</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/10 text-white border border-white/20">
                  Ready
                </span>
              </div>

              {/* Metric Chart Bar */}
              <div className="col-span-12 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span>WEEKLY APPLICATION VELOCITY</span>
                  <span className="flex items-center gap-1 text-white">
                    <BarChart3 size={12} /> +340% Match Rate
                  </span>
                </div>
                <div className="h-12 flex items-end gap-2 pt-2">
                  {[40, 65, 80, 50, 95, 100, 85, 90].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-white/10 to-white/60 rounded-t-sm"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
