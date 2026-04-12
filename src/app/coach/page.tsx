import { auth } from "@clerk/nextjs/server";
import {
  getLearningDashboardData,
  createSeedLearningPath,
} from "@/lib/actions/coach";
import CoachDashboard from "@/components/coach/coach-dashboard";

export default async function CoachPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  // Create seed learning path if needed
  await createSeedLearningPath(userId);

  // Fetch dashboard data
  const dashboardData = await getLearningDashboardData(userId);

  return (
    <div className="flex-1 flex flex-col h-full bg-black/90 overflow-hidden p-4 md:p-8">
      <CoachDashboard initialData={dashboardData} userId={userId} />
    </div>
  );
}
