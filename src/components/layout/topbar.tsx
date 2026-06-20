"use client";
import { useEffect, useState } from "react";
import { Bell, LogOut, Bot, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChat } from "@/contexts/chat-context";


function StabilityGauge({ score = 96 }: { score?: number }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center">
        <svg width="36" height="36" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
          <circle
            cx="18" cy="18" r={r}
            fill="none" stroke="#10b981"
            strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.4))' }}
          />
        </svg>
        <span className="absolute text-[9px] font-bold text-emerald-400 tabular-nums">{score}</span>
      </div>
      <div className="leading-tight">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.08em]">National Stability</p>
        <p className="text-[9px] text-zinc-600">{score}/100</p>
      </div>
    </div>
  );
}

export function Topbar() {
  const router = useRouter();
  const { toggle } = useChat();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [unread, setUnread] = useState(0);
  const [time, setTime] = useState("");
  const [stability, setStability] = useState(96);

  useEffect(() => {
    fetch("/api/v1/notifications").then((r) => r.json()).then((d) => {
      setUnread(d.data.filter((n: any) => !n.isRead).length);
    }).catch(() => {});
    fetch("/api/v1/dashboard").then((r) => r.json()).then((d) => {
      if (d?.data?.national_stability_score) setStability(d.data.national_stability_score);
    }).catch(() => {});
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <><header className="flex h-14 items-center justify-between border-b border-zinc-800/40 bg-zinc-950/60 backdrop-blur-2xl px-3 sm:px-6 relative z-10">
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="flex lg:hidden h-11 w-11 items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all"
        >
          {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.1em]">Live</span>
        </div>
        <span className="w-px h-5 bg-zinc-800/40 hidden sm:block" />
        <div className="hidden sm:block">
          <StabilityGauge score={stability} />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <span className="text-xs text-zinc-600 font-mono tracking-tight hidden sm:block">{time || "—"}</span>

        {/* AI Advisor toggle — desktop */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:flex h-11 w-11 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl relative"
          onClick={toggle}
        >
          <Bot className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2 rounded-full bg-emerald-400 animate-live-pulse" />
        </Button>

        <Link href="/notifications" className="relative">
          <Button variant="ghost" size="icon" className="h-11 w-11 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 rounded-xl">
            <Bell className="h-4 w-4" />
          </Button>
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[7px] font-bold text-black">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>

        <div className="flex h-9 w-9 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-[10px] font-bold text-black shadow-lg shadow-emerald-500/10 ring-1 ring-white/10 ml-1">
          A
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 rounded-xl"
          onClick={async () => {
            try { await fetch("/api/v1/auth/logout", { method: "POST" }); } catch {}
            finally { document.cookie = "token=; path=/; max-age=0"; router.push("/login"); }
          }}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>

      {/* Mobile slide-in menu */}
      {mobileMenu && (
        <div className="fixed inset-0 top-14 z-20 lg:hidden" onClick={() => setMobileMenu(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-700/40 p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            <StabilityGauge score={stability} />
            <div className="border-t border-zinc-800/40 my-3" />
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">{time || "—"}</div>
            <button
              onClick={() => { toggle(); setMobileMenu(false); }}
              className="flex items-center gap-3 w-full h-11 rounded-xl px-3 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
            >
              <Bot className="h-4 w-4" />
              <span className="text-xs font-medium">AI Cabinet Advisor</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
