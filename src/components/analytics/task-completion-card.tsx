'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface TaskCompletionCardProps {
  rate: number;
  total: number;
}

export function TaskCompletionCard({ rate, total }: TaskCompletionCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col justify-center">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">Task Completion</h3>
        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          className="text-4xl font-bold text-white mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {rate.toFixed(0)}%
        </motion.div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${rate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <div className="text-xs text-gray-400">
          <span className="text-cyan-400 font-semibold">{total}</span> tasks completed
        </div>
      </div>
    </div>
  );
}
