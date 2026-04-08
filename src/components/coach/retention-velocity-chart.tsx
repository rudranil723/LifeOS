"use client";

import { motion } from "framer-motion";

interface VelocityDataPoint {
  week: string;
  [key: string]: string | number;
}

interface RetentionVelocityChartProps {
  velocityData: VelocityDataPoint[];
}

export default function RetentionVelocityChart({
  velocityData,
}: RetentionVelocityChartProps) {
  if (!velocityData || velocityData.length === 0) {
    return null;
  }

  // Get all path names (keys except 'week')
  const pathNames = Object.keys(velocityData[0]).filter((k) => k !== "week");
  const colors = [
    "from-indigo-500 to-indigo-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
  ];

  // Find max score for scaling
  const maxScore = Math.max(
    ...velocityData.flatMap((d) =>
      pathNames.map((name) => (typeof d[name] === "number" ? d[name] : 0))
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-white/10 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white/90 mb-1">
          Retention Velocity
        </h3>
        <p className="text-xs text-white/40">
          Knowledge durability over time across your learning paths
        </p>
      </div>

      {/* Simple Bar Chart */}
      <div className="space-y-6">
        {/* Chart Area */}
        <div className="overflow-x-auto">
          <div className="min-w-[400px] flex gap-2">
            {velocityData.map((dataPoint, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col items-center gap-2 flex-1"
              >
                {/* Bar */}
                <div className="w-full flex justify-center items-end h-32 gap-0.5 bg-white/5 rounded p-2">
                  {pathNames.map((name, nameIdx) => {
                    const value =
                      typeof dataPoint[name] === "number"
                        ? dataPoint[name]
                        : 0;
                    const height = maxScore > 0 ? (value / maxScore) * 100 : 0;
                    return (
                      <motion.div
                        key={nameIdx}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: idx * 0.05 + nameIdx * 0.02 }}
                        className={`flex-1 rounded-t-md bg-gradient-to-t ${colors[nameIdx % colors.length]} opacity-80 hover:opacity-100 transition-opacity relative group`}
                        title={`${name}: ${value}`}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-white/20 rounded px-2 py-1 text-xs text-white whitespace-nowrap pointer-events-none">
                          {Math.round(value as number)}%
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Week Label */}
                <span className="text-xs text-white/50 font-medium">
                  {dataPoint.week}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
          {pathNames.map((name, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[idx % colors.length]}`}
              />
              <span className="text-xs text-white/60">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
