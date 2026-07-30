"use client" /* Header */ /* Kanban Board Grid */ /* Column Title */ /* Cards in Column */ /* Quick Shift Button */ /* Application Detail Modal */
import React, { useState } from "react"
import {
  Kanban,
  Plus,
  Building2,
  MapPin,
  Calendar,
  FileText,
  ChevronRight,
  CheckCircle2,
} from "lucide-react"
import { motion } from "framer-motion"

export interface ApplicationItem {
  id: string
  company: string
  role: string
  location: string
  stage: "Saved" | "Applied" | "Online Assessment" | "Interview" | "HR Round" | "Offer" | "Rejected"
  appliedDate: string
  notes: string
}

const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: "app_1",
    company: "OpenAI",
    role: "AI Research & Systems Engineering Intern",
    location: "San Francisco, CA",
    stage: "Online Assessment",
    appliedDate: "3 days ago",
    notes:
      "Completed Hackerrank coding challenge (scored 100%). Waiting for system design interview scheduling.",
  },
  {
    id: "app_2",
    company: "Vercel",
    role: "Frontend Engineering Intern (Next.js Core)",
    location: "Remote",
    stage: "Applied",
    appliedDate: "5 days ago",
    notes:
      "Submitted customized resume highlighting Next.js App Router and Server Actions work.",
  },
  {
    id: "app_3",
    company: "Stripe",
    role: "Backend Engineering Intern (Fintech Core)",
    location: "Seattle, WA",
    stage: "Saved",
    appliedDate: "Yesterday",
    notes:
      "Preparing cover letter emphasizing PostgreSQL & Distributed Systems experience.",
  },
  {
    id: "app_4",
    company: "Google",
    role: "Software Engineering Intern - Cloud Systems",
    location: "Mountain View, CA",
    stage: "Interview",
    appliedDate: "2 weeks ago",
    notes: "Technical Interview round scheduled for Friday at 10 AM PST.",
  },
]

const STAGES: ApplicationItem["stage"][] = [
  "Saved",
  "Applied",
  "Online Assessment",
  "Interview",
  "HR Round",
  "Offer",
  "Rejected",
]

export default function ApplicationsPage() {
  const [apps, setApps] = useState<ApplicationItem[]>(INITIAL_APPLICATIONS)
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null)

  const moveStage = (id: string, newStage: ApplicationItem["stage"]) => {
    setApps((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stage: newStage } : item,
      ),
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Application Tracker Kanban{" "}
            <Kanban className="w-6 h-6 text-purple-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Track your pipeline across 7 stages from saved bookmarks to final
            offers
          </p>
        </div>

        <button
          onClick={() => {
            const newApp: ApplicationItem = {
              id: Date.now().toString(),
              company: "Figma",
              role: "WebGL Engineering Intern",
              location: "New York, NY",
              stage: "Saved",
              appliedDate: "Today",
              notes: "Added to pipeline.",
            }
            setApps((prev) => [...prev, newApp])
          }}
          className="px-4 py-2.5 rounded-2xl bg-purple-500 hover:bg-purple-400 text-black font-semibold text-xs transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto pb-6">
        {STAGES.map((stage) => {
          const stageApps = apps.filter((a) => a.stage === stage)

          return (
            <div key={stage} className="space-y-3 min-w-[200px]">
              {}
              <div className="p-3 rounded-2xl material-glass border border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate">
                  {stage}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold text-sky-400">
                  {stageApps.length}
                </span>
              </div>

              {}
              <div className="space-y-3">
                {stageApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="p-4 rounded-2xl material-glass-interactive border border-white/10 space-y-2 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-400">
                        {app.company}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {app.role}
                    </h4>
                    <p className="text-[10px] text-zinc-400">{app.location}</p>

                    <div className="pt-2 flex items-center justify-between text-[10px] text-zinc-500 border-t border-white/5">
                      <span>{app.appliedDate}</span>

                      {}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const currentIndex = STAGES.indexOf(app.stage)
                          if (currentIndex < STAGES.length - 1) {
                            moveStage(app.id, STAGES[currentIndex + 1])
                          }
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300"
                        title="Move to Next Stage"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="material-glass p-6 rounded-3xl border border-white/10 max-w-lg w-full space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-sky-400">
                  {selectedApp.company}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {selectedApp.role}
                </h3>
                <p className="text-xs text-zinc-400">{selectedApp.location}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">
                Stage
              </label>
              <select
                value={selectedApp.stage}
                onChange={(e) => {
                  const newStage = e.target.value as ApplicationItem["stage"]
                  moveStage(selectedApp.id, newStage)
                  setSelectedApp({ ...selectedApp, stage: newStage })
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s} className="bg-zinc-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-300">
                Application Notes
              </label>
              <textarea
                value={selectedApp.notes}
                onChange={(e) => {
                  const updatedNotes = e.target.value
                  setApps((prev) =>
                    prev.map((a) =>
                      a.id === selectedApp.id
                        ? { ...a, notes: updatedNotes }
                        : a,
                    ),
                  )
                  setSelectedApp({ ...selectedApp, notes: updatedNotes })
                }}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-sky-500 text-black font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
