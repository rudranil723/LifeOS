"use server"

import db from "../db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createTask(title: string, goalId?: string, description?: string, dueDate?: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const task = await db.task.create({
    data: {
      userId,
      title,
      goalId,
      description,
      dueDate,
    }
  });

  revalidatePath("/");
  return task;
}

export async function getTasks() {
  const { userId } = await auth();
  if (!userId) return [];

  return db.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateTask(id: string, data: { title?: string; description?: string; status?: string; dueDate?: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const task = await db.task.update({
    where: { id, userId },
    data,
  });

  revalidatePath("/");
  return task;
}

export async function deleteTask(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.task.delete({
    where: { id, userId },
  });

  revalidatePath("/");
}
