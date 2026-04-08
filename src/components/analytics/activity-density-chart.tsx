'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface ActivityDensityChartProps {
  data: Array<{
    date: string;
    count: number;
    level: number;
  }>;
}

export function ActivityDensityChart({ data }: ActivityDensityChartProps) {
  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: item.count,
    }));

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Activity Density</h3>
        <span className="text-xs text-gray-500 ml-auto">Last 7 days</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 65, 81)" vertical={false} />
          <XAxis dataKey="date" stroke="rgb(107, 114, 128)" style={{ fontSize: '12px' }} />
          <YAxis stroke="rgb(107, 114, 128)" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(17, 24, 39)',
              border: '1px solid rgb(55, 65, 81)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'rgb(156, 163, 175)' }}
            formatter={(value) => [`${value} tasks`, 'Completed']}
          />
          <Bar
            dataKey="count"
            fill="url(#activityGradient)"
            radius={[8, 8, 0, 0]}
            isAnimationActive
          />
          <defs>
            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#00dbe9" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
