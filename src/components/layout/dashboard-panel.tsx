"use client"

import { Activity, Clock, Flame, LineChart } from "lucide-react"

export function DashboardPanel() {
  return (
    <div className="w-80 bg-black/60 p-6 flex flex-col h-full border-l border-white/5 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-lg font-semibold tracking-tight text-white mb-1">Today's Insights</h2>
        <p className="text-xs text-white/40">Real-time productivity analytics</p>
      </div>

      <div className="space-y-6">
        {/* Simple Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-medium">Focus</span>
            </div>
            <span className="text-2xl font-bold text-white/90">84%</span>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-orange-400">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium">Streak</span>
            </div>
            <span className="text-2xl font-bold text-white/90">5d</span>
          </div>
        </div>

        {/* Study Hours Line */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">Study Hours</span>
            </div>
            <span className="text-sm font-medium text-white/90">3.5h</span>
          </div>
          
          {/* Mock Graph */}
          <div className="h-16 flex items-end gap-1.5 opacity-80">
            {[20, 35, 25, 40, 55, 30, 45].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-indigo-500/40 rounded-t-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white/70 mb-4">
            <LineChart className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">Task Completion</span>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-white/90">
                  4/6 Tasks
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-white/60">
                  66%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-white/10">
              <div style={{ width: "66%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
