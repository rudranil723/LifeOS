"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Target, Plus, LayoutDashboard, Settings, Calendar } from "lucide-react"
import Link from "next/link"

export function Sidebar() {
  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 border-r border-white/5 bg-black/50 p-4 flex flex-col h-full glass-panel"
    >
      <div className="flex items-center gap-2 px-2 pb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
          <Target className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-tight">LifeOS</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider px-2 mb-2">Views</h3>
          <button className="flex items-center gap-3 w-full px-2 py-2 text-sm text-white/80 hover:bg-white/5 rounded-md transition-colors bg-white/5">
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <Link href="/dashboard/planner" className="flex items-center gap-3 w-full px-2 py-2 text-sm text-white/80 hover:bg-white/5 rounded-md transition-colors hover:text-white">
            <Calendar className="w-4 h-4" />
            Smart Planner
          </Link>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Active Goals</h3>
            <button className="text-white/40 hover:text-white/80 transition-colors">
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            <div className="px-2 py-2 flex items-center gap-2 text-sm text-white/70 hover:text-white cursor-pointer hover:bg-white/5 rounded-md transition-all group">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
              Machine Learning
            </div>
            <div className="px-2 py-2 flex items-center gap-2 text-sm text-white/70 hover:text-white cursor-pointer hover:bg-white/5 rounded-md transition-all group">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
              Fitness & Health
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Today's Tasks</h3>
          </div>
          <div className="space-y-1">
            <label className="flex items-start gap-3 px-2 py-2 text-sm text-white/70 hover:bg-white/5 rounded-md transition-colors cursor-pointer">
              <div className="mt-0.5 relative flex items-center justify-center w-4 h-4 border border-white/20 rounded-sm"></div>
              <span className="leading-5">Study Neural Networks Chapter 4</span>
            </label>
            <label className="flex items-start gap-3 px-2 py-2 text-sm text-white/70 hover:bg-white/5 rounded-md transition-colors cursor-pointer">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span className="leading-5 line-through text-white/40">Morning Workout</span>
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-auto border-t border-white/5">
        <button className="flex items-center gap-3 w-full px-2 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </motion.aside>
  )
}
