import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function POST(req: any) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { title, description } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Title is required and must be a non-empty string" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newGoal = await db.goal.create({
      data: {
        userId,
        title: title.trim(),
        description: description?.trim() || null,
        status: "TODO",
      },
    });

    return new Response(JSON.stringify(newGoal), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Create Goal Error:", error?.message ?? error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Failed to create goal" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
