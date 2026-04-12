"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { DashboardPanel } from "@/components/layout/dashboard-panel";
import { ChatWindow } from "@/components/layout/chat-window";
import { useSidebar } from "@/lib/sidebar-context";
import { Menu } from "lucide-react";

export default function DashboardLayoutClient({
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

      <main className="flex h-screen w-full bg-surface-container-lowest text-on-surface overflow-hidden font-body">
        {/* Sidebar - Handles its own mobile state */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden min-w-0">
          {/* Primary Content */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {children}
          </div>

          {/* Desktop Right Panel */}
          <DashboardPanel />
        </div>

        {/* Chat Window - Always on Desktop */}
        <ChatWindow />
      </main>
    </>
  );
}
