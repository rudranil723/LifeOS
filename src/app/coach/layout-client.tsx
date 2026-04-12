"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardPanel } from "@/components/layout/dashboard-panel";
import { useSidebar } from "@/lib/sidebar-context";
import { BarChart2, Menu } from "lucide-react";

export default function CoachLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setMobileOpen } = useSidebar();
  const [panelOpen, setPanelOpen] = useState(false);

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
            <div className="font-headline font-bold text-on-surface">Learning Coach</div>
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="p-2 hover:bg-surface-container rounded-lg transition-colors"
              aria-label="Toggle insights"
            >
              <BarChart2 className="w-5 h-5 text-primary-container" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden lg:gap-0">
            <div className="flex-1 overflow-y-auto w-full lg:w-auto">{children}</div>

            {/* Mobile Floating Panel */}
            {panelOpen && (
              <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 max-h-96 overflow-y-auto bg-surface-container-lowest border-t border-outline-variant/30">
                <div className="p-4 flex items-center justify-between border-b border-outline-variant/30">
                  <h3 className="font-headline font-bold text-on-surface">Insights</h3>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="p-1 hover:bg-surface-container rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <DashboardPanel />
              </div>
            )}
          </div>
        </div>

        {/* Desktop Right Panel - Always Visible */}
        <div className="hidden lg:flex">
          <DashboardPanel />
        </div>
      </main>
    </>
  );
}
