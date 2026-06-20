"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, MapPin, BarChart3, Truck, AlertTriangle, Bot, Globe, Zap } from "lucide-react";
import { useChat } from "@/contexts/chat-context";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/command-center", label: "Command", icon: AlertTriangle },
  { href: "/early-warning", label: "Warning", icon: Zap },
  { href: "/digital-twin", label: "Twin", icon: Globe },
  { href: "/trucks", label: "Trucks", icon: Truck },
];

export function BottomNav() {
  const path = usePathname();
  const { toggle } = useChat();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
      {/* Glass background */}
      <div className="absolute inset-0 bg-zinc-950/90 border-t border-zinc-700/40" />
      <div className="absolute inset-0 backdrop-blur-2xl" />

      <div className="relative flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]" style={{ height: "64px" }}>
        {navItems.map((item) => {
          const active = path.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] rounded-xl transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center gap-0.5">
                <Icon className={`h-5 w-5 ${active ? "text-emerald-400" : "text-zinc-500"}`} />
                <span className={`text-[8px] font-semibold uppercase tracking-wider ${active ? "text-emerald-400" : "text-zinc-500"}`}>
                  {item.label}
                </span>
              </span>
            </Link>
          );
        })}

        {/* Chat toggle */}
        <button
          onClick={toggle}
          className="relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] rounded-xl transition-colors"
        >
          <span className="relative z-10 flex flex-col items-center gap-0.5">
            <Bot className="h-5 w-5 text-zinc-500" />
            <span className="text-[8px] font-semibold uppercase tracking-wider text-zinc-500">Advisor</span>
          </span>
        </button>
      </div>
    </nav>
  );
}
