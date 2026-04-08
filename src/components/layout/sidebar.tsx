"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Target, Plus, LayoutDashboard, Settings, Calendar, GraduationCap, BarChart2, Loader2 } from "lucide-react"
import Link from "next/link"

interface Goal {
  id: string
  title: string
  status: string
}

interface Task {
  id: string
  title: string
  status: string
}

interface DashboardSummary {
  activeGoals: Goal[]
  todaysTasks: Task[]
}

const generateGoalColor = (index: number) => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
  ]
  return colors[index % colors.length]
}

export function Sidebar() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [completingTask, setCompletingTask] = useState<string | null>(null)
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [creatingGoal, setCreatingGoal] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard/summary")
      if (!response.ok) throw new Error("Failed to fetch dashboard data")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      setCompletingTask(taskId)
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DONE" }),
      })
      if (!response.ok) throw new Error("Failed to complete task")
      
      // Optimistic update
      if (data) {
        setData({
          ...data,
          todaysTasks: data.todaysTasks.map((t) =>
            t.id === taskId ? { ...t, status: "DONE" } : t
          ),
        })
      }
    } catch (error) {
      console.error("Error completing task:", error)
    } finally {
      setCompletingTask(null)
    }
  }

  const handleCreateGoal = async () => {
    if (!newGoalTitle.trim()) return

    try {
      setCreatingGoal(true)
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newGoalTitle }),
      })
      if (!response.ok) throw new Error("Failed to create goal")
      
      setNewGoalTitle("")
      setShowNewGoalForm(false)
      // Refresh data
      await fetchDashboardData()
    } catch (error) {
      console.error("Error creating goal:", error)
    } finally {
      setCreatingGoal(false)
    }
  }
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
          <Link href="/coach" className="flex items-center gap-3 w-full px-2 py-2 text-sm text-white/80 hover:bg-white/5 rounded-md transition-colors hover:text-white">
            <GraduationCap className="w-4 h-4" />
            Coach
          </Link>
          <Link href="/analytics" className="flex items-center gap-3 w-full px-2 py-2 text-sm text-white/80 hover:bg-white/5 rounded-md transition-colors hover:text-white">
            <BarChart2 className="w-4 h-4" />
            Analytics
          </Link>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Active Goals</h3>
            <button
              onClick={() => setShowNewGoalForm(!showNewGoalForm)}
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {loading ? (
            <div className="px-2 py-2 flex items-center gap-2 text-sm text-white/50">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : showNewGoalForm ? (
            <div className="px-2 py-2 space-y-2">
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Goal title..."
                className="w-full text-sm bg-white/10 border border-white/20 rounded px-2 py-1 text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                onKeyPress={(e) => e.key === "Enter" && handleCreateGoal()}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateGoal}
                  disabled={creatingGoal || !newGoalTitle.trim()}
                  className="flex-1 text-xs bg-white/20 hover:bg-white/30 disabled:opacity-50 text-white py-1 rounded transition-colors"
                >
                  {creatingGoal ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => {
                    setShowNewGoalForm(false)
                    setNewGoalTitle("")
                  }}
                  className="flex-1 text-xs bg-white/10 hover:bg-white/20 text-white py-1 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : data?.activeGoals && data.activeGoals.length > 0 ? (
            <div className="space-y-1">
              {data.activeGoals.map((goal, index) => (
                <div
                  key={goal.id}
                  className="px-2 py-2 flex items-center gap-2 text-sm text-white/70 hover:text-white cursor-pointer hover:bg-white/5 rounded-md transition-all group"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${generateGoalColor(index)} group-hover:scale-125 transition-transform`}
                  />
                  <span className="truncate">{goal.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-2 py-2 text-xs text-white/40">No active goals</div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Today's Tasks</h3>
          </div>
          <div className="space-y-1">
            {loading ? (
              <div className="px-2 py-2 flex items-center gap-2 text-sm text-white/50">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : data?.todaysTasks && data.todaysTasks.length > 0 ? (
              data.todaysTasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-start gap-3 px-2 py-2 text-sm text-white/70 hover:bg-white/5 rounded-md transition-colors cursor-pointer group"
                >
                  <div className="mt-0.5 relative flex items-center justify-center w-4 h-4">
                    {task.status === "DONE" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <>
                        <div className="absolute inset-0 border border-white/20 rounded-sm group-hover:border-white/40 transition-colors"></div>
                        {completingTask === task.id && (
                          <Loader2 className="w-3 h-3 animate-spin text-white/60 absolute" />
                        )}
                      </>
                    )}
                  </div>
                  <span
                    className={`leading-5 flex-1 ${
                      task.status === "DONE"
                        ? "line-through text-white/40"
                        : "text-white/70 group-hover:text-white"
                    }`}
                    onClick={() => task.status !== "DONE" && handleCompleteTask(task.id)}
                  >
                    {task.title}
                  </span>
                </label>
              ))
            ) : (
              <div className="px-2 py-2 text-xs text-white/40">No tasks today</div>
            )}
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
