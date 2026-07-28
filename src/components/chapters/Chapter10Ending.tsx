import React from 'react';
import { motion } from 'framer-motion';
import { LiquidMetalCanvas } from '../canvas/LiquidMetalCanvas';
import { ArrowUp } from 'lucide-react';

interface Chapter10Props {
  onRestartKeynote: () => void;
}

export const Chapter10Ending: React.FC<Chapter10Props> = ({ onRestartKeynote }) => {
  return (
    <section className="relative w-full h-screen bg-[#050505] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Liquid Glass / Mercury canvas background */}
      <LiquidMetalCanvas activeProgress={0.4} isAttracting={false} className="z-10 opacity-30" />

      <div className="relative z-30 text-center max-w-3xl mx-auto space-y-8">
        {/* Emblem Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-16 rounded-2xl material-glass border border-white/20 flex items-center justify-center font-bold text-2xl text-white mx-auto shadow-2xl"
        >
          IE
        </motion.div>

        {/* Final Statement Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-8xl font-black tracking-tight text-white editorial-title leading-tight"
        >
          OWN EVERY <br /> OPPORTUNITY.
        </motion.h1>

        {/* Back to Top Scroll Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="pt-8"
        >
          <button
            onClick={onRestartKeynote}
            className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/10 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowUp size={14} />
            <span>Return to Top</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
