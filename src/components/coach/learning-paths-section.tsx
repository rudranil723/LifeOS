"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import LearningPathCard from "./learning-path-card";
import NewPathForm from "./new-path-form";

interface LearningPathsProps {
  paths: any[];
  userId: string;
  onPathsUpdated: (paths: any[]) => void;
}

export default function LearningPathsSection({
  paths,
  userId,
  onPathsUpdated,
}: LearningPathsProps) {
  const [showNewPathForm, setShowNewPathForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handlePathCreated = () => {
    setShowNewPathForm(false);
    // Paths will be updated via server action
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white/90 mb-1">
          Learning Paths
        </h3>
        <p className="text-xs text-white/40">
          {paths.length} active path{paths.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Grid of Learning Paths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {paths.map((path, idx) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <LearningPathCard
              path={path}
              userId={userId}
              onPathsUpdated={onPathsUpdated}
            />
          </motion.div>
        ))}

        {/* New Path Card */}
        {!showNewPathForm && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: paths.length * 0.1 }}
            onClick={() => setShowNewPathForm(true)}
            className="h-64 rounded-lg border-2 border-dashed border-white/10 hover:border-indigo-500/50 bg-black/20 hover:bg-black/40 transition-all flex items-center justify-center group"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 text-white/30 group-hover:text-indigo-400 mx-auto mb-2 transition-colors" />
              <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors font-medium">
                Create New Path
              </p>
            </div>
          </motion.button>
        )}

        {/* New Path Form */}
        {showNewPathForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: paths.length * 0.1 }}
          >
            <NewPathForm
              userId={userId}
              onCreated={handlePathCreated}
              onCancel={() => setShowNewPathForm(false)}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
