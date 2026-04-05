import { Sidebar } from "@/components/layout/sidebar"
import { ChatWindow } from "@/components/layout/chat-window"
import { DashboardPanel } from "@/components/layout/dashboard-panel"

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-black text-white overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar />
      <ChatWindow />
      <DashboardPanel />
    </main>
  )
}
