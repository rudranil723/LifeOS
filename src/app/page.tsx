import { Sidebar } from "@/components/layout/sidebar"
import { ChatWindow } from "@/components/layout/chat-window"
import { DashboardPanel } from "@/components/layout/dashboard-panel"
import { auth } from "@clerk/nextjs/server"
import { SignIn } from "@clerk/nextjs"

export default async function Home() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return (
        <main className="flex h-screen w-full bg-black flex-col items-center justify-center">
          <SignIn routing="hash" />
        </main>
      )
    }

    return (
      <main className="flex h-screen w-full bg-black text-white overflow-hidden font-sans">
        <Sidebar />
        <ChatWindow />
        <DashboardPanel />
      </main>
    )
  } catch {
    return (
      <main className="flex h-screen w-full bg-black flex-col items-center justify-center">
        <SignIn routing="hash" />
      </main>
    )
  }
}