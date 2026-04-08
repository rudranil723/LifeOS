import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get today's date normalized to start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyPlan = await db.dailyPlan.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (!dailyPlan) {
      return new Response(JSON.stringify({ plan: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ plan: dailyPlan }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Get Daily Plan Error:", error?.message ?? error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Failed to fetch plan" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
