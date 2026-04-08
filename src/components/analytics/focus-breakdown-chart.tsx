'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';

interface FocusBreakdownChartProps {
  breakdown: {
    tasks: number;
    learning: number;
    engagement: number;
    streak: number;
  };
}

export function FocusBreakdownChart({ breakdown }: FocusBreakdownChartProps) {
  const data = [
    { name: 'Tasks', value: breakdown.tasks, label: 'Tasks (40%)' },
    { name: 'Learning', value: breakdown.learning, label: 'Learning (30%)' },
    { name: 'Engagement', value: breakdown.engagement, label: 'Engagement (15%)' },
    { name: 'Streak', value: breakdown.streak, label: 'Streak (15%)' },
  ];

  const colors = ['#00f0ff', '#00dbe9', '#06b6d4', '#0891b2'];

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Gauge className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Focus Score Breakdown</h3>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 100, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 65, 81)" vertical={false} />
          <XAxis type="number" stroke="rgb(107, 114, 128)" style={{ fontSize: '12px' }} domain={[0, 100]} />
          <YAxis dataKey="label" type="category" stroke="rgb(107, 114, 128)" style={{ fontSize: '11px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(17, 24, 39)',
              border: '1px solid rgb(55, 65, 81)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'rgb(156, 163, 175)' }}
            formatter={(value) => `${(value as number).toFixed(0)}%`}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} isAnimationActive>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
