import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Analytics - LifeOS',
  description: 'View your productivity analytics and insights',
};

export default async function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/sign-in');

  return <>{children}</>;
}
