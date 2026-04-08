import { auth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";
import { Sidebar } from "@/components/layout/sidebar";
import { ChatWindow } from "@/components/layout/chat-window";
import { DashboardPanel } from "@/components/layout/dashboard-panel";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return (
        <main className="flex h-screen w-full bg-black flex-col items-center justify-center">
          <SignIn routing="hash" />
        </main>
      );
    }

    return (
      <main className="flex h-screen w-full bg-black text-white overflow-hidden font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full">
          {children}
        </div>
        <DashboardPanel />
      </main>
    );
  } catch {
    return (
      <main className="flex h-screen w-full bg-black flex-col items-center justify-center">
        <SignIn routing="hash" />
      </main>
    );
  }
}
