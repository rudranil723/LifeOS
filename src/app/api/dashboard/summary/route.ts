import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { calculateFocusScore, getUserMetrics } from "@/lib/actions/analytics";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch active goals (max 5)
    const goals = await db.goal.findMany({
      where: {
        userId,
        status: { in: ["TODO", "IN_PROGRESS"] },
      },
      select: { id: true, title: true, status: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    // Fetch today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysTasks = await db.task.findMany({
      where: {
        userId,
        OR: [
          { dueDate: { gte: today, lt: tomorrow } },
          { createdAt: { gte: today } },
        ],
      },
      select: { id: true, title: true, status: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    // Get task completion for today
    const todaysCompleted = todaysTasks.filter(
      (t: { id: string; title: string; status: string }) => t.status === "DONE"
    ).length;
    const todaysTotal = todaysTasks.length;
    const todaysCompletionPercentage =
      todaysTotal > 0 ? Math.round((todaysCompleted / todaysTotal) * 100) : 0;

    // Get focus score
    const focusScore = await calculateFocusScore(userId);

    // Get metrics (streak + activity data)
    const metrics = await getUserMetrics(userId, 7);
    const streakDays = metrics.streakData || 0;

    // Calculate study hours from MasteryLog entries this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const masteryLogs = await db.masteryLog.findMany({
      where: {
        userId,
        lastPracticed: { gte: weekAgo },
      },
      select: { learningPathId: true },
    });

    // Count unique learning paths practiced this week (each = 1 hour)
    const uniquePathsThisWeek = new Set(
      masteryLogs.map((log: { learningPathId: string }) => log.learningPathId)
    ).size;
    const studyHours = uniquePathsThisWeek;

    // Get activity data for last 7 days
    const activityData = metrics.taskMetrics?.perDay || [];
    const last7Days = activityData.slice(0, 7).reverse();

    return new Response(
      JSON.stringify({
        activeGoals: goals,
        todaysTasks: todaysTasks,
        focusScore: focusScore.score,
        streakDays,
        studyHours,
        taskCompletion: {
          completed: todaysCompleted,
          total: todaysTotal,
          percentage: todaysCompletionPercentage,
        },
        activityData: last7Days,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Dashboard Summary Error:", error?.message ?? error);
    return new Response(
      JSON.stringify({
        error: error?.message ?? "Failed to fetch dashboard summary",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
