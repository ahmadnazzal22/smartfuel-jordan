"use client";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ChatPanel } from "@/components/chat/chat-panel";
import { AICopilot } from "@/components/dashboard/ai-copilot";
import { ChatProvider } from "@/contexts/chat-context";
import { RealtimeProvider } from "@/contexts/realtime-context";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <RealtimeProvider>
      <div className="flex h-screen overflow-hidden bg-zinc-950">
        {/* Ambient background glow */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-emerald-500/3 rounded-full blur-[200px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/2 rounded-full blur-[150px]" />
        </div>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden relative lg:pb-0 pb-[calc(64px+env(safe-area-inset-bottom))]">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6"><ErrorBoundary>{children}</ErrorBoundary></main>
      </div>
        <BottomNav />
      <ChatPanel />
      <AICopilot />
    </div>
    </RealtimeProvider>
    </ChatProvider>
  );
}
