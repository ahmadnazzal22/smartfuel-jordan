"use client";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Fuel, Ship, Truck, Activity, Zap } from "lucide-react";
import { ExportBar } from "@/components/dashboard/export-bar";

const DigitalTwinMap = dynamic(
  () => import("@/components/dashboard/digital-twin").then((m) => ({ default: m.DigitalTwin })),
  { ssr: false, loading: () => <div className="glass-panel p-0 overflow-hidden rounded-2xl flex items-center justify-center" style={{ height: "600px" }}><div className="h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" /></div> }
);

const metrics = [
  { icon: Fuel, label: "Fuel in Transit", value: "1,240,000 L", change: "+3.2%", color: "emerald" },
  { icon: Ship, label: "Aqaba Port Stock", value: "8,600,000 L", change: "+1.8%", color: "blue" },
  { icon: Truck, label: "Active Tankers", value: "47", change: "+5", color: "amber" },
  { icon: Activity, label: "Flow Efficiency", value: "94.3%", change: "+0.7%", color: "violet" },
];

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: "text-emerald-400" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", icon: "text-blue-400" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", icon: "text-amber-400" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", icon: "text-violet-400" },
};

export default function DigitalTwinPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20">
              <Zap className="h-3 w-3 text-emerald-400" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400/70 uppercase">Live Monitoring</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Jordan Fuel Network</h1>
          <p className="text-sm text-zinc-500">3D real-time fuel supply chain visualization — National Command Center</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-emerald-500/10 rounded-full px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
            <span className="text-[8px] text-emerald-400 font-mono font-bold tracking-wider">3D ACTIVE</span>
          </div>
          <ExportBar title="Digital Twin - SmartFuel Jordan" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-12 gap-4">
        {metrics.map((m, i) => {
          const c = colorMap[m.color];
          return (
            <div key={m.label} className="col-span-6 lg:col-span-3 animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 80}ms` }}>
              <Card className="glass-card group hover:border-zinc-600/50 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.bg} group-hover:scale-110 transition-transform duration-300`}>
                      <m.icon className={`h-4 w-4 ${c.icon}`} />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{m.label}</p>
                      <p className="text-lg font-mono font-bold text-zinc-100 leading-tight">{m.value}</p>
                      <p className={`text-[10px] ${c.text}/70 font-mono`}>{m.change}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* 3D Map */}
      <div className="animate-fade-in-up opacity-0" style={{ animationDelay: "200ms" }}>
        <DigitalTwinMap />
      </div>

      {/* Supply Flow + Port Schedule */}
      <div className="grid grid-cols-12 gap-5 animate-fade-in-up opacity-0" style={{ animationDelay: "350ms" }}>
        <div className="col-span-12 lg:col-span-6">
          <div className="glass-panel p-5 h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Activity className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h3 className="section-title">Supply Flow Analysis</h3>
                <p className="text-[10px] text-zinc-600 mt-0.5">Pipeline distribution from Aqaba to governorates</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { region: "Amman", volume: "480,000 L/d", status: "stable", pct: 92 },
                { region: "Irbid", volume: "210,000 L/d", status: "stable", pct: 78 },
                { region: "Zarqa", volume: "185,000 L/d", status: "warning", pct: 61 },
                { region: "Karak", volume: "95,000 L/d", status: "warning", pct: 54 },
                { region: "Ma'an", volume: "70,000 L/d", status: "stable", pct: 82 },
              ].map((r) => (
                <div key={r.region} className="glass-inset flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-zinc-200">{r.region}</span>
                      <span className="text-[9px] font-mono text-zinc-400">{r.volume}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-zinc-800/50 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            r.status === "critical" ? "bg-rose-500" : r.status === "warning" ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                      <span className={`text-[9px] font-mono font-semibold ${
                        r.status === "critical" ? "text-rose-400" : r.status === "warning" ? "text-amber-400" : "text-emerald-400"
                      }`}>{r.pct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="glass-panel p-5 h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <Ship className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <h3 className="section-title">Aqaba Port — Inbound Supply</h3>
                <p className="text-[10px] text-zinc-600 mt-0.5">Upcoming shipments and dock status</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { vessel: "MT Red Sea", fuel: "Diesel", volume: "2,400,000 L", eta: "2026-06-22", status: "scheduled" },
                { vessel: "MT Petra", fuel: "Octane 95", volume: "1,800,000 L", eta: "2026-06-23", status: "scheduled" },
                { vessel: "MT Jordan Star", fuel: "Kerosene", volume: "1,200,000 L", eta: "2026-06-25", status: "scheduled" },
              ].map((s) => (
                <div key={s.vessel} className="glass-inset flex items-center gap-3 hover:bg-zinc-800/40 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/40">
                    <Ship className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-200">{s.vessel}</p>
                    <p className="text-[9px] text-zinc-500">{s.fuel} · {s.volume}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono text-zinc-400">{s.eta}</p>
                    <span className="text-[7px] uppercase tracking-wider font-semibold text-emerald-400/60">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
