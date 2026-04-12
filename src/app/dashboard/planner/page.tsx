"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Zap,
  Coffee,
  RotateCcw,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ScheduleBlock {
  time: string;
  title: string;
  taskId?: string;
  goalId?: string;
  duration: number;
  type: "focus" | "break" | "review";
}

interface DailySchedule {
  blocks: ScheduleBlock[];
  summary?: string;
}

interface DailyPlan {
  id: string;
  userId: string;
  date: string;
  schedule: DailySchedule;
  createdAt: string;
  updatedAt: string;
}

export default function PlannerPage() {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchTodaysPlan();
  }, []);

  const fetchTodaysPlan = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/planner/today");
      if (!res.ok) throw new Error("Failed to fetch plan");
      const data = await res.json();
      setPlan(data.plan);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching plan:", err);
      setError(err.message || "Failed to load plan");
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    try {
      setGenerating(true);
      setError(null);
      const res = await fetch("/api/planner/generate", { method: "POST" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate plan");
      }
      const data = await res.json();
      setPlan(data);
    } catch (err: any) {
      console.error("Error generating plan:", err);
      setError(err.message || "Failed to generate plan");
    } finally {
      setGenerating(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "DONE" ? "TODO" : "DONE";
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        if (newStatus === "DONE") {
          setCompletedTasks((prev) => new Set(prev).add(taskId));
        } else {
          setCompletedTasks((prev) => {
            const next = new Set(prev);
            next.delete(taskId);
            return next;
          });
        }
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case "focus":
        return "from-blue-500/30 to-blue-600/20 border-blue-500/50";
      case "break":
        return "from-emerald-500/30 to-emerald-600/20 border-emerald-500/50";
      case "review":
        return "from-purple-500/30 to-purple-600/20 border-purple-500/50";
      default:
        return "from-indigo-500/30 to-indigo-600/20 border-indigo-500/50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "focus":
        return <Zap className="w-4 h-4 text-blue-400" />;
      case "break":
        return <Coffee className="w-4 h-4 text-emerald-400" />;
      case "review":
        return <RotateCcw className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "focus":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "break":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "review":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
    }
  };

  const blocks = plan?.schedule?.blocks || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-black/90 border-r border-white/5 overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center shrink-0 px-6 border-b border-white/5 bg-black/40">
        <h2 className="text-sm font-medium text-white/90">Daily Smart Planner</h2>
        <div className="ml-auto flex items-center gap-3">
          {plan && (
            <p className="text-xs text-white/50">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generatePlan}
            disabled={generating}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-white/20 disabled:to-white/20 text-white text-xs font-medium rounded-md transition-all flex items-center gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-3 h-3" />
                Generate My Day
              </>
            )}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-300">Error</p>
              <p className="text-xs text-red-200">{error}</p>
            </div>
          </motion.div>
        )}

        {loading ? (
          // Loading Skeleton
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 bg-white/5 border border-white/10 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : blocks.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Clock className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-lg font-semibold text-white/80">
              No Plan Yet
            </h3>
            <p className="text-sm text-white/50 text-center max-w-sm">
              Click "Generate My Day" to create a structured schedule based on
              your goals and tasks.
            </p>
          </motion.div>
        ) : (
          // Schedule Timeline
          <div className="space-y-6 max-w-2xl">
            {plan?.schedule?.summary && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <p className="text-xs font-medium text-white/60 mb-2">
                  Today's Focus
                </p>
                <p className="text-sm text-white/80">{plan.schedule.summary}</p>
              </motion.div>
            )}

            <div className="relative">
              {/* Timeline Connector */}
              <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/50 to-purple-500/50" />

              {/* Schedule Blocks */}
              <div className="space-y-4">
                {blocks.map((block, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative pl-20"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 w-10 h-10 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black border-2 border-indigo-500/50 flex items-center justify-center shadow-lg">
                        {getTypeIcon(block.type)}
                      </div>
                    </div>

                    {/* Block Card */}
                    <motion.div
                      whileHover={{ scale: 1.01, x: 4 }}
                      className={`p-4 rounded-lg border border-white/10 bg-gradient-to-r ${getBlockColor(
                        block.type
                      )} backdrop-blur-sm transition-all cursor-default`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-white/60">
                              {block.time}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium border ${getTypeBadgeClass(
                                block.type
                              )}`}
                            >
                              {block.type}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white/90">
                            {block.title}
                          </h4>
                        </div>
                        <span className="text-xs text-white/40 shrink-0">
                          {block.duration}m
                        </span>
                      </div>

                      {/* Task Completion */}
                      {block.taskId && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            toggleTaskCompletion(
                              block.taskId!,
                              completedTasks.has(block.taskId!) ? "DONE" : "TODO"
                            )
                          }
                          className="mt-3 flex items-center gap-2 text-xs text-white/60 hover:text-white/90 transition-colors"
                        >
                          {completedTasks.has(block.taskId!) ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                          <span>
                            {completedTasks.has(block.taskId!)
                              ? "Completed"
                              : "Mark complete"}
                          </span>
                        </motion.button>
                      )}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
