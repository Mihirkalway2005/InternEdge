"use client"

// Simulate AI Response
/* Backdrop */ /* Sliding Drawer Panel */ /* Drawer Header */ /* Quick Prompt Chips */ /* Messages Stream */ /* Input Bar */

import React, { useState } from "react"
import {
  X,
  Send,
  Bot,
  Sparkles,
  User,
  FileText,
  Code2,
  HelpCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  sender: "ai" | "user"
  text: string
  timestamp: string
}

export function CareerAssistantDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello Alex! I'm your InternEdge Ambient AI Assistant. I can analyze your resume, help you write custom cover letters, explain technical concepts, or practice mock interview prompts. How can I help you today?",
      timestamp: "Just now",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput("")
    setTimeout(() => {
      let replyText =
        "That's a great strategy! Based on your target roles in Full-Stack & AI Systems, I recommend highlighting your Next.js App Router and PyTorch experience in your summary bullet points."

      if (text.toLowerCase().includes("cover letter")) {
        replyText =
          "Here is a tailored cover letter draft for Vercel:\n\n'Dear Vercel Hiring Team,\nAs a CS student passionate about frontend web architecture and serverless runtimes, I am excited to apply for the Next.js Engineering Internship. My recent work building high-performance glassmorphism React 19 web applications aligns directly with Vercel's mission...'"
      } else if (
        text.toLowerCase().includes("mock") ||
        text.toLowerCase().includes("interview")
      ) {
        replyText =
          "Let's prepare for your upcoming OpenAI technical assessment. A classic question: 'Explain how vector embeddings are indexed for fast nearest-neighbor search (e.g. HNSW vs IVF-PQ).' Would you like to practice your answer?"
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setMessages((prev) => [...prev, aiMsg])
    }, 800)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[420px] max-w-full z-50 material-smoked-glass border-l border-white/10 flex flex-col shadow-2xl"
          >
            {}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Ambient AI Career Assistant
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    Contextual guidance for Alex Rivera
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {}
            <div className="p-3 border-b border-white/10 flex gap-2 overflow-x-auto text-[11px]">
              <button
                onClick={() =>
                  handleSend("Draft cover letter for Vercel Next.js Internship")
                }
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 whitespace-nowrap flex items-center gap-1.5"
              >
                <FileText className="w-3 h-3 text-sky-400" /> Draft Cover Letter
              </button>
              <button
                onClick={() =>
                  handleSend("Give me mock interview question for OpenAI")
                }
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 whitespace-nowrap flex items-center gap-1.5"
              >
                <Code2 className="w-3 h-3 text-purple-400" /> Technical Mock Qs
              </button>
            </div>

            {}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.sender === "ai" && (
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      m.sender === "user"
                        ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-none"
                        : "material-glass border border-white/10 text-zinc-200 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                    <div
                      className={`text-[9px] mt-1.5 text-right ${
                        m.sender === "user" ? "text-sky-200" : "text-zinc-500"
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>

                  {m.sender === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {}
            <div className="p-4 border-t border-white/10 bg-white/[0.02]">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask career question or prompt..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="submit"
                  className="p-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-bold transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
