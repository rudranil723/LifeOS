"use client"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot } from "lucide-react"

type Message = { role: "user" | "assistant"; content: string; id: string }

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/chat/history")
        if (res.ok) {
          const history = await res.json()
          const formattedMessages = history.map((msg: any, idx: number) => ({
            id: msg.id || `history-${idx}`,
            role: msg.role,
            content: msg.content,
          }))
          setMessages(formattedMessages)
        }
      } catch (err) {
        console.error("Failed to load chat history:", err)
      }
    }
    loadHistory()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    const allMessages = [...messages, userMessage]
    setMessages(allMessages)
    setInput("")
    setLoading(true)

    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`${res.status}: ${errorText}`)
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let full = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          full += decoder.decode(value, { stream: true })
          setMessages(prev =>
            prev.map(m => m.id === assistantId ? { ...m, content: full } : m)
          )
        }
      }

      if (!full) throw new Error("Empty response from AI. Check your API key.")

    } catch (err: any) {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, content: `Error: ${err.message}` } : m
        )
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-black/90 border-r border-white/5">
      <header className="h-14 flex items-center shrink-0 px-6 border-b border-white/5 bg-black/40">
        <h2 className="text-sm font-medium text-white/90">LifeOS Brain</h2>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {loading ? "Thinking..." : "Online"}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-white/30 text-sm">
            Say hello to LifeOS
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center mt-1 ${m.role === "user" ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-white/80"
                }`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
                  ? "bg-indigo-500/20 border border-indigo-500/10 text-white rounded-tr-sm"
                  : "bg-white/5 border border-white/5 text-white/90 rounded-tl-sm"
                }`}>
                {m.content || (loading && m.role === "assistant" ? "..." : "")}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/5">
        <form onSubmit={sendMessage} className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to LifeOS..."
            autoComplete="off"
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-500 text-white disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
