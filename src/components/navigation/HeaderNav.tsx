import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderNavProps {
  activeSectionIndex: number;
  sectionTitles: string[];
  isMuted: boolean;
  onToggleMute: () => void;
  onScrollToSection: (index: number) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeSectionIndex,
  sectionTitles,
  isMuted,
  onToggleMute,
  onScrollToSection,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show navbar after scrolling past top 150px
      if (window.scrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all"
          >
            <div className="flex items-center gap-4 px-5 py-2.5 rounded-full material-glass border border-white/10 shadow-2xl backdrop-blur-2xl">
              {/* Brand Logo Monogram */}
              <div 
                onClick={() => onScrollToSection(0)}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white group-hover:bg-white group-hover:text-black transition-all">
                  IE
                </div>
                <span className="font-semibold text-xs tracking-wider text-white uppercase hidden sm:inline">
                  InternEdge
                </span>
              </div>

              <div className="h-4 w-px bg-white/10" />

              {/* Active Section Tracker */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  0{activeSectionIndex + 1}
                </span>
                <span className="text-xs font-medium text-white max-w-[130px] truncate sm:max-w-[200px]">
                  {sectionTitles[activeSectionIndex]}
                </span>
              </div>

              <div className="h-4 w-px bg-white/10" />

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Audio Synthesizer Toggle */}
                <button
                  onClick={onToggleMute}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                  title={isMuted ? "Unmute Audio (M)" : "Mute Audio (M)"}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-cyan-400" />}
                </button>

                {/* Early Access CTA */}
                <button
                  onClick={() => setIsAccessModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1 shadow-lg"
                >
                  <span>Early Access</span>
                  <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Early Access Modal */}
      <AnimatePresence>
        {isAccessModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setIsAccessModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-8 rounded-2xl material-glass border border-white/20 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">InternEdge Early Access</h3>
                  <p className="text-xs text-zinc-400 mt-1">Join the waitlist for Early Access Release 2.6</p>
                </div>
                <button
                  onClick={() => setIsAccessModalOpen(false)}
                  className="text-zinc-500 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you! Early Access request received.");
                  setIsAccessModalOpen(false);
                }}
                className="space-y-4"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your university or work email..."
                  className="w-full px-4 py-3 rounded-xl material-glass border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all shadow-xl"
                >
                  Request Priority Access
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
