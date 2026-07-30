"use client"

/**
 * InternEdge Official Brand Deliverables Showcase Board
 * Recreates the exact presentation & deliverables layout from the reference image.
 */ /* Header Showcase: Primary Logo + Tagline */ /* Grid Deliverables Row 1 */ /* Primary Logo */ /* Icon Only */ /* Wordmark Only */ /* Monochrome White */ /* Monochrome Black */ /* Grid Deliverables Row 2 */ /* Brushed Titanium */ /* Liquid Glass */ /* SVG Vector (Scalable) */ /* Integrations Section */ /* 1. Hero Icon Integration */ /* 2. Navbar Integration */

import React from "react"
import {
  InternEdgeIcon,
  InternEdgeWordmark,
  InternEdgeLogo,
} from "./InternEdgeLogo"
export const InternEdgeBrandBoard: React.FC = () => {
  return (
    <div className="w-full bg-[#050505] text-white p-8 md:p-12 font-sans border border-white/10 rounded-3xl shadow-2xl space-y-12">
      {}
      <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
        <InternEdgeLogo
          iconSize={72}
          variant="liquid-glass"
          showTagline={true}
        />
      </div>

      <div className="h-px w-full bg-white/10" />

      {}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center text-xs font-mono tracking-widest text-zinc-400 uppercase">
        {}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-[10px] text-zinc-500">PRIMARY LOGO</span>
          <div className="h-28 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4">
            <InternEdgeLogo iconSize={36} variant="liquid-glass" />
          </div>
        </div>

        {}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-[10px] text-zinc-500">ICON ONLY</span>
          <div className="h-28 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4">
            <InternEdgeIcon size={44} variant="squircle" />
          </div>
        </div>

        {}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-[10px] text-zinc-500">WORDMARK ONLY</span>
          <div className="h-28 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4">
            <InternEdgeWordmark />
          </div>
        </div>

        {}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-[10px] text-zinc-500">MONOCHROME WHITE</span>
          <div className="h-28 w-full rounded-2xl bg-black border border-white/10 flex items-center justify-center p-4">
            <InternEdgeIcon size={44} variant="monochrome-white" />
          </div>
        </div>

        {}
        <div className="flex flex-col items-center space-y-3 col-span-2 md:col-span-1">
          <span className="text-[10px] text-zinc-500">MONOCHROME BLACK</span>
          <div className="h-28 w-full rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center p-4">
            <InternEdgeIcon size={44} variant="monochrome-black" />
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs font-mono tracking-widest text-zinc-400 uppercase">
        {}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-[10px] text-zinc-500">BRUSHED TITANIUM</span>
          <div className="h-28 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4">
            <InternEdgeIcon size={52} variant="titanium" />
          </div>
        </div>

        {}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-[10px] text-zinc-500">LIQUID GLASS</span>
          <div className="h-28 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4">
            <InternEdgeIcon size={52} variant="liquid-glass" />
          </div>
        </div>

        {}
        <div className="flex flex-col items-center space-y-3">
          <span className="text-[10px] text-zinc-500">
            SVG VECTOR (SCALABLE)
          </span>
          <div className="h-28 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4">
            <InternEdgeIcon size={52} variant="default" />
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />

      {}
      <div className="grid md:grid-cols-2 gap-8 pt-4">
        {}
        <div className="space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            1. HERO ICON INTEGRATION
          </span>
          <div className="p-8 rounded-2xl bg-black border border-white/10 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
            <InternEdgeIcon size={64} variant="liquid-glass" />
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">
              OWN EVERY OPPORTUNITY.
            </h2>
          </div>
        </div>

        {}
        <div className="space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            2. NAVBAR INTEGRATION
          </span>
          <div className="p-8 rounded-2xl bg-black border border-white/10 flex items-center justify-center">
            <div className="px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl flex items-center gap-4">
              <InternEdgeIcon size={28} variant="liquid-glass" />
              <div className="h-4 w-px bg-white/20" />
              <span className="font-semibold text-xs tracking-[0.35em] text-white uppercase">
                INTERNEDGE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
