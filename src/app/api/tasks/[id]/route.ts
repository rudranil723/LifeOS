import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, title, description, dueDate } = body;

    // Verify the task belongs to the user
    const existingTask = await db.task.findUnique({
      where: { id },
    });

    if (!existingTask || existingTask.userId !== userId) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update only provided fields
    const updateData: Prisma.TaskUpdateInput = {};
    if (status !== undefined) updateData.status = status;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const updatedTask = await db.task.update({
      where: { id },
      data: updateData,
    });

    return new Response(JSON.stringify(updatedTask), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Update Task Error:", error?.message ?? error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Failed to update task" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
