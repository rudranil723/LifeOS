import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";

export const maxDuration = 30;

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
          email: clerkUser.emailAddresses[0]?.emailAddress ?? `${userId}@unknown.com`,
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
Active Goals: ${goals.length ? JSON.stringify(goals.map((g: any) => ({ title: g.title, deadline: g.deadline }))) : "None"}
Pending Tasks: ${tasks.length ? JSON.stringify(tasks.map((t: any) => ({ title: t.title, dueDate: t.dueDate }))) : "None"}
User Memories & Preferences: ${memories.length ? JSON.stringify(memories.map((m: any) => m.content)) : "None"}
-----------------------
Be concise and actionable.`;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      await db.chatMessage.create({
        data: { userId, role: "user", content: lastMessage.content },
      });
    }

    // Call OpenRouter directly - no SDK version issues
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message ?? JSON.stringify(err));
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    if (!text) throw new Error("Empty response from AI.");

    await db.chatMessage.create({
      data: { userId, role: "assistant", content: text },
    });

    return new Response(text, {
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
