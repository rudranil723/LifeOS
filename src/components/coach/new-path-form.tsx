"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { createLearningPath } from "@/lib/actions/coach";

interface NewPathFormProps {
  userId: string;
  onCreated: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "Cognitive Science",
  "Programming",
  "Creative",
  "Language",
  "Other",
];

export default function NewPathForm({
  userId,
  onCreated,
  onCancel,
}: NewPathFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      await createLearningPath(userId, title, category, description);
      onCreated();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create learning path"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onSubmit={handleSubmit}
      className="h-64 rounded-lg border border-white/10 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 backdrop-blur-sm p-5 flex flex-col justify-between overflow-hidden"
    >
      <div className="space-y-3">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Path title"
          disabled={isLoading}
          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50"
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isLoading}
          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors disabled:opacity-50"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-black text-white">
              {cat}
            </option>
          ))}
        </select>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          disabled={isLoading}
          rows={2}
          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none disabled:opacity-50"
        />

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-white/20 disabled:to-white/20 text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Creating...
            </>
          ) : (
            "Generate Path"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium rounded-lg transition-all disabled:opacity-50"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </motion.form>
  );
}
