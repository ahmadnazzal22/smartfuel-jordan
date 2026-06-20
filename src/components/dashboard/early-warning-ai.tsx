"use client";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Bell, Clock, TrendingUp, Fuel } from "lucide-react";
import { motion } from "framer-motion";

interface EarlyWarning {
  region: string;
  fuelType: string;
  severity: "critical" | "high" | "moderate";
  eta: string;
  hoursRemaining: number;
  message: string;
  recommendation: string;
}

const warnings: EarlyWarning[] = [
  { region: "Zarqa", fuelType: "Diesel", severity: "critical", eta: "2026-06-21 14:00", hoursRemaining: 14, message: "Diesel reserves critically low — projected depletion within 14 hours", recommendation: "Divert 3 tankers from Amman reserve immediately" },
  { region: "Karak", fuelType: "Diesel", severity: "high", eta: "2026-06-22 08:00", hoursRemaining: 32, message: "Supply chain disruption expected — Karak corridor at risk", recommendation: "Schedule emergency shipment from Aqaba port" },
  { region: "Irbid", fuelType: "Octane 90", severity: "moderate", eta: "2026-06-23 02:00", hoursRemaining: 50, message: "Demand surge detected — 23% above seasonal average", recommendation: "Increase allocation by 15% for next 48 hours" },
  { region: "Mafraq", fuelType: "Diesel", severity: "high", eta: "2026-06-22 16:00", hoursRemaining: 40, message: "Road closure risk along Mafraq-Amman highway may delay supply", recommendation: "Pre-position fuel at Mafraq depot" },
];

const severityConfig = {
  critical: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", dot: "bg-rose-400 animate-ping-soft", icon: AlertTriangle, label: "CRITICAL" },
  high: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", dot: "bg-amber-400 animate-pulse", icon: Bell, label: "HIGH" },
  moderate: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", dot: "bg-blue-400", icon: TrendingUp, label: "MODERATE" },
};

export function EarlyWarningAI() {
  const now = useMemo(() => new Date(), []);

  return (
    <div className="space-y-4">
      {/* Global countdown bar */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10">
              <Clock className="h-3.5 w-3.5 text-rose-400" />
            </div>
            <div>
              <h3 className="section-title text-sm">72-Hour Early Warning System</h3>
              <p className="text-[9px] text-zinc-600">AI-predicted shortage horizon</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 bg-emerald-500/10 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
            <span className="text-[8px] text-emerald-400 font-mono font-bold tracking-wider">ACTIVE</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-zinc-800/50 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" style={{ width: "72%" }} />
          </div>
          <span className="text-[10px] font-mono text-zinc-400 font-semibold">72h</span>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[8px] text-zinc-600 font-mono">0h</span>
          <span className="text-[8px] text-zinc-600 font-mono">24h</span>
          <span className="text-[8px] text-zinc-600 font-mono">48h</span>
          <span className="text-[8px] text-zinc-600 font-mono">72h</span>
        </div>
      </div>

      {/* Warnings */}
      {warnings.map((w, i) => {
        const cfg = severityConfig[w.severity];
        const Icon = cfg.icon;
        return (
          <motion.div
            key={`${w.region}-${w.fuelType}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`glass-card border-l-2 ${cfg.border}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-200">{w.region}</span>
                      <span className={`text-[8px] font-bold uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
                      <span className={`ml-auto text-[9px] font-mono ${cfg.color} font-semibold`}>
                        {w.hoursRemaining}h
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mb-1">{w.message}</p>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-2.5 w-2.5 text-zinc-500" />
                      <span className="text-[8px] text-zinc-500 font-mono">{w.fuelType}</span>
                      <span className="text-[8px] text-zinc-600">·</span>
                      <span className="text-[8px] text-zinc-500">Eta: {w.eta}</span>
                    </div>
                    <div className="mt-2 glass-inset py-1.5 px-2">
                      <p className="text-[9px] text-zinc-300">
                        <span className="text-emerald-400 font-semibold">AI Recommendation:</span> {w.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
