'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface LearningVelocityChartProps {
  paths: Array<{
    id: string;
    title: string;
    overallProgress: number;
  }>;
}

export function LearningVelocityChart({ paths }: LearningVelocityChartProps) {
  // Create dummy historical data for visualization (6 weeks)
  const weeks = Array.from({ length: 6 }, (_, i) => ({
    week: `W${i + 1}`,
    ...Object.fromEntries(
      paths.slice(0, 3).map((path) => [
        path.title.substring(0, 10),
        Math.max(10, (path.overallProgress * (6 - i)) / 6 + Math.random() * 10),
      ])
    ),
  }));

  const colors = ['#00f0ff', '#00dbe9', '#06b6d4'];

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Learning Velocity</h3>
        <span className="text-xs text-gray-500 ml-auto">{paths.length} paths</span>
      </div>

      {paths.length === 0 ? (
        <div className="h-60 flex items-center justify-center text-gray-500">
          <p>No learning paths yet. Start learning to see progress!</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={weeks}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 65, 81)" vertical={false} />
            <XAxis dataKey="week" stroke="rgb(107, 114, 128)" style={{ fontSize: '12px' }} />
            <YAxis stroke="rgb(107, 114, 128)" style={{ fontSize: '12px' }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(17, 24, 39)',
                border: '1px solid rgb(55, 65, 81)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgb(156, 163, 175)' }}
              formatter={(value) => `${(value as number).toFixed(0)}%`}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'rgb(156, 163, 175)' }} />
            {paths.slice(0, 3).map((path, i) => (
              <React.Fragment key={path.id}>
                <Line
                  type="monotone"
                  dataKey={path.title.substring(0, 10)}
                  stroke={colors[i]}
                  strokeWidth={2}
                  dot={{ radius: 4, fill: colors[i] }}
                  activeDot={{ r: 6 }}
                  isAnimationActive
                />
              </React.Fragment>
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
