"use client" /* Header Controls */ /* Live Portfolio Preview Box */ /* Hero Section */ /* Featured Projects Grid */
import React from "react"
import {
  Globe,
  ExternalLink,
  Code2,
  Sparkles,
  Mail,
  FileText,
} from "lucide-react"
import { motion } from "framer-motion"

export default function PortfolioPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            AI Portfolio Website Generator{" "}
            <Globe className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Auto-generated live portfolio site assembled from your unified
            student profile & GitHub
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2">
          <ExternalLink className="w-4 h-4" /> Publish to alexrivera.dev
        </button>
      </div>

      {}
      <div className="material-glass p-8 rounded-3xl border border-white/10 space-y-8 relative overflow-hidden">
        {}
        <div className="space-y-3 border-b border-white/10 pb-8">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
            Available for Summer 2026 Internships
          </span>
          <h2 className="text-4xl font-extrabold text-white">Alex Rivera</h2>
          <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Computer Science Junior at Stanford University building full-stack
            web applications, vector search engines, and real-time GPU
            infrastructure.
          </p>
          <div className="flex items-center gap-4 pt-2 text-xs">
            <a
              href="https://github.com/alexrivera"
              target="_blank"
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
            >
              <Code2 className="w-4 h-4 text-sky-400" /> github.com/alexrivera
            </a>
            <a
              href="https://linkedin.com/in/alexrivera"
              target="_blank"
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
            >
              <Globe className="w-4 h-4 text-emerald-400" />{" "}
              linkedin.com/in/alexrivera
            </a>
          </div>
        </div>

        {}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" /> Featured Engineering
            Projects
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl material-titanium border border-white/10 space-y-3">
              <span className="text-xs font-bold text-sky-400">
                Full-Stack & AI
              </span>
              <h4 className="text-base font-bold text-white">
                InternEdge Career Engine
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                AI-powered internship readiness platform built with Next.js 15
                App Router, React 19, Tailwind CSS v4, and Convex DB.
              </p>
              <div className="flex gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-300">
                  Next.js 15
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-300">
                  Convex DB
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-300">
                  TypeScript
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl material-titanium border border-white/10 space-y-3">
              <span className="text-xs font-bold text-purple-400">
                Deep Learning & Systems
              </span>
              <h4 className="text-base font-bold text-white">
                CUDA Vector Search Indexer
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                High-throughput GPU vector indexing engine utilizing HNSW
                multi-layer graphs and custom CUDA kernels for LLM RAG
                pipelines.
              </p>
              <div className="flex gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-300">
                  Python
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-300">
                  CUDA C++
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-300">
                  PyTorch
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
