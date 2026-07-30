"use client" /* Floating frosted glass pill */ /* Logo Monogram */ /* Active Chapter Label */ /* Quick Controls */ /* Play/Pause Keynote Slideshow */ /* Audio Toggle */ /* Chapter Selection Drawer Toggle */ /* Fullscreen Toggle */ /* Progress bar line under pill */ /* Chapter Selection Drawer Modal */
import React, { useState } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2, Layers } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { InternEdgeIcon } from "../brand/InternEdgeLogo"

interface KeynoteNavProps {
  currentChapterIndex: number
  totalChapters: number
  chapterTitles: string[]
  isPlaying: boolean
  isMuted: boolean
  onSelectChapter: (index: number) => void
  onTogglePlay: () => void
  onToggleMute: () => void
}

export const KeynoteNav: React.FC<KeynoteNavProps> = ({
  currentChapterIndex,
  totalChapters,
  chapterTitles,
  isPlaying,
  isMuted,
  onSelectChapter,
  onTogglePlay,
  onToggleMute,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }

  const progressPct = ((currentChapterIndex + 1) / totalChapters) * 100

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700">
      <div className="relative">
        {}
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-full material-glass border border-white/10 shadow-2xl backdrop-blur-xl">
          {}
          <div
            onClick={() => onSelectChapter(0)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <InternEdgeIcon variant="squircle" size={24} />
            <span className="font-semibold text-xs tracking-wider text-white uppercase hidden sm:inline">
              InternEdge
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              0{currentChapterIndex + 1}
            </span>
            <span className="text-xs font-medium text-white max-w-[130px] truncate sm:max-w-[200px]">
              {chapterTitles[currentChapterIndex]}
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {}
          <div className="flex items-center gap-1.5">
            {}
            <button
              onClick={onTogglePlay}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title={
                isPlaying
                  ? "Pause Keynote Presentation (Space)"
                  : "Play Keynote Slideshow (Space)"
              }
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>

            {}
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title={
                isMuted ? "Unmute Keynote Audio (M)" : "Mute Keynote Audio (M)"
              }
            >
              {isMuted ? (
                <VolumeX size={14} />
              ) : (
                <Volume2 size={14} className="text-cyan-400" />
              )}
            </button>

            {}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Chapter Navigation"
            >
              <Layers size={14} />
            </button>

            {}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors hidden md:block"
              title="Toggle Fullscreen Presentation"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {}
        <div className="absolute -bottom-1 left-4 right-4 h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-white to-zinc-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {}
        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 8, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-1/2 -translate-x-1/2 w-80 p-3 rounded-2xl material-glass border border-white/10 shadow-2xl backdrop-blur-2xl grid gap-1 z-50"
            >
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 border-b border-white/10 mb-1">
                Keynote Chapters
              </div>
              {chapterTitles.map((title, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectChapter(idx)
                    setIsDrawerOpen(false)
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                    currentChapterIndex === idx
                      ? "bg-white/15 text-white font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-zinc-500">
                      0{idx + 1}
                    </span>
                    <span>{title}</span>
                  </span>
                  {currentChapterIndex === idx && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
