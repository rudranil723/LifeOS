"use server"

import db from "../db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createGoal(title: string, description?: string, deadline?: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const goal = await db.goal.create({
    data: {
      userId,
      title,
      description,
      deadline,
    }
  });

  revalidatePath("/");
  return goal;
}

export async function getGoals() {
  const { userId } = await auth();
  if (!userId) return [];

  return db.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateGoal(id: string, data: { title?: string; description?: string; status?: string; deadline?: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const goal = await db.goal.update({
    where: { id, userId },
    data,
  });

  revalidatePath("/");
  return goal;
}

export async function deleteGoal(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await db.goal.delete({
    where: { id, userId },
  });

  revalidatePath("/");
}
