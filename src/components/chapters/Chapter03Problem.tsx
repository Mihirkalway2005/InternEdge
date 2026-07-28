import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, HardDrive, FileText, Calendar, Table, 
  Code2, MessageSquare, AlertCircle, Layers
} from 'lucide-react';

interface Chapter03Props {
  onProceed: () => void;
}

const fragmentedTools = [
  {
    name: 'LinkedIn',
    icon: Globe,
    desc: 'Unread recruiter messages & connection requests',
    elevation: 'z-30',
    offset: 'top-10 left-4 md:left-12',
    rotate: -6,
    color: 'border-blue-500/30',
    status: '12 Unread DM Alerts',
  },
  {
    name: 'Google Drive',
    icon: HardDrive,
    desc: 'Resume_v4_final_final_EDITED.pdf',
    elevation: 'z-20',
    offset: 'top-20 right-4 md:right-16',
    rotate: 8,
    color: 'border-yellow-500/30',
    status: 'Duplicate File Versions',
  },
  {
    name: 'Excel Sheet',
    icon: Table,
    desc: 'Manual application tracking matrix (Row 142)',
    elevation: 'z-10',
    offset: 'bottom-28 left-8 md:left-24',
    rotate: 4,
    color: 'border-emerald-500/30',
    status: 'Outdated Status Entries',
  },
  {
    name: 'LeetCode',
    icon: Code2,
    desc: '74 Medium problems remaining before interview',
    elevation: 'z-30',
    offset: 'bottom-16 right-8 md:right-28',
    rotate: -8,
    color: 'border-orange-500/30',
    status: 'No Direct Resume Link',
  },
  {
    name: 'Google Calendar',
    icon: Calendar,
    desc: 'Conflicting interview schedule invitations',
    elevation: 'z-20',
    offset: 'top-1/2 left-2 md:left-8 -translate-y-1/2',
    rotate: 10,
    color: 'border-red-500/30',
    status: 'Timezone Collision Alert',
  },
  {
    name: 'ChatGPT',
    icon: MessageSquare,
    desc: 'Generic cover letter prompts & answers',
    elevation: 'z-10',
    offset: 'top-1/3 right-2 md:right-10',
    rotate: -4,
    color: 'border-cyan-500/30',
    status: 'Isolated Context Window',
  },
];

export const Chapter03Problem: React.FC<Chapter03Props> = ({ onProceed }) => {
  return (
    <section className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {/* Editorial Chapter Header */}
      <div className="relative z-40 text-center max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full material-smoked-glass text-xs font-mono text-zinc-400 uppercase tracking-widest"
        >
          <Layers size={14} className="text-zinc-300" />
          <span>CHAPTER 03 • THE FRAGMENTATION PROBLEM</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold tracking-tight text-white editorial-title leading-tight"
        >
          The internship journey isn&apos;t difficult. <br />
          <span className="text-zinc-500">It&apos;s disconnected.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed"
        >
          Students juggle dozens of single-purpose tools. Notes are lost, applications are forgotten, schedules clash, and preparation occurs in isolation.
        </motion.p>
      </div>

      {/* Drifting Floating Cards Grid representing tool chaos */}
      <div className="relative w-full max-w-6xl h-[520px] mt-12 z-30">
        {fragmentedTools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              animate={{
                y: [0, -12, 0],
                rotate: [tool.rotate, tool.rotate + 2, tool.rotate],
              }}
              transition={{
                duration: 4 + idx,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: idx * 0.15,
              }}
              className={`absolute ${tool.offset} ${tool.elevation} w-72 md:w-80 p-5 rounded-2xl material-smoked-glass border ${tool.color} shadow-2xl backdrop-blur-xl group cursor-pointer hover:border-white/30 transition-all`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-white/10 text-white">
                    <Icon size={16} />
                  </div>
                  <span className="font-semibold text-sm text-white">{tool.name}</span>
                </div>
                <AlertCircle size={14} className="text-red-400/80 animate-pulse" />
              </div>

              <div className="py-3 text-xs text-zinc-300 font-mono leading-relaxed">
                {tool.desc}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                <span>STATUS</span>
                <span className="text-red-400 uppercase tracking-wider">{tool.status}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Section Proceed affordance */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onProceed}
        className="relative z-40 mt-8 px-6 py-3 rounded-full material-glass border border-white/10 text-xs font-mono tracking-widest text-zinc-300 hover:text-white hover:border-white/30 transition-all flex items-center gap-2"
      >
        <span>SEE THE TRANSFORMATION</span>
        <span className="text-cyan-400">↓</span>
      </motion.button>
    </section>
  );
};
