"use client" /* Page Header */ /* Progress Header Box */ /* Add Task Modal / Form */ /* Roadmap Tasks List */
import React, { useState } from "react"
import {
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  BookOpen,
  Clock,
  Calendar,
} from "lucide-react"
import { motion } from "framer-motion"

interface Task {
  id: string
  title: string
  description: string
  category: string
  completed: boolean
  dueDate: string
}

export default function RoadmapPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t1",
      title: "Master Next.js App Router & Server Components",
      description:
        "Build 2 full-stack projects using Next.js 15, Server Actions, and Tailwind CSS v4.",
      category: "Frontend",
      completed: true,
      dueDate: "Today",
    },
    {
      id: "t2",
      title: "Implement Real-time Convex Backend Mutations",
      description:
        "Learn schema design, indexed queries, and real-time client sync with Convex DB.",
      category: "Backend",
      completed: true,
      dueDate: "Today",
    },
    {
      id: "t3",
      title: "Practice 15 Advanced LeetCode Graph & DP Problems",
      description:
        "Prepare for technical coding interviews focused on Graphs, Topological Sort, and Dynamic Programming.",
      category: "Algorithms",
      completed: false,
      dueDate: "In 2 days",
    },
    {
      id: "t4",
      title: "CUDA C++ Kernel Optimization Basics",
      description:
        "Understand GPU memory hierarchy, thread blocks, and custom PyTorch CUDA extensions for OpenAI role.",
      category: "AI/ML Systems",
      completed: false,
      dueDate: "In 4 days",
    },
    {
      id: "t5",
      title: "Build & Deploy AI Agent Prototype with Embeddings",
      description:
        "Create an autonomous career assistant agent utilizing vector embeddings and LLM tool calling.",
      category: "AI/ML",
      completed: false,
      dueDate: "In 7 days",
    },
  ])

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: "Custom learning target added by student.",
      category: "General",
      completed: false,
      dueDate: "Next Week",
    }

    setTasks((prev) => [...prev, newTask])
    setNewTaskTitle("")
    setShowAddForm(false)
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const progressPercent = Math.round((completedCount / tasks.length) * 100)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Personalized AI Learning Roadmap{" "}
            <Compass className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Targeting:{" "}
            <span className="text-amber-300 font-semibold">
              Summer 2026 Full-Stack & AI Engineer
            </span>
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Learning Task
        </button>
      </div>

      {}
      <div className="material-glass p-6 rounded-3xl border border-white/10 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Overall Milestone Progress
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white font-mono">
              {progressPercent}%
            </span>
            <span className="text-xs text-zinc-400">
              {completedCount} of {tasks.length} Tasks Completed
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-md">
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {}
      {showAddForm && (
        <form
          onSubmit={handleAddTask}
          className="material-glass p-6 rounded-3xl border border-amber-500/30 space-y-4"
        >
          <h3 className="text-sm font-bold text-white">
            Add Custom Milestone Task
          </h3>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g. Implement Distributed Caching with Redis..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-xs text-zinc-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`cursor-pointer p-5 rounded-3xl border transition-all duration-300 flex items-start justify-between ${
              task.completed
                ? "bg-white/[0.02] border-white/5 opacity-75"
                : "material-glass border-white/10 hover:border-amber-500/40"
            }`}
          >
            <div className="flex items-start gap-4">
              <button className="mt-1">
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-zinc-500 hover:text-amber-400" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3
                    className={`text-sm font-bold ${
                      task.completed
                        ? "line-through text-zinc-400"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-300">
                    {task.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {task.description}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" /> {task.dueDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
