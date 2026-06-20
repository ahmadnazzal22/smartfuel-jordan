"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, TrendingUp, TrendingDown, Activity,
  Fuel, Droplets, Gauge, Zap,
} from "lucide-react";

interface ExecutiveData {
  stabilityScore: number;
  fuelAvailability: number;
  distributionEfficiency: number;
  supplyChainHealth: number;
  totalStations: number;
  activeStations: number;
  totalTrucks: number;
  activeAlerts: number;
  summary: string;
}

const circumference = 2 * Math.PI * 54;

function GaugeSegment({ value, label, color }: { value: number; label: string; color: string }) {
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width="28" height="28" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          style={{ filter: `drop-shadow(0 0 6px ${color.replace(')', ',0.3)').replace('rgb', 'rgba')}` }}
        />
      </svg>
      <span className="text-[8px] font-semibold text-zinc-600 uppercase tracking-[0.08em] text-center leading-tight">{label}</span>
    </div>
  );
}

function MiniGauge({ value, label, color, size = 72 }: { value: number; label: string; color: string; size?: number }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={4} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
            strokeLinecap="round" strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold font-mono tabular-nums" style={{ color }}>{value}%</span>
        </div>
      </div>
      <span className="text-[9px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">{label}</span>
    </div>
  );
}

export function ExecutiveSummary() {
  const [data, setData] = useState<ExecutiveData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/v1/dashboard");
        const json = await res.json();
        const k = json.data;
        const notifRes = await fetch("/api/v1/notifications");
        const notifs = await notifRes.json();
        const activeAlerts = notifs.data?.filter((n: any) => n.severity === "critical" || n.severity === "warning").length || 0;
        setData({
          stabilityScore: Math.round(k.national_stability_score ?? 84),
          fuelAvailability: Math.round(k.fuel_availability_index ?? 78),
          distributionEfficiency: Math.round(k.distribution_efficiency ?? 91),
          supplyChainHealth: Math.round(k.supply_chain_health ?? 73),
          totalStations: k.total_stations ?? 8,
          activeStations: k.active_stations ?? 7,
          totalTrucks: k.total_trucks ?? 5,
          activeAlerts,
          summary: "National fuel network operating within safe parameters. Amman and Zarqa regions require monitoring due to elevated demand. Aqaba port supply chain remains stable with surplus diesel reserves. AI models predict 94% probability of stable supply across all governorates for the next 72 hours.",
        });
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="glass-panel-premium p-6">
        <div className="flex items-center gap-4">
          <div className="skeleton-premium h-28 w-28 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="skeleton-premium h-5 w-48" />
            <div className="skeleton-premium h-3 w-96" />
            <div className="skeleton-premium h-3 w-80" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stabilityColor = data.stabilityScore >= 80 ? "#34d399" : data.stabilityScore >= 60 ? "#fbbf24" : "#fb7185";
  const r = 64;
  const c = 2 * Math.PI * r;
  const offset = c - (data.stabilityScore / 100) * c;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="glass-panel-premium p-5 sm:p-6 relative overflow-hidden"
    >
      {/* Background decorative gradient */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/3 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/2 rounded-full blur-[100px]" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start gap-6">
        {/* Main gauge */}
        <div className="flex items-center gap-6">
          <div className="gauge-ring shrink-0">
            <svg width="152" height="152" viewBox="0 0 152 152">
              <circle cx="76" cy="76" r={r} className="bg-track" strokeWidth="8" />
              <motion.circle
                cx="76" cy="76" r={r} className="fg-track" stroke={stabilityColor}
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
                style={{ filter: `drop-shadow(0 0 12px ${stabilityColor})` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-4xl font-bold font-mono tabular-nums leading-none"
                style={{ color: stabilityColor }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {data.stabilityScore}
              </motion.span>
              <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-[0.12em] mt-0.5">Stability</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-zinc-700/50 to-transparent" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.08em]">Network Status</span>
              <div className="flex items-center gap-2">
                <span className="live-dot" />
                <span className="text-sm font-semibold text-emerald-400">Operational</span>
              </div>
              <p className="text-[10px] text-zinc-600 mt-0.5 font-mono">Last updated 30s ago</p>
            </div>
          </div>
        </div>

        {/* Gauges row */}
        <div className="flex-1 grid grid-cols-3 gap-4 sm:gap-6">
          <MiniGauge value={data.fuelAvailability} label="Fuel Avail." color="#34d399" size={72} />
          <MiniGauge value={data.distributionEfficiency} label="Distribution" color="#60a5fa" size={72} />
          <MiniGauge value={data.supplyChainHealth} label="Supply Chain" color="#a78bfa" size={72} />
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <div className="mini-stat">
            <div className="flex items-center gap-1.5">
              <Fuel className="h-3 w-3 text-emerald-400" />
              <span className="mini-stat-value text-emerald-400">{data.activeStations}</span>
              <span className="text-[9px] text-zinc-600 font-mono">/{data.totalStations}</span>
            </div>
            <span className="mini-stat-label">Stations</span>
          </div>
          <div className="mini-stat">
            <div className="flex items-center gap-1.5">
              <Truck className="h-3 w-3 text-blue-400" />
              <span className="mini-stat-value text-blue-400">{data.totalTrucks}</span>
            </div>
            <span className="mini-stat-label">Fleet</span>
          </div>
          <div className="mini-stat">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-rose-400" />
              <span className="mini-stat-value text-rose-400">{data.activeAlerts}</span>
            </div>
            <span className="mini-stat-label">Alerts</span>
          </div>
        </div>
      </div>

      {/* Executive AI Summary */}
      <motion.div
        className="mt-5 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="divider-premium mb-4" />
        <div className="flex items-start gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 shrink-0 mt-0.5">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.1em]">AI Executive Summary</span>
              <span className="text-[8px] font-mono text-zinc-600 px-1.5 py-0.5 rounded bg-zinc-800/30">Confidence 94%</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">{data.summary}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Truck(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
