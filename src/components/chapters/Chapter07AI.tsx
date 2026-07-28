import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CausticBackground } from '../canvas/CausticBackground';
import { Bot, Send, Sparkles, Brain, Cpu } from 'lucide-react';

interface Chapter07Props {
  onProceed: () => void;
  onAudioPulse?: () => void;
}

const samplePrompts = [
  "Prepare me for Apple Hardware Engineering interview",
  "Analyze my resume keyword gaps for Stripe PM intern",
  "Calculate my offer total rewards: Meta vs OpenAI",
];

export const Chapter07AI: React.FC<Chapter07Props> = ({ onProceed, onAudioPulse }) => {
  const [selectedPrompt, setSelectedPrompt] = useState(samplePrompts[0]);
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState(
    "Analyzing Apple Hardware Engineering candidate profile... 12 key system architecture principles detected. Recommended prep focus: Thermal constraints & ASIC pipeline trade-offs."
  );

  const handleTestPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setIsThinking(true);
    if (onAudioPulse) onAudioPulse();
    setAiResponse('');

    setTimeout(() => {
      setIsThinking(false);
      if (prompt.includes('Stripe')) {
        setAiResponse(
          "Stripe PM Analysis complete: Resume alignment score is 96%. Key focus area: Quantifying API adoption metrics & developer experience trade-offs in your lead project."
        );
      } else if (prompt.includes('Meta')) {
        setAiResponse(
          "Offer Evaluation complete: Meta base $54/hr + $10k housing stipend exceeds benchmark by 18%. Total adjusted 12-week compensation: $35,920."
        );
      } else {
        setAiResponse(
          "Analyzing Apple Hardware Engineering candidate profile... 12 key system architecture principles detected. Recommended prep focus: Thermal constraints & ASIC pipeline trade-offs."
        );
      }
    }, 1500);
  };

  return (
    <section className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {/* Soft Sapphire Ambient Caustic Canvas */}
      <CausticBackground theme="sapphire" />

      {/* Chapter Text Header */}
      <div className="relative z-30 text-center max-w-4xl mx-auto space-y-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full material-sapphire text-xs font-mono text-cyan-300 uppercase tracking-widest"
        >
          <Sparkles size={14} className="text-cyan-400" />
          <span>CHAPTER 07 • AMBIENT INTELLIGENCE</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white editorial-title"
        >
          An Interface That Thinks Before It Speaks.
        </motion.h2>

        <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto">
          InternEdge AI doesn&apos;t just generate text. It maintains deep candidate context across your entire internship lifecycle.
        </p>
      </div>

      {/* Interactive AI Intelligence Showcase Window */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 w-full max-w-4xl rounded-2xl material-sapphire border border-cyan-500/20 p-8 shadow-2xl backdrop-blur-2xl space-y-6"
      >
        {/* Header telemetry */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">InternEdge Ambient Intelligence Core</h3>
              <p className="text-[10px] font-mono text-cyan-300/80">Neural Transformer Model v4.8</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Cpu size={14} className="text-cyan-400 animate-pulse" />
            <span>0.04s Latency</span>
          </div>
        </div>

        {/* Sample Prompt Selector Buttons */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase">TEST CONSCIOUS PROMPT SIMULATION:</span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleTestPrompt(prompt)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                  selectedPrompt === prompt
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50 shadow-lg'
                    : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Response Box */}
        <div className="p-5 rounded-xl bg-black/60 border border-cyan-500/20 font-mono text-sm text-zinc-200 min-h-[120px] flex items-center justify-center relative overflow-hidden">
          {isThinking ? (
            <div className="flex flex-col items-center gap-3 text-cyan-400">
              <Brain size={24} className="animate-spin" />
              <span className="text-xs font-mono tracking-widest uppercase">
                CONSCIOUS NEURAL PARTICLES THINKING...
              </span>
            </div>
          ) : (
            <div className="w-full space-y-2">
              <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-2">
                <Sparkles size={12} />
                <span>INTELLIGENCE RESPONSE OUTPUT:</span>
              </div>
              <p className="leading-relaxed text-xs md:text-sm text-zinc-100">{aiResponse}</p>
            </div>
          )}
        </div>

        {/* Navigation CTA */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <span className="text-xs font-mono text-zinc-400">Chapter 07 / 10 • Ambient Intelligence</span>
          <button
            onClick={onProceed}
            className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-2"
          >
            <span>Inspect Technical Architecture</span>
            <Send size={12} />
          </button>
        </div>
      </motion.div>
    </section>
  );
};
