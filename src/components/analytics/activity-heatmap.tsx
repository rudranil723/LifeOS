'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

interface ActivityHeatmapProps {
  heatmap: Array<{
    date: string;
    count: number;
    level: number;
  }>;
}

export function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const getColor = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-gray-700';
      case 1:
        return 'bg-cyan-900';
      case 2:
        return 'bg-cyan-700';
      case 3:
        return 'bg-cyan-500';
      case 4:
        return 'bg-cyan-400';
      default:
        return 'bg-gray-700';
    }
  };

  // Group heatmap data into weeks (7 days per week)
  const weeks = [];
  for (let i = 0; i < heatmap.length; i += 7) {
    weeks.push(heatmap.slice(i, i + 7));
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Activity Heatmap</h3>
        <span className="text-xs text-gray-500 ml-auto">365-day view</span>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-1 min-w-full">
          {/* Day labels on the left */}
          <div className="flex flex-col justify-end gap-1 pr-2">
            {dayLabels.map((day) => (
              <div key={day} className="w-6 h-6 flex items-center justify-center text-xs text-gray-500">
                {day.charAt(0)}
              </div>
            ))}
          </div>

          {/* Weeks grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-6 h-6 rounded cursor-pointer transition-all ${getColor(day.level)} ${
                      hoveredCell === `${weekIndex}-${dayIndex}` ? 'ring-2 ring-cyan-300 shadow-lg' : ''
                    }`}
                    whileHover={{ scale: 1.2 }}
                    onMouseEnter={() => setHoveredCell(`${weekIndex}-${dayIndex}`)}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`${new Date(day.date).toLocaleDateString()}: ${day.count} tasks`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-4 mt-6 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div key={level} className={`w-3 h-3 rounded ${getColor(level)}`} />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Hover tooltip */}
      {hoveredCell && (
        <motion.div
          className="mt-4 text-sm text-cyan-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {hoveredCell && heatmap.length > 0 && (
            <p>
              {new Date(heatmap[0].date).toLocaleDateString()}: Contribution data updating...
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
