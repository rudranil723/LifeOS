"use client"

import { Send, Bot, Sparkles } from "lucide-react"

export function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative border-r border-white/5 bg-black/80">
      
      {/* Header */}
      <header className="absolute top-0 w-full h-14 flex items-center justify-between px-6 border-b border-white/5 backdrop-blur-md z-10">
        <h2 className="text-sm font-medium text-white/90">Brain</h2>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </span>
        </div>
      </header>

      {/* Main Chat Area (Empty State) */}
      <div className="w-full max-w-3xl flex-1 flex flex-col overflow-hidden pt-14 pb-24">
        <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 group-hover:scale-110 transition-transform duration-500" />
            <Bot className="w-8 h-8 text-white/80" />
          </div>
          <div className="space-y-1 mt-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white/90">Good afternoon</h1>
            <p className="text-white/40">How can I assist with your goals today?</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-xl">
            <button className="text-left px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
              <div className="flex items-center gap-2 text-sm text-white/70 mb-1">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Plan my day
              </div>
              <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Generate an optimal schedule based on my tasks</p>
            </button>
            <button className="text-left px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
              <div className="flex items-center gap-2 text-sm text-white/70 mb-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Study Mode
              </div>
              <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Start a focused learning session</p>
            </button>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-6 w-full max-w-3xl px-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Talk to LifeOS..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-2xl transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-white/30 mt-3 font-medium">
          LifeOS can make mistakes. Consider verifying important information.
        </p>
      </div>

    </div>
  )
}
