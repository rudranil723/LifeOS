"use server"

import db from "../db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Types
interface VelocityDataPoint {
  week: string;
  [key: string]: string | number;
}

interface CoachingInsightData {
  observation: string;
  learningEdge: string;
  drill: string;
}

interface DashboardData {
  paths: any[];
  latestInsight: any | null;
  velocityData: VelocityDataPoint[];
}

// Helper: Call OpenRouter API (copied from chat route)
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

// Helper: Generate velocity data
function generateVelocityData(
  paths: any[],
  pastLogs: Map<string, number[]>
): VelocityDataPoint[] {
  const weeks = Array.from({ length: 6 }, (_, i) => `Week ${i + 1}`);
  const result: VelocityDataPoint[] = weeks.map((week: string) => ({
    week,
  }));

  paths.forEach((path: any) => {
    const pathLogs = pastLogs.get(path.id);
    if (pathLogs) {
      pathLogs.forEach((score: number, idx: number) => {
        result[idx][path.title] = score;
      });
    } else {
      // Generate plausible seed values based on overallProgress
      const progress = path.overallProgress || 0;
      const baseScore = Math.max(0, progress - 20);
      for (let i = 0; i < 6; i++) {
        const variance = Math.random() * 10 - 5;
        result[i][path.title] = Math.max(
          0,
          Math.min(100, baseScore + variance + i * 5)
        );
      }
    }
  });

  return result;
}

/**
 * Get learning dashboard data including paths, insights, and velocity
 */
