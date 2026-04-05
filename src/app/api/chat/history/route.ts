import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json([]);
    }

    const history = await db.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return Response.json(history.reverse());
  } catch (error) {
    console.error("History error:", error);
    return Response.json([]);
  }
}