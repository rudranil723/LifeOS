"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { startLearningSession } from "@/lib/actions/coach";
import { getLearningDashboardData } from "@/lib/actions/coach";

interface LearningPathCardProps {
  path: any;
  userId: string;
  onPathsUpdated: (paths: any[]) => void;
}

export default function LearningPathCard({
  path,
  userId,
  onPathsUpdated,
}: LearningPathCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      await startLearningSession(userId, path.id);

      // Refetch updated data
      const updated = await getLearningDashboardData(userId);
      onPathsUpdated(updated.paths);
    } catch (err) {
      console.error("Error starting session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "cognitive science":
        return "from-purple-500/30 to-purple-600/20 border-purple-500/50";
      case "programming":
        return "from-blue-500/30 to-blue-600/20 border-blue-500/50";
      case "creative":
        return "from-pink-500/30 to-pink-600/20 border-pink-500/50";
      case "language":
        return "from-green-500/30 to-green-600/20 border-green-500/50";
      default:
        return "from-indigo-500/30 to-indigo-600/20 border-indigo-500/50";
    }
  };

  const getCategoryTextColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "cognitive science":
        return "text-purple-300";
      case "programming":
        return "text-blue-300";
      case "creative":
        return "text-pink-300";
      case "language":
        return "text-green-300";
      default:
        return "text-indigo-300";
    }
  };

  const topMastery = path.masteryLogs.slice(0, 3);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`h-64 rounded-lg border border-white/10 bg-gradient-to-br ${getCategoryColor(path.category)} backdrop-blur-sm p-5 flex flex-col justify-between overflow-hidden relative group`}
    >
      {/* Background gradient accent */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div>
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full bg-white/10 border border-white/20 ${getCategoryTextColor(path.category)}`}
          >
            {path.category}
          </span>
        </div>

        {/* Title and Description */}
        <div>
          <h4 className="font-semibold text-white/90 text-base mb-1">
            {path.title}
          </h4>
          {path.description && (
            <p className="text-xs text-white/50 line-clamp-2">
              {path.description}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium">Progress</span>
            <span className="text-xs font-bold text-white/80">
              {path.overallProgress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${path.overallProgress}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
        </div>

        {/* Concepts Pills */}
        {topMastery.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topMastery.map((log: any, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded-full border border-white/10"
              >
                {log.masteryScore}%
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleContinue}
        disabled={isLoading}
        className="relative z-10 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-white/20 disabled:to-white/20 text-white text-xs font-medium rounded-lg transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            Starting...
          </>
        ) : (
          <>
            <Play className="w-3 h-3" />
            Continue
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
