"use server"

import db from "../db";
import { auth } from "@clerk/nextjs/server";
import { Task, Goal, LearningPath, ChatMessage } from "@prisma/client";

// Types
interface TaskMetric {
  date: string;
  count: number;
}

interface GoalData {
  id: string;
  title: string;
  progress: number;
  deadline: string | null;
  status: string;
}

interface LearningPathData {
  title: string;
  overallProgress: number;
  category: string;
}

interface MessageMetric {
  date: string;
  count: number;
}

interface UserMetricsResponse {
  taskMetrics: {
    total: number;
    completed: number;
    completionRate: number;
    perDay: TaskMetric[];
  };
  goalMetrics: {
    total: number;
    goals: GoalData[];
  };
  learningMetrics: {
    total: number;
    averageProgress: number;
    paths: LearningPathData[];
  };
  messageMetrics: {
    total: number;
    perDay: MessageMetric[];
  };
  streakData: number;
}

interface FocusScoreResponse {
  score: number;
  breakdown: {
    tasks: number;
    learning: number;
    engagement: number;
    streak: number;
  };
}

interface HeatmapData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface MoodIndexResponse {
  score: number;
  label: string;
  summary: string;
}

// Helper: Format date to YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Helper: Get date range
function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
}

// Helper: Call OpenRouter API (same pattern as chat route)
async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message ?? JSON.stringify(err));
  }

  const data = await response.json();
  const responseText = data.choices?.[0]?.message?.content ?? "";
  if (!responseText) throw new Error("Empty response from AI");
  return responseText;
}

/**
 * Get aggregated user metrics for a given number of days
 */
export async function getUserMetrics(
  userId: string,
  days: number = 7
): Promise<UserMetricsResponse> {
  const { start, end } = getDateRange(days);

  // Fetch all tasks
  const allTasks = await db.task.findMany({
    where: { userId },
  });

  const tasksByDate = new Map<string, number>();
  let completedCount = 0;

  allTasks.forEach((task: Task) => {
    if (task.status === "DONE" && task.updatedAt >= start && task.updatedAt <= end) {
      const date = formatDate(task.updatedAt);
      tasksByDate.set(date, (tasksByDate.get(date) || 0) + 1);
      completedCount++;
    }
  });

  const taskPerDay: TaskMetric[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    taskPerDay.push({
      date: dateStr,
      count: tasksByDate.get(dateStr) || 0,
    });
  }

  // Fetch all goals
  const goals = await db.goal.findMany({
    where: { userId },
  });

  const goalData: GoalData[] = goals.map((g: Goal) => ({
    id: g.id,
    title: g.title,
    progress: 0, // Goals don't have a progress field in schema, default to 0
    deadline: g.deadline ? formatDate(g.deadline) : null,
    status: g.status,
  }));

  // Fetch all learning paths
  const learningPaths = await db.learningPath.findMany({
    where: { userId },
  });

  const avgProgress =
    learningPaths.length > 0
      ? Math.round(
          learningPaths.reduce((sum: number, p: LearningPath) => sum + p.overallProgress, 0) /
            learningPaths.length
        )
      : 0;

  const learningPathData: LearningPathData[] = learningPaths.map((p: LearningPath) => ({
    title: p.title,
    overallProgress: p.overallProgress,
    category: p.category,
  }));

  // Fetch all chat messages in date range
  const messages = await db.chatMessage.findMany({
    where: {
      userId,
      createdAt: { gte: start, lte: end },
    },
  });

  const messagesByDate = new Map<string, number>();
  messages.forEach((msg: ChatMessage) => {
    if (msg.role === "user") {
      const date = formatDate(msg.createdAt);
      messagesByDate.set(date, (messagesByDate.get(date) || 0) + 1);
    }
  });

  const messagePerDay: MessageMetric[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    messagePerDay.push({
      date: dateStr,
      count: messagesByDate.get(dateStr) || 0,
    });
  }

  // Calculate streak
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    const count = tasksByDate.get(dateStr) || 0;
    if (count > 0) {
      streak++;
    } else {
      break;
    }
  }

  return {
    taskMetrics: {
      total: allTasks.length,
      completed: completedCount,
      completionRate: allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0,
      perDay: taskPerDay,
    },
    goalMetrics: {
      total: goals.length,
      goals: goalData,
    },
    learningMetrics: {
      total: learningPaths.length,
      averageProgress: avgProgress,
      paths: learningPathData,
    },
    messageMetrics: {
      total: messages.length,
      perDay: messagePerDay,
    },
    streakData: streak,
  };
}

/**
 * Calculate focus score (0-100) with breakdown
 */
