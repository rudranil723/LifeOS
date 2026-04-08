"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Zap, Target, Loader2, Send } from "lucide-react";
import { analyzeLearningState } from "@/lib/actions/coach";

interface CoachingInsightsPanelProps {
  userId: string;
  insight: any | null;
  onInsightUpdated: (insight: any) => void;
}

export default function CoachingInsightsPanel({
  userId,
  insight,
  onInsightUpdated,
}: CoachingInsightsPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [coachResponse, setCoachResponse] = useState<string>("");
  const [coachInput, setCoachInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  const handleRefreshInsights = async () => {
    try {
      setIsGenerating(true);
      const updatedInsight = await analyzeLearningState(userId);
      onInsightUpdated(updatedInsight);
    } catch (err) {
      console.error("Error refreshing insights:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;

    try {
      setIsAsking(true);
      const message = coachInput.trim();
      setCoachInput("");

      // Send to chat API with coaching context
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `You are a learning coach. Please answer this question: ${message}`,
            },
          ],
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullResponse += decoder.decode(value, { stream: true });
            setCoachResponse(fullResponse);
          }
        }
      }
    } catch (err) {
      console.error("Error asking coach:", err);
      setCoachResponse("Error getting response from coach");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-h-full overflow-y-auto">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white/90 mb-1">
          AI Coaching Insights
        </h3>
        <p className="text-xs text-white/40">Personalized guidance for mastery</p>
      </div>

      {/* Insights Cards */}
      {insight ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Observation Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-lg border border-white/10 bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm p-4"
          >
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
              <div>
                <p className="text-xs font-medium text-blue-300 mb-1">
                  Observation
                </p>
                <p className="text-sm text-white/80">{insight.observation}</p>
              </div>
            </div>
          </motion.div>

          {/* Learning Edge Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-lg border border-white/10 bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-sm p-4"
          >
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-purple-400 shrink-0 mt-1" />
              <div>
                <p className="text-xs font-medium text-purple-300 mb-1">
                  Learning Edge
                </p>
                <p className="text-sm text-white/80">{insight.learningEdge}</p>
              </div>
            </div>
          </motion.div>

          {/* Recommended Drill Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-lg border border-white/10 bg-gradient-to-br from-pink-500/20 to-pink-600/10 backdrop-blur-sm p-4"
          >
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-pink-400 shrink-0 mt-1" />
              <div>
                <p className="text-xs font-medium text-pink-300 mb-1">
                  Recommended Drill
                </p>
                <p className="text-sm text-white/80">{insight.drill}</p>
              </div>
            </div>
          </motion.div>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefreshInsights}
            disabled={isGenerating}
            className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 disabled:from-white/10 disabled:to-white/10 border border-indigo-500/30 hover:border-indigo-500/50 text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>Refresh Insights</>
            )}
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRefreshInsights}
          disabled={isGenerating}
          className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-white/20 disabled:to-white/20 text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Insights</>
          )}
        </motion.button>
      )}

      {/* Ask Your Coach Section */}
      <div className="border-t border-white/10 pt-4 mt-auto">
        <h4 className="text-sm font-medium text-white/80 mb-3">Ask Your Coach</h4>

        {/* Response Display */}
        {coachResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-3 bg-white/5 border border-white/10 rounded-lg text-xs text-white/80"
          >
            {coachResponse}
          </motion.div>
        )}

        {/* Input Form */}
        <form onSubmit={handleAskCoach} className="flex gap-2">
          <input
            type="text"
            value={coachInput}
            onChange={(e) => setCoachInput(e.target.value)}
            placeholder="Ask for guidance..."
            disabled={isAsking}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!coachInput.trim() || isAsking}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white transition-colors"
          >
            {isAsking ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
