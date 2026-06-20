"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiChart } from "@/components/dashboard/kpi-chart";
import { RegionTable } from "@/components/dashboard/region-table";
import { JordanMap } from "@/components/dashboard/jordan-map";
import { RbacSwitcher, type Role } from "@/components/dashboard/rbac-switcher";
import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { RiskHeatmap } from "@/components/dashboard/risk-heatmap";
import { AIInsightCards } from "@/components/dashboard/ai-insight-card";
import { TimelineFeed } from "@/components/dashboard/timeline-feed";
import { ExportBar } from "@/components/dashboard/export-bar";
import { useRealtime } from "@/hooks/use-realtime";
import {
  Shield, Activity, AlertTriangle, Droplets, Clock,
  RefreshCw, Gauge, MapPin, BarChart3, Fuel,
} from "lucide-react";

const roleViewLabels: Record<Role, { title: string; subtitle: string }> = {
  minister: { title: "National Fuel Intelligence Command", subtitle: "Hashemite Kingdom of Jordan — Executive Operations Dashboard" },
  owner: { title: "Station Operations Center", subtitle: "Fuel Station Network — Real-Time Status" },
  citizen: { title: "Fuel Access Portal", subtitle: "Public Availability — Jordan Fuel Index" },
};

export default function OverviewPage() {
  const [kpi, setKpi] = useState<any>(null);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [preds, setPreds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState<Role>("minister");
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [now, setNow] = useState<Date>(new Date());
  const rt = useRealtime();

  const fetchData = async () => {
    setLastSync(new Date());
    try {
      const [dash, notifRes, predRes] = await Promise.all([
        fetch("/api/v1/dashboard").then((r) => { if (!r.ok) throw new Error("Dashboard error"); return r.json(); }),
        fetch("/api/v1/notifications").then((r) => r.json()),
        fetch("/api/v1/predictions").then((r) => r.json()),
      ]);
      setKpi(dash.data);
      setNotifs(notifRes.data?.filter((n: any) => (n.severity === "critical" || n.severity === "warning")) || []);
      setPreds(predRes.data?.slice(0, 5) || []);
      setError("");
    } catch { setError("Failed to load dashboard"); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => { clearInterval(interval); clearInterval(tick); };
  }, []);

  useEffect(() => {
    if (rt.kpi && !loading && kpi) setKpi(rt.kpi);
    if (rt.alerts.length && !loading) setNotifs(rt.alerts);
  }, [rt.kpi, rt.alerts, rt.lastUpdate]);

  if (error && !kpi) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-rose-400">
      <AlertTriangle className="h-7 w-7" />
      <p className="text-sm font-medium">{error}</p>
    </div>
  );

  const kpiItems = [
    { title: "Fuel Availability", value: kpi?.fuel_availability_index ?? 0, unit: "%", change: 2.1, icon: Droplets, desc: "Nationwide supply ratio" },
    { title: "National Stability", value: kpi?.national_stability_score ?? 0, unit: "%", change: -0.8, icon: Shield, desc: "Network stability index" },
    { title: "Avg Waiting Time", value: Math.round(kpi?.avg_waiting_time_min ?? 0), unit: "min", change: -5.2, icon: Clock, desc: "Station queue time" },
    { title: "Distribution", value: kpi?.distribution_efficiency ?? 0, unit: "%", change: 1.3, icon: Activity, desc: "Delivery efficiency" },
    { title: "Supply Chain", value: kpi?.supply_chain_health ?? 0, unit: "%", change: 0.5, icon: Gauge, desc: "Chain health index" },
    { title: "Fraud Detection", value: kpi?.fraud_detection_score ?? 0, unit: "%", change: 0, icon: AlertTriangle, desc: "Anomaly coverage" },
  ];

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between animate-fade-in-down">
        <motion.div key={role} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{roleViewLabels[role].title}</h1>
            <div className="badge-live">
              <span className="live-dot" />
              Live
            </div>
            <span className="text-[9px] text-zinc-600 font-mono tabular-nums">
              Sync {Math.max(0, Math.floor((now.getTime() - lastSync.getTime()) / 1000))}s ago
            </span>
          </div>
          <p className="text-sm text-zinc-500">
            {roleViewLabels[role].subtitle}
          </p>
        </motion.div>
        <div className="flex items-center gap-3">
          <RbacSwitcher role={role} onChange={setRole} />
          <span className="text-xs text-zinc-600 font-mono tracking-tight">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          {rt.connected && <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />LIVE</span>}
          <ExportBar title="SmartFuel Overview" csvData={{ filename: "smartfuel-overview", headers: ["Metric", "Value"], rows: (kpi ? Object.entries(kpi).filter(([k]) => !["id", "snapshot_time", "createdAt"].includes(k)).map(([k, v]) => [k.replace(/_/g, " "), String(v)]) : []) }} />
          <button onClick={fetchData} className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ─── Executive Summary (full width hero) ─── */}
      <ExecutiveSummary />

      {/* ─── KPI Row ─── */}
      {loading ? (
        <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2 animate-fade-in-up stagger-1">
              <div className="glass-card space-y-3">
                <div className="skeleton-premium h-3 w-20" />
                <div className="skeleton-premium h-8 w-24" />
                <div className="skeleton-premium h-1 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {kpiItems.map((item, i) => (
            <div key={item.title} className={`col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2 animate-fade-in-up stagger-${i + 1}`}>
              <KpiCard {...item} />
            </div>
          ))}
        </div>
      )}

      {/* ─── Main Grid (2-column layout) ─── */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Column — Chart + Risk Heatmap */}
        <div className="col-span-12 lg:col-span-7 space-y-5">
          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-5">
            <KpiChart />
          </motion.div>

          {/* Risk Heatmap */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel p-5">
            <RiskHeatmap />
          </motion.div>
        </div>

        {/* Right Column — AI Insights + Timeline */}
        <div className="col-span-12 lg:col-span-5 space-y-5">
          {/* AI Insights */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-panel p-5">
            <AIInsightCards />
          </motion.div>

          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="glass-panel p-5">
            <TimelineFeed />
          </motion.div>
        </div>
      </div>

      {/* ─── Regional Table ─── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <MapPin className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="section-title">Governorate Breakdown</h3>
            <p className="text-[10px] text-zinc-600 mt-0.5">Per-region fuel status and station metrics</p>
          </div>
        </div>
        <RegionTable />
      </motion.div>

      {/* ─── Jordan Map ─── */}
      <motion.div
        key={`map-${role}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <MapPin className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="section-title">Geospatial Monitoring — Jordan Fuel Network</h3>
              <p className="text-[10px] text-zinc-600 mt-0.5">Satellite-linked real-time supply chain visualization</p>
            </div>
          </div>
          <JordanMap />
        </div>
      </motion.div>
    </div>
  );
}
