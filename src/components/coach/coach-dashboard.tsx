"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LearningPathsSection from "./learning-paths-section";
import RetentionVelocityChart from "./retention-velocity-chart";
import CoachingInsightsPanel from "./coaching-insights-panel";

interface DashboardData {
  paths: any[];
  latestInsight: any | null;
  velocityData: any[];
}

interface CoachDashboardProps {
  initialData: DashboardData;
  userId: string;
}

export default function CoachDashboard({
  initialData,
  userId,
}: CoachDashboardProps) {
  const [data, setData] = useState<DashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleInsightsRefresh = (updatedInsight: any) => {
    setData((prev) => ({
      ...prev,
      latestInsight: updatedInsight,
    }));
  };

  const handlePathsUpdated = (updatedPaths: any[]) => {
    setData((prev) => ({
      ...prev,
      paths: updatedPaths,
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center shrink-0 px-6 border-b border-white/5 bg-black/40">
        <h2 className="text-sm font-medium text-white/90">
          AI Learning Coach
        </h2>
        <p className="ml-auto text-xs text-white/40">
          Mastery is a Flow State
        </p>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden gap-6 p-6">
        {/* Left Column - 2/3 width */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-[2] flex flex-col gap-6 overflow-y-auto"
        >
          {/* Learning Paths Section */}
          <LearningPathsSection
            paths={data.paths}
            userId={userId}
            onPathsUpdated={handlePathsUpdated}
          />

          {/* Retention Velocity Chart */}
          <RetentionVelocityChart velocityData={data.velocityData} />
        </motion.div>

        {/* Right Column - 1/3 width */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-[1] flex flex-col overflow-y-auto"
        >
          <CoachingInsightsPanel
            userId={userId}
            insight={data.latestInsight}
            onInsightUpdated={handleInsightsRefresh}
          />
        </motion.div>
      </div>
    </div>
  );
}
