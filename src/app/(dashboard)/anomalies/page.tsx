"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skull, Shield, Activity, RefreshCw, ChevronDown } from "lucide-react";
import { AnomalyAlerts } from "@/components/dashboard/anomaly-alerts";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";

type Stats = {
  total: number;
  open: number;
  bySeverity: Record<string, number>;
  byType: Record<string, number>;
};

export default function AnomaliesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/v1/anomalies");
        const json = await res.json();
        const data = json.data || [];
        const bySeverity: Record<string, number> = {};
        const byType: Record<string, number> = {};
        data.forEach((a: any) => {
          bySeverity[a.severity] = (bySeverity[a.severity] || 0) + 1;
          byType[a.type] = (byType[a.type] || 0) + 1;
        });
        setStats({
          total: data.length,
          open: data.filter((a: any) => a.status === "open").length,
          bySeverity,
          byType,
        });
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <PageSkeleton cards={4} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Anomaly Detection</h1>
        <p className="text-sm text-zinc-500">Fuel theft detection, sensor anomalies, and network security monitoring</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6 sm:col-span-3">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-3.5 w-3.5 text-zinc-500" />
              <span className="kpi-label">Total Incidents</span>
            </div>
            <p className="text-2xl font-bold tabular-nums text-zinc-100">{stats?.total || 0}</p>
          </div>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Skull className="h-3.5 w-3.5 text-rose-400" />
              <span className="kpi-label">Open</span>
            </div>
            <p className="text-2xl font-bold tabular-nums text-rose-400">{stats?.open || 0}</p>
          </div>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-3.5 w-3.5 text-amber-400" />
              <span className="kpi-label">Critical</span>
            </div>
            <p className="text-2xl font-bold tabular-nums text-amber-400">{stats?.bySeverity?.critical || 0}</p>
          </div>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span className="kpi-label">Resolved</span>
            </div>
            <p className="text-2xl font-bold tabular-nums text-emerald-400">
              {(stats?.total || 0) - (stats?.open || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Anomaly alerts panel */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-5">
        <AnomalyAlerts />
      </motion.div>
    </div>
  );
}
