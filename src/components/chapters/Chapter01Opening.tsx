import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ParticleAssemblyCanvas } from '../canvas/ParticleAssemblyCanvas';
import { ArrowDown, Sparkles } from 'lucide-react';

interface Chapter01Props {
  onProceed: () => void;
  onAudioMorph?: () => void;
}

export const Chapter01Opening: React.FC<Chapter01Props> = ({ onProceed, onAudioMorph }) => {
  const [isAssembled, setIsAssembled] = useState(false);

  const handleAssemblyComplete = () => {
    setIsAssembled(true);
    if (onAudioMorph) onAudioMorph();
  };

  return (
    <section className="relative w-full h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Hero Dashboard Preview (Materializes slowly through depth and blur) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(30px)' }}
        animate={isAssembled ? { opacity: 0.18, scale: 1, filter: 'blur(10px)' } : { opacity: 0 }}
        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none p-12"
      >
        <div className="w-full max-w-5xl h-[600px] rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl" />
      </motion.div>

      {/* Unified Particle-to-Solid Canvas (Renders assembly & fuses into solid crisp title) */}
      <ParticleAssemblyCanvas onAssemblyComplete={handleAssemblyComplete} className="z-10" />

      {/* Subtitle & Keynote CTA (Appears smoothly after solid text fusion completes) */}
      <div className="relative z-20 text-center px-6 max-w-4xl pt-64 pointer-events-none">
        {isAssembled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full material-glass border border-white/10 text-xs font-mono tracking-widest text-zinc-400">
              <Sparkles size={12} className="text-white" />
              <span>
                <span className="text-white font-extrabold text-sm border-b border-white/40">G</span>RADUATE{' '}
                <span className="text-white font-extrabold text-sm border-b border-white/40">A</span>DVANCEMENT &{' '}
                <span className="text-white font-extrabold text-sm border-b border-white/40">N</span>AVIGATION{' '}
                <span className="text-white font-extrabold text-sm border-b border-white/40">D</span>IRECTORATE
              </span>
            </div>

            <p className="text-sm md:text-base text-zinc-400 font-light max-w-md mx-auto tracking-widest uppercase">
              Intelligence Organizing Chaos Into Structure
            </p>
          </motion.div>
        )}
      </div>

      {/* Keynote Begin Affordance Arrow */}
      {isAssembled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          onClick={onProceed}
          className="absolute bottom-10 z-30 flex flex-col items-center gap-2 cursor-pointer text-zinc-500 hover:text-white transition-colors pointer-events-auto"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">SCROLL TO UNVEIL PRODUCT</span>
          <ArrowDown size={16} className="animate-bounce" />
        </motion.div>
      )}
    </section>
  );
};