export async function calculateFocusScore(
  userId: string
): Promise<FocusScoreResponse> {
  const metrics = await getUserMetrics(userId, 7);

  // Task completion rate this week: 40% weight
  const tasksScore = Math.min(100, metrics.taskMetrics.completionRate);
  const tasksContribution = (tasksScore / 100) * 40;

  // Learning path average progress: 30% weight
  const learningScore = metrics.learningMetrics.averageProgress;
  const learningContribution = (learningScore / 100) * 30;

  // Chat engagement: 15% weight (this week vs last week, capped)
  // Get last week's messages
  const lastWeekStart = new Date();
  const lastWeekEnd = new Date();
  lastWeekStart.setDate(lastWeekStart.getDate() - 14);
  lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);

  const lastWeekMessages = await db.chatMessage.findMany({
    where: {
      userId,
      role: "user",
      createdAt: { gte: lastWeekStart, lte: lastWeekEnd },
    },
  });

  const engagementRatio = Math.min(
    1,
    lastWeekMessages.length > 0
      ? metrics.messageMetrics.total / lastWeekMessages.length
      : 0
  );
  const engagementScore = engagementRatio * 100;
  const engagementContribution = (engagementScore / 100) * 15;

  // Streak bonus: 15% weight (streak days * 2, capped at 15)
  const streakBonus = Math.min(15, metrics.streakData * 2);
  const streakContribution = streakBonus;

  const totalScore = Math.round(
    tasksContribution + learningContribution + engagementContribution + streakContribution
  );

  return {
    score: Math.min(100, totalScore),
    breakdown: {
      tasks: Math.round(tasksContribution),
      learning: Math.round(learningContribution),
      engagement: Math.round(engagementContribution),
      streak: Math.round(streakContribution),
    },
  };
}

/**
 * Generate GitHub-style activity heatmap for last 52 weeks
 */
export async function getActivityHeatmap(userId: string): Promise<HeatmapData[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);

  const completedTasks = await db.task.findMany({
    where: {
      userId,
      status: "DONE",
      updatedAt: { gte: startDate, lte: endDate },
    },
  });

  // Build a map of dates to counts
  const dateCountMap = new Map<string, number>();
  completedTasks.forEach((task: Task) => {
    const date = formatDate(task.updatedAt);
    dateCountMap.set(date, (dateCountMap.get(date) || 0) + 1);
  });

  // Generate heatmap data for each day in the last 365 days
  const heatmapData: HeatmapData[] = [];
  for (let i = 364; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dateStr = formatDate(date);
    const count = dateCountMap.get(dateStr) || 0;

    let level: 0 | 1 | 2 | 3 | 4;
    if (count === 0) level = 0;
    else if (count === 1) level = 1;
    else if (count <= 3) level = 2;
    else if (count <= 5) level = 3;
    else level = 4;

    heatmapData.push({
      date: dateStr,
      count,
      level,
    });
  }

  return heatmapData;
}

/**
 * Analyze mood from chat messages
 */
export async function getMoodIndex(userId: string): Promise<MoodIndexResponse> {
  // Check if there's a recent coaching insight we can use
  const recentInsight = await db.coachingInsight.findUnique({
    where: { userId },
  });

  const now = new Date();
  const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

  if (recentInsight && recentInsight.generatedAt >= sixHoursAgo) {
    // Use cached insight to derive a score
    // observation + learningEdge suggests focused/positive state
    const score = 75 + Math.random() * 20; // 75-95 if recent insight exists
    return {
      score: Math.round(score),
      label: "focused",
      summary:
        "You've been actively engaging with learning. Keep up the momentum!",
    };
  }

  // Fetch last 20 messages
  const messages = await db.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  if (messages.length === 0) {
    return {
      score: 50,
      label: "neutral",
      summary: "Not much chat activity today. Take a moment to connect.",
    };
  }

  const messageContext = messages
    .reverse()
    .map((m: ChatMessage) => `${m.role}: ${m.content}`)
    .join("\n");

  const systemPrompt = `You are a mood analysis system. Analyze the following messages and return ONLY valid JSON with no other text.

Return JSON with this exact structure:
{
  "score": <number 0-100>,
  "label": "<string: stressed/low, neutral, or focused/positive>",
  "summary": "<string: brief one-liner about their mood>"
}

Scoring: 0-30 stressed/low, 31-60 neutral, 61-100 focused/positive`;

  const userPrompt = `Analyze this user's recent chat for mood/engagement:

${messageContext}

Return ONLY the JSON response.`;

  try {
    const responseText = await callOpenRouter(systemPrompt, userPrompt);

    let moodData;
    try {
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
      moodData = JSON.parse(jsonStr);
    } catch {
      moodData = { score: 60, label: "neutral", summary: "Steady progress" };
    }

    return {
      score: Math.max(0, Math.min(100, moodData.score)),
      label: moodData.label || "neutral",
      summary: moodData.summary || "Continue your current pace",
    };
  } catch (err) {
    console.error("Error analyzing mood:", err);
    return {
      score: 60,
      label: "neutral",
      summary: "Steady progress",
    };
  }
}
