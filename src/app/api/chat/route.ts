import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";

export const maxDuration = 30;

// Helper to detect if user is asking for a plan
function isPlanningRequest(message: string): boolean {
  const planKeywords = [
    "plan my day",
    "generate my schedule",
    "create a schedule",
    "what should i do",
    "schedule my day",
    "plan my schedule",
    "what's my schedule",
    "organize my day",
    "build a schedule",
    "make a schedule",
  ];
  const lowerMessage = message.toLowerCase();
  return planKeywords.some((keyword) => lowerMessage.includes(keyword));
}

// Helper to generate daily plan
async function generateDailyPlan(userId: string) {
  try {
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

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const goalsContext = goals
      .map(
        (g: { title: string; deadline: Date | null }) =>
          `- ${g.title} (deadline: ${g.deadline ? g.deadline.toLocaleDateString() : "no deadline"})`
      )
      .join("\n");

    const tasksContext = tasks
      .map(
        (t: { title: string; dueDate: Date | null }) =>
          `- ${t.title} (due: ${t.dueDate ? t.dueDate.toLocaleDateString() : "no due date"})`
      )
      .join("\n");

    const memoriesContext = memories.map((m: { content: string }) => m.content).join("\n");

    const systemPrompt = `You are LifeOS scheduling engine. Generate a JSON schedule ONLY.
Respond with ONLY valid JSON, no other text.

{
  "blocks": [
    {"time": "HH:MM", "title": "task", "duration": 60, "type": "focus"}
  ],
  "summary": "Brief summary"
}`;

    const userPrompt = `Today is ${dateStr}. Generate a schedule.
Goals: ${goalsContext || "None"}
Tasks: ${tasksContext || "None"}
Prefs: ${memoriesContext || "None"}
Return ONLY JSON.`;

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

    if (!response.ok) return null;

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content ?? "";

    if (!responseText) return null;

    let schedule;
    try {
      const jsonMatch = responseText.match(
        /```(?:json)?\s*([\s\S]*?)\s*```/
      );
      const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
      schedule = JSON.parse(jsonStr);
    } catch {
      return null;
    }

    if (!schedule.blocks || !Array.isArray(schedule.blocks)) return null;

    const todayDate = new Date(today);
    todayDate.setHours(0, 0, 0, 0);

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

    return dailyPlan;
  } catch (error) {
    console.error("Error generating plan:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const clerkUser = await currentUser();
    if (clerkUser) {
      await db.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email:
            clerkUser.emailAddresses[0]?.emailAddress ??
            `${userId}@unknown.com`,
        },
      });
    }

    const { messages } = await req.json();

    const [goals, tasks, memories] = await Promise.all([
      db.goal.findMany({ where: { userId, status: "IN_PROGRESS" } }),
      db.task.findMany({ where: { userId, status: { not: "DONE" } } }),
      db.memory.findMany({ where: { userId } }),
    ]);

    const systemPrompt = `You are LifeOS, a focused, intelligent personal operating system.
You are direct and actionable — not overly friendly or chatty.
You help the user plan their day, learn new skills, track goals, and stay accountable.
Tone: calm, smart, minimal.

--- CURRENT CONTEXT ---
Active Goals: ${goals.length ? JSON.stringify(goals.map((g: { title: string; deadline: Date | null }) => ({ title: g.title, deadline: g.deadline }))) : "None"}
Pending Tasks: ${tasks.length ? JSON.stringify(tasks.map((t: { title: string; dueDate: Date | null }) => ({ title: t.title, dueDate: t.dueDate }))) : "None"}
User Memories & Preferences: ${memories.length ? JSON.stringify(memories.map((m: { content: string }) => m.content)) : "None"}
-----------------------
Be concise and actionable.`;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      await db.chatMessage.create({
        data: { userId, role: "user", content: lastMessage.content },
      });
    }

    // Check if this is a planning request
    const isPlanRequest = isPlanningRequest(lastMessage?.content || "");
    let responseText = "";

    if (isPlanRequest) {
      // Generate the daily plan
      const dailyPlan = await generateDailyPlan(userId);

      if (dailyPlan && dailyPlan.schedule) {
        const blocks = (dailyPlan.schedule as any).blocks || [];
        const summary = (dailyPlan.schedule as any).summary || "";

        responseText = `Your day is planned. ${summary || ""}

Generated ${blocks.length} time blocks optimized for your goals and tasks.

View your full schedule: /dashboard/planner`;
      } else {
        responseText =
          "I couldn't generate your schedule right now. Try again in a moment.";
      }
    } else {
      // Regular chat response via OpenRouter
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
              ...messages.map((m: { role: string; content: string }) => ({
                role: m.role,
                content: m.content,
              })),
            ],
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message ?? JSON.stringify(err));
      }

      const data = await response.json();
      responseText = data.choices?.[0]?.message?.content ?? "";

      if (!responseText) throw new Error("Empty response from AI.");
    }

    await db.chatMessage.create({
      data: { userId, role: "assistant", content: responseText },
    });

    return new Response(responseText, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error?.message ?? error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
