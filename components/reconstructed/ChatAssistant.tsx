"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Send, MessageSquare, Loader2 } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

const SUGGESTED_PROMPTS = [
  "What's Siser's strongest skill?",
  "Tell me about IntelAI",
  "Is he available for freelance?",
  "What stack does he work with?",
]

export default function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when drawer opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return
    setError(null)

    const userMessage: Message = { role: "user", content: text.trim() }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput("")
    setStreaming(true)

    // Placeholder assistant message that we'll stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Something went wrong.")
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error("No response stream.")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          }
          return updated
        })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect."
      setError(msg)
      // Remove the empty assistant placeholder on error
      setMessages((prev) => prev.filter((_, i) => i !== prev.length - 1))
    } finally {
      setStreaming(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] text-white shadow-[0_8px_32px_rgba(255,75,31,0.4)] flex items-center justify-center hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
        aria-label="Open portfolio assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageSquare size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-drawer"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-28 right-8 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-[24px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)] flex flex-col"
            style={{ height: "min(540px, calc(100vh - 160px))" }}
          >
            {/* Header */}
            <div className="bg-[#0D0505] px-5 py-4 border-b border-white/10 flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] flex items-center justify-center text-white text-xs font-bold shrink-0">
                S
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none mb-0.5">Siser&apos;s Assistant</p>
                <p className="text-white/40 text-[11px]">Powered by Llama 3.1 · Ask me anything</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/40 text-[11px]">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[#110A0A] px-4 py-4 flex flex-col gap-3 scroll-smooth">
              {messages.length === 0 ? (
                <div className="flex flex-col h-full justify-between">
                  {/* Intro */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="bg-[#1A0F0F] border border-white/10 rounded-[16px] rounded-tl-[4px] px-4 py-3 max-w-[90%]">
                      <p className="text-white/90 text-sm leading-relaxed">
                        Hi! I&apos;m Siser&apos;s portfolio assistant. Ask me about his projects, experience, skills, or availability.
                      </p>
                    </div>
                  </div>

                  {/* Suggested prompts */}
                  <div className="flex flex-col gap-2 pb-1">
                    <p className="text-white/30 text-[11px] font-medium tracking-wide uppercase">Try asking</p>
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="text-left text-sm text-white/70 bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] px-4 py-3 rounded-[16px] text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] text-white rounded-br-[4px]"
                            : "bg-[#1A0F0F] border border-white/10 text-white/90 rounded-bl-[4px]"
                        }`}
                      >
                        {msg.content}
                        {msg.role === "assistant" && streaming && i === messages.length - 1 && msg.content === "" && (
                          <span className="flex items-center gap-1.5 text-white/40">
                            <Loader2 size={12} className="animate-spin" />
                            <span className="text-[11px]">Thinking…</span>
                          </span>
                        )}
                        {msg.role === "assistant" && streaming && i === messages.length - 1 && msg.content !== "" && (
                          <span className="inline-block w-[2px] h-[14px] bg-[#FF4B1F] ml-0.5 animate-pulse align-middle" />
                        )}
                      </div>
                    </div>
                  ))}

                  {error && (
                    <p className="text-red-400 text-xs text-center px-4">{error}</p>
                  )}
                  <div ref={bottomRef} />
                </>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="bg-[#0D0505] border-t border-white/10 px-4 py-3 flex items-center gap-3 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask something…"
                disabled={streaming}
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#FF4B1F]/60 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || streaming}
                className="w-9 h-9 rounded-full bg-gradient-to-b from-[#FF4B1F] to-[#FF6A21] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0"
                aria-label="Send"
              >
                {streaming ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
