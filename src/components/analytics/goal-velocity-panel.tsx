'use client';

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  progress: number;
  deadline?: string;
  status?: string;
}

interface GoalVelocityPanelProps {
  goals: Goal[];
}

export function GoalVelocityPanel({ goals }: GoalVelocityPanelProps) {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-400';
      case 'in progress':
        return 'text-cyan-400';
      case 'blocked':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-green-600';
    if (progress >= 50) return 'from-cyan-500 to-cyan-600';
    return 'from-orange-500 to-orange-600';
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Goal Velocity</h3>
        <span className="text-xs text-gray-500 ml-auto">{goals.length} goals</span>
      </div>

      <div className="space-y-4 max-h-72 overflow-y-auto">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No goals yet. Create one to get started!</p>
          </div>
        ) : (
          goals.slice(0, 5).map((goal, i) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white line-clamp-1">{goal.title}</p>
                  <p className={`text-xs ${getStatusColor(goal.status)}`}>
                    {goal.status || 'In Progress'}
                  </p>
                </div>
                <span className="text-xs text-gray-500 ml-2">{goal.progress}%</span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getProgressColor(goal.progress)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + i * 0.05 }}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {goals.length > 5 && (
        <div className="mt-4 text-center text-xs text-gray-500">
          +{goals.length - 5} more goals
        </div>
      )}
    </motion.div>
  );
}
