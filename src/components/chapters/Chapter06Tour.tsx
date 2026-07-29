'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Bot, BarChart2, Calendar, CheckSquare, DollarSign,
  ChevronRight, Sparkles, Sliders, Shield
} from 'lucide-react';

interface Chapter06Props {
  onProceed: () => void;
  onAudioClick?: () => void;
}

const modulesList = [
  {
    id: 'resume',
    title: 'Resume Intelligence & ATS Optimizer',
    subtitle: 'Instant parsing against real ATS algorithms (Workday, Greenhouse, Lever)',
    icon: FileText,
    accent: 'border-white/30',
    details: [
      'Automatic hard-skill & soft-skill keyword gap detection',
      'One-click ATS format re-structuring without altering typography',
      'Real-time match scoring tailored to specific job description URLs',
    ],
    metric: '98% ATS Pass Guarantee',
  },
  {
    id: 'interview',
    title: 'AI Mock Interviewer & Speech Radar',
    subtitle: 'Real-time voice and technical evaluation engine',
    icon: Bot,
    accent: 'border-cyan-500/30',
    details: [
      'Pace, filler word, and confidence voice spectrum analysis',
      'System design & coding question follow-up probing',
      'Instant feedback with ideal sample response breakdowns',
    ],
    metric: '+45% Interview Conversion',
  },
  {
    id: 'analytics',
    title: 'Career Pipeline Analytics',
    subtitle: 'Predictive offer probability matrix & application velocity',
    icon: BarChart2,
    accent: 'border-emerald-500/30',
    details: [
      'Historical funnel metrics comparing response rates per role',
      'Recruiter engagement tracking & email open telemetry',
      'Offer probability confidence rating based on interview performance',
    ],
    metric: '3.4x Higher Response Rate',
  },
  {
    id: 'calendar',
    title: 'Smart Calendar & Prep Scheduler',
    subtitle: 'Automatic interview prep blocks & timezone conflict resolver',
    icon: Calendar,
    accent: 'border-purple-500/30',
    details: [
      'Auto-reserves 45 minutes of preparation before every interview',
      'Seamless multi-calendar sync across Google Workspace & Outlook',
      'Smart reminders with candidate notes & reviewer bios attached',
    ],
    metric: 'Zero Double-Bookings',
  },
  {
    id: 'tracker',
    title: 'Application Auto-Sync Engine',
    subtitle: 'Unified portal auto-sync across 100+ career sites',
    icon: CheckSquare,
    accent: 'border-amber-500/30',
    details: [
      'Browser extension auto-detects submitted applications',
      'Automatic follow-up email drafts generated on Day 7 and Day 14',
      'Centralized status sync without updating spreadsheets',
    ],
    metric: '10+ Hours Saved / Week',
  },
  {
    id: 'offer',
    title: 'Offer Evaluator & Equity Negotiator',
    subtitle: 'Comprehensive compensation breakdown & benchmark engine',
    icon: DollarSign,
    accent: 'border-emerald-400/30',
    details: [
      'Cost-of-living adjusted base salary & equity vesting calculator',
      'AI-crafted counter-offer negotiation scripts backed by market data',
      'Side-by-side total rewards comparison for multiple internship offers',
    ],
    metric: '+$8,500 Average Negotiated Gain',
  },
];

export const Chapter06Tour: React.FC<Chapter06Props> = ({ onProceed, onAudioClick }) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  const activeMod = modulesList[activeModuleIndex];
  const Icon = activeMod.icon;

  return (
    <section className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {/* Chapter Text Header */}
      <div className="relative z-30 text-center max-w-4xl mx-auto space-y-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full material-glass border border-white/10 text-xs font-mono text-zinc-300 uppercase tracking-widest"
        >
          <Sparkles size={14} className="text-white" />
          <span>CHAPTER 06 • PLATFORM MODULE DEEP-DIVE</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-white editorial-title"
        >
          Precision Engineering in Every Module.
        </motion.h2>
      </div>

      {/* Main Tour Showcase Layout */}
      <div className="relative z-30 w-full max-w-6xl grid lg:grid-cols-12 gap-8 items-center">
        {/* Module Selector Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          {modulesList.map((mod, idx) => {
            const ModIcon = mod.icon;
            const isActive = activeModuleIndex === idx;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  if (onAudioClick) onAudioClick();
                  setActiveModuleIndex(idx);
                }}
                className={`flex items-center justify-between p-4 rounded-xl text-left transition-all ${
                  isActive
                    ? 'material-glass border border-white/20 text-white font-semibold shadow-xl scale-[1.02]'
                    : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                    <ModIcon size={16} />
                  </div>
                  <span className="text-xs font-medium">{mod.title.split('&')[0]}</span>
                </div>
                <ChevronRight size={14} className={isActive ? 'text-white' : 'text-zinc-600'} />
              </button>
            );
          })}
        </div>

        {/* Focused Module Deep-Dive Inspection Card */}
        <div className="lg:col-span-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMod.id}
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full p-8 rounded-2xl material-glass border ${activeMod.accent} shadow-2xl backdrop-blur-2xl flex flex-col justify-between min-h-[460px]`}
            >
              <div>
                <div className="flex justify-between items-start pb-6 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center shadow-xl">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{activeMod.title}</h3>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">{activeMod.subtitle}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/10 text-white border border-white/20">
                    {activeMod.metric}
                  </span>
                </div>

                {/* Bullet Points */}
                <div className="space-y-4 my-6">
                  {activeMod.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-3 text-sm text-zinc-300">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                        ✓
                      </div>
                      <span className="leading-relaxed">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Telemetry Bar & Next Step */}
              <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Shield size={14} className="text-zinc-300" />
                  <span>Module 0{activeModuleIndex + 1} / 06 Certified</span>
                </div>
                {activeModuleIndex < modulesList.length - 1 ? (
                  <button
                    onClick={() => {
                      if (onAudioClick) onAudioClick();
                      setActiveModuleIndex(activeModuleIndex + 1);
                    }}
                    className="px-5 py-2 rounded-full bg-white/10 text-white font-medium text-xs hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <span>Next Module</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={onProceed}
                    className="px-6 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all"
                  >
                    Proceed to AI Intelligence
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
