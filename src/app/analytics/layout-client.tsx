"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { useSidebar } from "@/lib/sidebar-context";
import { Menu } from "lucide-react";

export default function AnalyticsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setMobileOpen } = useSidebar();

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 md:hidden p-2 hover:bg-surface-container rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-on-surface" />
      </button>

      <main className="flex h-screen w-full bg-surface-container-lowest text-on-surface overflow-hidden font-sans">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Mobile Top Bar */}
          <div className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-outline-variant/30 bg-surface-container-low backdrop-blur-sm">
            <div className="font-headline font-bold text-on-surface">Analytics</div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
