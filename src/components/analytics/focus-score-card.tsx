'use client';

import { motion } from 'framer-motion';

interface FocusScoreCardProps {
  score: number;
  breakdown: {
    tasks: number;
    learning: number;
    engagement: number;
    streak: number;
  };
}

export function FocusScoreCard({ score, breakdown }: FocusScoreCardProps) {
  const getColor = (value: number) => {
    if (value >= 70) return 'from-green-500 to-green-600';
    if (value >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getTextColor = (value: number) => {
    if (value >= 70) return 'text-green-400';
    if (value >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col justify-center items-center">
      <h3 className="text-gray-400 text-sm font-medium mb-4">Focus Score</h3>
      
      {/* Circular Gauge */}
      <div className="relative w-32 h-32 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgb(55, 65, 81)"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={score >= 70 ? '#10b981' : score >= 40 ? '#eab308' : '#ef4444'} />
              <stop offset="100%" stopColor={score >= 70 ? '#059669' : score >= 40 ? '#ca8a04' : '#dc2626'} />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-3xl font-bold ${getTextColor(score)}`}>{score}</div>
          <div className="text-xs text-gray-500">/100</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="w-full space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Tasks</span>
          <span className="text-cyan-400 font-semibold">{breakdown.tasks}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Learning</span>
          <span className="text-cyan-400 font-semibold">{breakdown.learning}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Engagement</span>
          <span className="text-cyan-400 font-semibold">{breakdown.engagement}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Streak</span>
          <span className="text-cyan-400 font-semibold">{breakdown.streak}%</span>
        </div>
      </div>
    </div>
  );
}
