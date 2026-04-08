'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakCardProps {
  days: number;
}

export function StreakCard({ days }: StreakCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col justify-center items-center">
      <div className="flex items-center justify-between w-full mb-4">
        <h3 className="text-gray-400 text-sm font-medium">Current Streak</h3>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Flame className="w-4 h-4 text-orange-400" />
        </motion.div>
      </div>

      <motion.div
        className="text-5xl font-bold text-white mb-2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {days}
      </motion.div>

      <div className="text-xs text-gray-400 text-center">
        {days === 1 ? 'day' : 'days'} of consistent productivity
      </div>

      {days > 0 && (
        <motion.div
          className="mt-4 text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          🔥
        </motion.div>
      )}
    </div>
  );
}
