import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserMetrics, calculateFocusScore, getActivityHeatmap, getMoodIndex } from '@/lib/actions/analytics';
import AnalyticsDashboard from '@/components/analytics/analytics-dashboard';

export const metadata = {
  title: 'Analytics - LifeOS',
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const { days: daysParam } = await searchParams;
  const days = daysParam ? parseInt(daysParam, 10) : 7;
  const validDays = Math.max(1, Math.min(365, days));

  const [metrics, focusScore, heatmap, mood] = await Promise.all([
    getUserMetrics(user.id, validDays),
    calculateFocusScore(user.id),
    getActivityHeatmap(user.id),
    getMoodIndex(user.id),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your productivity, learning, and progress</p>
        </div>
        
        <AnalyticsDashboard
          metrics={metrics}
          focusScore={focusScore}
          heatmap={heatmap}
          mood={mood}
          days={validDays}
        />
      </div>
    </main>
  );
}