export async function getLearningDashboardData(
  userId: string
): Promise<DashboardData> {
  // Fetch all learning paths with mastery logs
  const paths = await db.learningPath.findMany({
    where: { userId },
    include: {
      masteryLogs: {
        orderBy: { masteryScore: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch latest coaching insight
  const latestInsight = await db.coachingInsight.findUnique({
    where: { userId },
  });

  // Build velocity data (using mastery logs)
  const pastLogs = new Map<string, number[]>();
  paths.forEach((path: any) => {
    const scores = path.masteryLogs.slice(0, 6).map((log: any) => log.masteryScore);
    pastLogs.set(path.id, scores);
  });

  const velocityData = generateVelocityData(paths, pastLogs);

  return {
    paths,
    latestInsight,
    velocityData,
  };
}

/**
 * Analyze learning state and generate coaching insights
 */
export async function analyzeLearningState(userId: string): Promise<any> {
  // Fetch last 20 chat messages
  const chatMessages = await db.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Fetch last 10 completed tasks
  const completedTasks = await db.task.findMany({
    where: { userId, status: "DONE" },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Fetch all learning paths with mastery logs
  const learningPaths = await db.learningPath.findMany({
    where: { userId },
    include: {
      masteryLogs: true,
    },
  });

  // Build context from data
  const chatContext = chatMessages
    .map((m: any) => `${m.role}: ${m.content}`)
    .join("\n");

  const tasksContext = completedTasks
    .map((t: any) => `- ${t.title}`)
    .join("\n");

  const pathsContext = learningPaths
    .map(
      (p: any) =>
        `${p.title} (${p.category}): ${p.masteryLogs.map((m: any) => m.concept).join(", ")}`
    )
    .join("\n");

  const systemPrompt = `You are a learning coach analyzing a student's progress. 
Respond with ONLY valid JSON, no other text.

Return JSON with this exact structure:
{
  "observation": "A specific observation about their learning pattern",
  "learningEdge": "The key skill they should focus on next",
  "drill": "A specific, actionable drill or exercise to practice"
}`;

  const userPrompt = `Analyze this student's learning progress:

Recent Chat:
${chatContext || "(No recent chat)"}

Completed Tasks:
${tasksContext || "(No completed tasks)"}

Learning Paths:
${pathsContext || "(No learning paths)"}

Generate coaching insights as JSON.`;

  const responseText = await callOpenRouter(systemPrompt, userPrompt);

  // Parse the JSON response
  let insight: CoachingInsightData;
  try {
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
    insight = JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse insight JSON:", responseText);
    throw new Error("Invalid response format from AI");
  }

  // Save or update coaching insight
  const coachingInsight = await db.coachingInsight.upsert({
    where: { userId },
    update: {
      observation: insight.observation,
      learningEdge: insight.learningEdge,
      drill: insight.drill,
      generatedAt: new Date(),
    },
    create: {
      userId,
      observation: insight.observation,
      learningEdge: insight.learningEdge,
      drill: insight.drill,
    },
  });

  revalidatePath("/coach");
  return coachingInsight;
}

/**
 * Start a learning session for a path
 */
export async function startLearningSession(
  userId: string,
  learningPathId: string
): Promise<any> {
  // Update learning path timestamp
  const updatedPath = await db.learningPath.update({
    where: { id: learningPathId, userId },
    data: {
      updatedAt: new Date(),
    },
    include: {
      masteryLogs: true,
    },
  });

  // Update all mastery logs for this path
  const masteryLogs = await db.masteryLog.findMany({
    where: { learningPathId },
  });

  await Promise.all(
    masteryLogs.map((log: any) =>
      db.masteryLog.update({
        where: { id: log.id },
        data: {
          masteryScore: Math.min(100, log.masteryScore + 5),
          lastPracticed: new Date(),
          updatedAt: new Date(),
        },
      })
    )
  );

  // Recalculate overallProgress
  const updatedLogs = await db.masteryLog.findMany({
    where: { learningPathId },
  });

  const avgScore =
    updatedLogs.length > 0
      ? Math.round(
          updatedLogs.reduce((sum: number, log: any) => sum + log.masteryScore, 0) /
            updatedLogs.length
        )
      : 0;

  const pathWithProgress = await db.learningPath.update({
    where: { id: learningPathId },
    data: {
      overallProgress: avgScore,
    },
    include: {
      masteryLogs: true,
    },
  });

  revalidatePath("/coach");
  return pathWithProgress;
}

/**
 * Create a new learning path with AI-generated concepts
 */
export async function createLearningPath(
  userId: string,
  title: string,
  category: string,
  description?: string
): Promise<any> {
  const systemPrompt = `You are an educational curriculum designer. 
Generate 4-6 core concepts or drills for a learning path.
Respond with ONLY a valid JSON array of strings, no other text.

Example: ["Concept 1", "Concept 2", "Concept 3"]`;

  const userPrompt = `Create core concepts for this learning path:
Title: ${title}
Category: ${category}
Description: ${description || "N/A"}

Return ONLY a JSON array of concept names.`;

  const responseText = await callOpenRouter(systemPrompt, userPrompt);

  // Parse the JSON array
  let concepts: string[];
  try {
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
    concepts = JSON.parse(jsonStr);
  } catch (err) {
    console.error("Failed to parse concepts JSON:", responseText);
    throw new Error("Invalid response format from AI");
  }

  // Ensure concepts is an array
  if (!Array.isArray(concepts)) {
    concepts = [concepts];
  }

  // Create learning path
  const learningPath = await db.learningPath.create({
    data: {
      userId,
      title,
      category,
      description,
    },
  });

  // Create mastery logs for each concept
  await Promise.all(
    concepts.map((concept: string) =>
      db.masteryLog.create({
        data: {
          userId,
          learningPathId: learningPath.id,
          concept,
          masteryScore: 0,
        },
      })
    )
  );

  // Return path with mastery logs
  const pathWithLogs = await db.learningPath.findUnique({
    where: { id: learningPath.id },
    include: {
      masteryLogs: true,
    },
  });

  revalidatePath("/coach");
  return pathWithLogs;
}

/**
 * Create seed learning path if user has none
 */
export async function createSeedLearningPath(userId: string): Promise<void> {
  const existingPaths = await db.learningPath.findMany({
    where: { userId },
  });

  if (existingPaths.length === 0) {
    await createLearningPath(
      userId,
      "Getting Started with LifeOS",
      "Cognitive Science",
      "Learn the fundamentals of personal productivity, goal-setting, and learning optimization with LifeOS."
    );
  }
}
