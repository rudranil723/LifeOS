'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FocusScoreCard } from './focus-score-card';
import { MoodIndexCard } from './mood-index-card';
import { TaskCompletionCard } from './task-completion-card';
import { StreakCard } from './streak-card';
import { ActivityDensityChart } from './activity-density-chart';
import { LearningVelocityChart } from './learning-velocity-chart';
import { GoalVelocityPanel } from './goal-velocity-panel';
import { FocusBreakdownChart } from './focus-breakdown-chart';
import { ActivityHeatmap } from './activity-heatmap';

interface AnalyticsDashboardProps {
  metrics: any;
  focusScore: any;
  heatmap: any;
  mood: any;
  days: number;
}

export default function AnalyticsDashboard({
  metrics,
  focusScore,
  heatmap,
  mood,
  days,
}: AnalyticsDashboardProps) {
  const [selectedDays, setSelectedDays] = useState(days);

  const taskCompletionRate = metrics.taskMetrics?.completionRate || 0;
  const streakDays = metrics.streakData?.currentStreak || 0;
  const pastSevenDays = heatmap?.slice(0, 7) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index?: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: (index || 0) * 0.05,
      },
    }),
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Days Toggle */}
      <motion.div variants={itemVariants} className="flex gap-3">
        {[7, 30].map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDays(d)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedDays === d
                ? 'bg-cyan-500 text-gray-900 shadow-lg shadow-cyan-500/50'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {d} Days
          </button>
        ))}
      </motion.div>

      {/* Top Row: 4 Stat Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FocusScoreCard score={focusScore.score} breakdown={focusScore.breakdown} />
          <MoodIndexCard score={mood.score} label={mood.label} summary={mood.summary} />
          <TaskCompletionCard rate={taskCompletionRate} total={metrics.taskMetrics?.total || 0} />
          <StreakCard days={streakDays} />
        </div>
      </motion.div>

      {/* Middle Row: 2 Charts */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityDensityChart data={pastSevenDays} />
          <LearningVelocityChart paths={metrics.learningMetrics?.paths || []} />
        </div>
      </motion.div>

      {/* Bottom Row: Goal Velocity + Focus Breakdown */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GoalVelocityPanel goals={metrics.goalMetrics?.goals || []} />
          <FocusBreakdownChart breakdown={focusScore.breakdown} />
        </div>
      </motion.div>

      {/* Full Width: Activity Heatmap */}
      <motion.div variants={itemVariants}>
        <ActivityHeatmap heatmap={heatmap} />
      </motion.div>
    </motion.div>
  );
}
