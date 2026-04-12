"use client"

import { useState, useEffect } from "react"
import { Activity, Clock, Flame, LineChart, BarChart3, Loader2 } from "lucide-react"
import Link from "next/link"

interface DashboardData {
  focusScore: number
  streakDays: number
  studyHours: number
  taskCompletion: {
    completed: number
    total: number
    percentage: number
  }
  activityData: Array<{
    date: string
    count: number
  }>
}

export function DashboardPanel() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/dashboard/summary")
        if (!response.ok) throw new Error("Failed to fetch data")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Poll every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const focusScoreColor =
    data && data.focusScore >= 70
      ? "text-emerald-400"
      : data && data.focusScore >= 40
        ? "text-yellow-400"
        : "text-red-400"

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-white/10 rounded w-1/2"></div>
    </div>
  )
  return (
    <div className="w-80 bg-black/60 p-6 hidden lg:flex flex-col h-full border-l border-white/5 overflow-y-auto">
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
            {loading ? (
              <SkeletonLoader />
            ) : (
              <span className={`text-2xl font-bold ${focusScoreColor}`}>
                {data?.focusScore || 0}%
              </span>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-orange-400">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium">Streak</span>
            </div>
            {loading ? (
              <SkeletonLoader />
            ) : (
              <span className="text-2xl font-bold text-white/90">
                {data?.streakDays}d
              </span>
            )}
          </div>
        </div>

        {/* Study Hours Line */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white/70">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">Study Hours</span>
            </div>
            {loading ? (
              <SkeletonLoader />
            ) : (
              <span className="text-sm font-medium text-white/90">
                {data?.studyHours}h
              </span>
            )}
          </div>

          {/* Mock Graph - using dummy data for visualization */}
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
                {loading ? (
                  <SkeletonLoader />
                ) : (
                  <span className="text-xs font-semibold inline-block text-white/90">
                    {data?.taskCompletion.completed}/{data?.taskCompletion.total} Tasks
                  </span>
                )}
              </div>
              <div className="text-right">
                {loading ? (
                  <SkeletonLoader />
                ) : (
                  <span className="text-xs font-semibold inline-block text-white/60">
                    {data?.taskCompletion.percentage}%
                  </span>
                )}
              </div>
            </div>
            <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-white/10">
              <div
                style={{ width: `${data?.taskCompletion.percentage || 0}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              ></div>
            </div>
          </div>
        </div>

        {/* Activity Density Mini */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white/70">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium">Activity</span>
            </div>
            <Link href="/analytics" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              View Full →
            </Link>
          </div>

          {/* Mini Activity Chart */}
          <div className="h-12 flex items-end gap-1 opacity-80">
            {loading ? (
              <div className="w-full h-full flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-white/10 rounded-t-sm animate-pulse"
                  />
                ))}
              </div>
            ) : (
              data?.activityData &&
              data.activityData.map((day, i) => {
                const maxCount = Math.max(
                  ...data.activityData.map((d) => d.count),
                  1
                )
                const height = (day.count / maxCount) * 100

                return (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm hover:opacity-100 transition-opacity"
                    style={{ height: `${height}%`, opacity: 0.7, minHeight: "4px" }}
                    title={`${day.count} tasks`}
                  />
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
