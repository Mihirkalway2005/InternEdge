"use client" /* Header */ /* Messages */ /* Quick prompts */ /* Input */

import React, { useEffect, useRef, useState } from "react"
import { api, ApiClientError } from "@/lib/api-client"
import type { AssistantReplyPayload } from "@/types"
import { X, Send, Bot, Loader2, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  sender: "ai" | "user"
  text: string
  actions?: { label: string; href: string }[]
}

const QUICK_PROMPTS = [
  "How can I improve my resume?",
  "What skills should I learn next?",
  "Write me a cover letter draft",
  "Which internships fit me best?",
]

export function CareerAssistantDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      sender: "ai",
      text: "Hi! I'm your InternEdge career assistant. I know your profile, skills, applications and roadmap — ask me anything about your internship journey.",
    },
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, sending])

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || sending) return

    setInput("")
    setError(null)
    setMessages((prev) => [
      ...prev,
      { id: `u${Date.now()}`, sender: "user", text: content },
    ])
    setSending(true)

    try {
      const reply = await api<AssistantReplyPayload>("/api/assistant/chat", {
        method: "POST",
        body: JSON.stringify({ conversationId: "default", message: content }),
      })
      setMessages((prev) => [
        ...prev,
        {
          id: `a${Date.now()}`,
          sender: "ai",
          text: reply.answer,
          actions: reply.suggestedActions?.length
            ? reply.suggestedActions
            : undefined,
        },
      ])
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 503) {
        setError(
          "AI assistant is not configured on this deployment (missing GROQ_API_KEY).",
        )
      } else if (err instanceof ApiClientError && err.status === 429) {
        setError(err.message)
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Assistant unavailable — please retry.",
        )
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="h-full material-glass border-l border-white/10 flex flex-col">
          {}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <Bot className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">
                  AI Career Assistant
                </h3>
                <p className="text-[11px] text-zinc-500">
                  Contextual to your profile & activity
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-sky-500/20 border border-sky-500/30 text-white"
                      : "bg-white/5 border border-white/10 text-zinc-200"
                  }`}
                >
                  {m.text}
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {m.actions.map((a) => (
                        <Link
                          key={a.href}
                          href={a.href}
                          onClick={onClose}
                          className="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-[10px] font-bold text-sky-300 hover:bg-sky-500/25"
                        >
                          {a.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/10 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                  <span className="text-[11px] text-zinc-500">
                    Thinking about your context…
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-[11px] text-red-300">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {error}
              </div>
            )}
          </div>

          {}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  disabled={sending}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-400 hover:text-white hover:border-sky-500/40 transition disabled:opacity-50 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> {p}
                </button>
              ))}
            </div>
          )}

          {}
          <div className="p-4 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), void send())
              }
              placeholder="Ask about resumes, prep, applications…"
              disabled={sending}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400 disabled:opacity-50"
            />
            <button
              onClick={() => void send()}
              disabled={sending || !input.trim()}
              className="p-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold disabled:opacity-40 transition"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
