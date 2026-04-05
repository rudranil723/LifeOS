import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  // Fetch contextual user data concurrently
  const [goals, tasks, memories] = await Promise.all([
    db.goal.findMany({ where: { userId, status: "IN_PROGRESS" } }),
    db.task.findMany({ where: { userId, status: { not: "DONE" } } }),
    db.memory.findMany({ where: { userId } }),
  ]);

  // Build the system prompt using the user's specific persona request
  const systemPrompt = `You are LifeOS, a focused, intelligent personal operating system. 
You are direct and actionable — not overly friendly or chatty. 
You help the user plan their day, learn new skills, track goals, and stay accountable. 
Tone: calm, smart, minimal.

--- CURRENT CONTEXT ---
Active Goals: ${goals.length ? JSON.stringify(goals.map(g => ({title: g.title, deadline: g.deadline}))) : "None"}
Pending Tasks: ${tasks.length ? JSON.stringify(tasks.map(t => ({title: t.title, dueDate: t.dueDate}))) : "None"}
User Memories & Preferences: ${memories.length ? JSON.stringify(memories.map(m => m.content)) : "None"}
-----------------------

Use the context above to inform your answers, but do not explicitly recite the context unless asked. Provide concise and valuable insights.`;

  // Extract the latest user message to store in DB
  const latestMessage = messages[messages.length - 1];
  if (latestMessage && latestMessage.role === "user") {
    await db.chatMessage.create({
      data: {
        userId,
        role: "user",
        content: latestMessage.content,
      },
    });
  }

  // Create stream via Gemini
  const result = streamText({
    model: google('gemini-1.5-flash'),
    system: systemPrompt,
    messages,
    async onFinish({ text }) {
      // Persist the AI's response so it can be loaded in future sessions
      await db.chatMessage.create({
        data: {
          userId,
          role: "assistant",
          content: text,
        },
      });
    },
  });

  return result.toDataStreamResponse();
}
