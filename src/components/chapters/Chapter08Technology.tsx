import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, Network, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface Chapter08Props {
  onProceed: () => void;
  onAudioClick?: () => void;
}

const techNodes = [
  {
    id: 'ingest',
    title: 'Multi-Source Data Ingestion Engine',
    tech: 'WebSockets • Headless Sync • Browser Extension Bridge',
    desc: 'Ingests application state, email confirmations, calendar events, and resume versions in under 50ms with end-to-end zero-knowledge encryption.',
    icon: Network,
    stats: '50ms Latency • 256-bit AES',
  },
  {
    id: 'neural',
    title: 'Contextual Neural Transformer Layer',
    tech: 'Fine-Tuned LLMs • Speculative Decoding • Vector Embeddings',
    desc: 'Maintains long-term candidate memory across all historical mock interviews, ATS keyword gaps, and recruiter communication patterns.',
    icon: Cpu,
    stats: '12B Parameters • 99.8% Precision',
  },
  {
    id: 'graph',
    title: 'Real-Time Candidate Knowledge Graph',
    tech: 'Graph Database • Instant Query Engine • Cross-Portal State',
    desc: 'Maps thousands of company skill requirements directly against your live experience graph to generate tailor-fitted strategy recommendations.',
    icon: Database,
    stats: '100k+ Job Ontologies',
  },
  {
    id: 'edge',
    title: 'High-Throughput Client Execution Edge',
    tech: 'Next.js App Router • WebGL Metal Shaders • Local Offline Cache',
    desc: 'Delivers 60fps glassmorphic UI interactions with zero lag, instant search indexing, and resilient offline capabilities.',
    icon: Zap,
    stats: '60fps Native Performance',
  },
];

export const Chapter08Technology: React.FC<Chapter08Props> = ({ onProceed, onAudioClick }) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);

  const selectedNode = techNodes[selectedNodeIndex];
  const Icon = selectedNode.icon;

  return (
    <section className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {/* Chapter Header */}
      <div className="relative z-30 text-center max-w-4xl mx-auto space-y-4 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full material-titanium text-xs font-mono text-zinc-300 uppercase tracking-widest"
        >
          <Cpu size={14} className="text-zinc-200" />
          <span>CHAPTER 08 • SYSTEM ARCHITECTURE & ENGINEERING</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-white editorial-title"
        >
          Engineered Like an Aerospace Blueprint.
        </motion.h2>
      </div>

      {/* Wireframe Titanium System Architecture Grid */}
      <div className="relative z-30 w-full max-w-6xl grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive Titanium Nodes */}
        <div className="lg:col-span-6 space-y-4">
          {techNodes.map((node, idx) => {
            const NodeIcon = node.icon;
            const isSelected = selectedNodeIndex === idx;
            return (
              <motion.div
                key={node.id}
                onClick={() => {
                  if (onAudioClick) onAudioClick();
                  setSelectedNodeIndex(idx);
                }}
                className={`p-5 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? 'material-titanium border border-white/30 text-white shadow-2xl scale-[1.02]'
                    : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                      <NodeIcon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{node.title}</h4>
                      <p className="text-[10px] font-mono text-zinc-400">{node.tech}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/10 text-zinc-300">
                    0{idx + 1}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Node Technical Blueprint Telemetry Card */}
        <div className="lg:col-span-6 w-full">
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="p-8 rounded-2xl material-titanium border border-white/20 shadow-2xl backdrop-blur-2xl flex flex-col justify-between min-h-[400px] space-y-6"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedNode.title}</h3>
                    <p className="text-xs font-mono text-zinc-400">{selectedNode.tech}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono text-green-400">
                  <ShieldCheck size={14} />
                  <span>Verified</span>
                </div>
              </div>

              <div className="py-6 space-y-4">
                <p className="text-sm text-zinc-300 leading-relaxed font-light">
                  {selectedNode.desc}
                </p>

                <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-zinc-400 flex justify-between items-center">
                  <span>TELEMETRY METRICS</span>
                  <span className="text-white font-bold">{selectedNode.stats}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-zinc-500">Chapter 08 / 10 • Architecture</span>
              <button
                onClick={onProceed}
                className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-2"
              >
                <span>View Future Vision</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
