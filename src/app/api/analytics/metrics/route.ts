import { auth } from "@clerk/nextjs/server";
import {
  getUserMetrics,
  calculateFocusScore,
} from "@/lib/actions/analytics";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get days from query param
    const url = new URL(req.url);
    const daysParam = url.searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 7;

    if (isNaN(days) || days < 1 || days > 365) {
      return new Response(
        JSON.stringify({ error: "Invalid days parameter (1-365)" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [metrics, focusScore] = await Promise.all([
      getUserMetrics(userId, days),
      calculateFocusScore(userId),
    ]);

    return new Response(
      JSON.stringify({
        metrics,
        focusScore,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Analytics API Error:", error?.message ?? error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Failed to fetch metrics" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
