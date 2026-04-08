'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface MoodIndexCardProps {
  score: number;
  label: string;
  summary?: string;
}

export function MoodIndexCard({ score, label, summary }: MoodIndexCardProps) {
  const getMoodColor = (l: string) => {
    switch (l.toLowerCase()) {
      case 'stressed':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'focused':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const getMoodEmoji = (l: string) => {
    switch (l.toLowerCase()) {
      case 'stressed':
        return '😰';
      case 'focused':
        return '🎯';
      default:
        return '😊';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">Mood Index</h3>
        <Brain className="w-4 h-4 text-cyan-400" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <motion.div
          className="text-5xl"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {getMoodEmoji(label)}
        </motion.div>

        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">{score}</div>
          <motion.div
            className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${getMoodColor(label)}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {label}
          </motion.div>
        </div>

        {summary && (
          <p className="text-xs text-gray-400 text-center line-clamp-2 mt-2">
            {summary}
          </p>
        )}
      </div>
    </div>
  );
}
