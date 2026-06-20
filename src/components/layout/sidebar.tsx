"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, MapPin, BarChart3, Truck, Bell, Shield,
  ChevronLeft, Fuel, Globe, AlertTriangle, Radio, Bot, Zap,
  Lightbulb, List, Skull,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/command-center", label: "Command Center", icon: Radio },
  { href: "/digital-twin", label: "Digital Twin", icon: Globe },
  { href: "/early-warning", label: "Early Warning", icon: Zap },
  { href: "/stations", label: "Stations", icon: MapPin },
  { href: "/predictions", label: "Predictions", icon: BarChart3 },
  { href: "/trucks", label: "Trucks", icon: Truck },
  { href: "/national-risk", label: "Risk Dashboard", icon: AlertTriangle },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/audit-trail", label: "Audit Trail", icon: List },
  { href: "/anomalies", label: "Anomaly Detection", icon: Skull },
  { href: "/analytics", label: "Analytics", icon: Shield },
];

export function Sidebar() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-zinc-700/40 bg-zinc-950/80 backdrop-blur-2xl transition-all duration-300 z-10",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-3 border-b border-zinc-700/40 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/15 ring-1 ring-white/10">
          <Fuel className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-zinc-100">SmartFuel</span>
              <span className="live-dot" />
            </div>
            <p className="text-[8px] text-zinc-600 tracking-[0.1em] uppercase font-medium">Jordan</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 mt-2">
        {navItems.map((item) => {
          const active = path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 relative",
                active
                  ? "bg-emerald-500/10 text-emerald-400 font-medium shadow-[0_0_20px_-4px_rgba(16,185,129,0.15)]"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
              <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200", active && "scale-110")} />
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && (
                <span className="ml-auto w-1 h-1 rounded-full bg-emerald-400 animate-live-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse */}
      <div className="border-t border-zinc-700/40 p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-xl py-2.5 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/30 transition-all"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")} />
        </button>
      </div>
    </aside>
  );
}
