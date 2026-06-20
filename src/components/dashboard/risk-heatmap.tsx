"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface RegionRisk {
  name: string;
  risk: number;
  fuelAvg: number;
  stations: number;
  trend: "up" | "down" | "stable";
  alerts: number;
}

function riskBg(score: number): string {
  if (score >= 70) return "bg-rose-500/15 border-rose-500/20";
  if (score >= 40) return "bg-amber-500/10 border-amber-500/15";
  return "bg-emerald-500/8 border-emerald-500/10";
}

function riskGlow(score: number): string {
  if (score >= 70) return "shadow-[0_0_20px_rgba(244,63,94,0.08)]";
  if (score >= 40) return "shadow-[0_0_20px_rgba(245,158,11,0.06)]";
  return "shadow-[0_0_20px_rgba(16,185,129,0.05)]";
}

function riskColor(score: number): string {
  if (score >= 70) return "text-rose-400";
  if (score >= 40) return "text-amber-400";
  return "text-emerald-400";
}

function riskBarColor(score: number): string {
  if (score >= 70) return "bg-rose-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-emerald-500";
}

export function RiskHeatmap() {
  const [regions, setRegions] = useState<RegionRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/regions").then((r) => r.json()).then((d) => {
      const mapped: RegionRisk[] = (d.data || []).map((r: any) => ({
        name: r.name,
        risk: r.risk_score ?? Math.round(r.at_risk / Math.max(r.stations, 1) * 100),
        fuelAvg: r.avg_fuel,
        stations: r.stations,
        trend: r.trend || "stable",
        alerts: r.at_risk ?? 0,
      }));
      setRegions(mapped);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 mb-4">
          <div className="skeleton-premium h-8 w-8 rounded-lg" />
          <div className="space-y-1">
            <div className="skeleton-premium h-3 w-28" />
            <div className="skeleton-premium h-2 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="skeleton-premium h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (regions.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
          <MapPin className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <h3 className="section-title">Regional Risk Heatmap</h3>
          <p className="text-[10px] text-zinc-600 mt-0.5">Governorate-level risk assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {regions.map((region, i) => {
          const isSelected = selected === region.name;
          return (
            <motion.button
              key={region.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => setSelected(isSelected ? null : region.name)}
              className={`heatmap-cell ${riskBg(region.risk)} ${riskGlow(region.risk)} ${
                isSelected ? "ring-2 ring-emerald-500/40 scale-[1.03]" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-zinc-200">{region.name}</span>
                <span className={`text-[10px] font-bold font-mono ${riskColor(region.risk)}`}>
                  {region.risk}
                </span>
              </div>

              {/* Risk bar */}
              <div className="h-1.5 rounded-full bg-zinc-800/60 overflow-hidden mb-2.5">
                <motion.div
                  className={`h-full rounded-full ${riskBarColor(region.risk)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${region.risk}%` }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>

              <div className="flex items-center justify-between text-[9px]">
                <span className="text-zinc-500 font-mono">{region.fuelAvg}% avg</span>
                <div className="flex items-center gap-1">
                  {region.alerts > 0 && (
                    <span className="flex items-center gap-0.5 text-rose-400">
                      <AlertTriangle className="h-2.5 w-2.5" />
                      {region.alerts}
                    </span>
                  )}
                  {region.trend === "up" && <TrendingUp className="h-2.5 w-2.5 text-emerald-400" />}
                  {region.trend === "down" && <TrendingDown className="h-2.5 w-2.5 text-rose-400" />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
