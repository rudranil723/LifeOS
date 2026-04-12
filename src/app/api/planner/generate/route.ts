import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";

export const maxDuration = 30;

interface ScheduleBlock {
  time: string;
  title: string;
  taskId?: string;
  goalId?: string;
  duration: number;
  type: "focus" | "break" | "review";
}

interface DailySchedule {
  blocks: ScheduleBlock[];
  summary?: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch user's active goals and pending tasks
    const [goals, tasks, memories] = await Promise.all([
      db.goal.findMany({
        where: { userId, status: "IN_PROGRESS" },
        orderBy: { deadline: "asc" },
      }),
      db.task.findMany({
        where: { userId, status: { not: "DONE" } },
        orderBy: { dueDate: "asc" },
      }),
      db.memory.findMany({ where: { userId } }),
    ]);

    // Build a comprehensive prompt for schedule generation
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const goalsContext = goals
      .map(
        (g) =>
          `- ${g.title} (deadline: ${g.deadline ? g.deadline.toLocaleDateString() : "no deadline"}, priority: high)`
      )
      .join("\n");

    const tasksContext = tasks
      .map(
        (t) =>
          `- ${t.title} (due: ${t.dueDate ? t.dueDate.toLocaleDateString() : "no due date"}, status: ${t.status})`
      )
      .join("\n");

    const memoriesContext = memories.map((m: any) => m.content).join("\n");

    const systemPrompt = `You are LifeOS, an AI life operating system. Your task is to generate a structured daily schedule for the user based on their goals, tasks, and preferences.

IMPORTANT: You MUST respond with ONLY valid JSON, no other text.

Generate a schedule that:
1. Starts at 07:00 and ends at 22:00
2. Includes focus blocks (60-90 min), breaks (15-30 min), and review blocks (15 min)
3. Alternates between focused work and recovery
4. Prioritizes tasks linked to urgent goals
5. Includes at least one review period to consolidate learning

The response MUST be valid JSON matching this structure exactly:
{
  "blocks": [
    {
      "time": "HH:MM",
      "title": "block title",
      "taskId": "optional-task-id-or-null",
      "goalId": "optional-goal-id-or-null",
      "duration": 60,
      "type": "focus"
    }
  ],
  "summary": "Brief summary of the day's focus"
}

Respond with ONLY the JSON, no markdown, no explanations.`;

    const userPrompt = `Today is ${dateStr}. Generate my daily schedule.

Active Goals:
${goalsContext || "None"}

Pending Tasks:
${tasksContext || "None"}

Preferences:
${memoriesContext || "None"}

Create an optimal daily schedule that addresses these goals and tasks. Return ONLY valid JSON.`;

    // Call OpenRouter API with the same pattern as chat route
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

    if (!responseText) {
      throw new Error("Empty response from AI");
    }

    // Parse the JSON response - extract JSON from response if it contains markdown or extra text
    let schedule: DailySchedule;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
      schedule = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse schedule JSON:", responseText);
      throw new Error(`Invalid schedule format from AI: ${parseError}`);
    }

    // Validate schedule structure
    if (!schedule.blocks || !Array.isArray(schedule.blocks)) {
      throw new Error("Invalid schedule structure: missing blocks array");
    }

    // Save to database
    const todayDate = new Date(today);
    todayDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Try to find existing plan
    const existingPlan = await db.dailyPlan.findFirst({
      where: { userId, date: todayDate },
    });

    let dailyPlan;
    if (existingPlan) {
      dailyPlan = await db.dailyPlan.update({
        where: { id: existingPlan.id },
        data: {
          schedule: schedule as any,
          updatedAt: new Date(),
        },
      });
    } else {
      dailyPlan = await db.dailyPlan.create({
        data: {
          userId,
          date: todayDate,
          schedule: schedule as any,
        },
      });
    }

    return new Response(JSON.stringify(dailyPlan), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Planner Generation Error:", error?.message ?? error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Failed to generate plan" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
