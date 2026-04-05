"use client"

import { useChat } from "@ai-sdk/react"
import { Send, User, Bot } from "lucide-react"
import { useEffect, useRef } from "react"

export function ChatWindow() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 flex flex-col h-full bg-black/90 border-r border-white/5 relative">
      <header className="h-14 flex items-center shrink-0 px-6 border-b border-white/5 bg-black/40">
        <h2 className="text-sm font-medium text-white/90">LifeOS Brain</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-white/40 text-sm">
            Ready to help you crush your goals. Say hello!
          </div>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center mt-1 ${
                  m.role === "user" ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-white/80"
                }`}>
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed ${
                  m.role === "user" 
                    ? "bg-indigo-500/20 border border-indigo-500/10 text-white rounded-tr-sm" 
                    : "bg-white/5 border border-white/5 text-white/90 rounded-tl-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-transparent border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <input 
            value={input || ""}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          <button 
            type="submit"
            disabled={!input?.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-500 text-white disabled:opacity-50 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}