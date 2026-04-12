"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { ChatWindow } from "@/components/layout/chat-window"
import { DashboardPanel } from "@/components/layout/dashboard-panel"
import { SidebarProvider } from "@/lib/sidebar-context"

export function HomeContent() {
  return (
    <SidebarProvider>
      <main className="flex h-screen w-full bg-black text-white overflow-hidden font-sans">
        <Sidebar />
        <ChatWindow />
        <DashboardPanel />
      </main>
    </SidebarProvider>
  )
}
