"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Skull, Truck, Droplets, Wifi,
  Gauge, RefreshCw, Filter, X,
} from "lucide-react";

type Anomaly = {
  id: string;
  type: string;
  severity: string;
  description: string;
  detectedValue: number;
  expectedValue: number | null;
  deviationPercent: number | null;
  status: string;
  region: string | null;
  createdAt: string;
  station?: { name: string; region: string } | null;
  truck?: { plateNumber: string } | null;
};

const severityConfig: Record<string, { color: string; bg: string; label: string }> = {
  critical: { color: "text-rose-400", bg: "bg-rose-500/10", label: "Critical" },
  high: { color: "text-orange-400", bg: "bg-orange-500/10", label: "High" },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10", label: "Medium" },
  low: { color: "text-zinc-400", bg: "bg-zinc-500/10", label: "Low" },
};

const typeConfig: Record<string, { icon: any; label: string }> = {
  fuel_theft: { icon: Skull, label: "Fuel Theft" },
  sensor_malfunction: { icon: Wifi, label: "Sensor Malfunction" },
  inventory_discrepancy: { icon: Droplets, label: "Inventory Discrepancy" },
  route_deviation: { icon: Truck, label: "Route Deviation" },
  meter_tampering: { icon: Gauge, label: "Meter Tampering" },
};

export function AnomalyAlerts() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (severityFilter) params.set("severity", severityFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/v1/anomalies?${params}`);
      const json = await res.json();
      setAnomalies(json.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [severityFilter, statusFilter]);

  const openCount = anomalies.filter((a) => a.status === "open").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${openCount > 0 ? "bg-rose-500/15" : "bg-emerald-500/10"}`}>
            <AlertTriangle className={`h-4 w-4 ${openCount > 0 ? "text-rose-400" : "text-emerald-400"}`} />
          </div>
          <div>
            <h3 className="section-title">Anomaly Detection Engine</h3>
            <p className="text-[10px] text-zinc-600 mt-0.5">{openCount} open incidents</p>
          </div>
        </div>
        <button onClick={fetchData} className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/40 text-zinc-500 hover:text-zinc-300 transition-all">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600 mr-1">Severity:</span>
        {["", "critical", "high", "medium", "low"].map((s) => (
          <button
            key={s}
            onClick={() => setSeverityFilter(s)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
              severityFilter === s
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "text-zinc-500 hover:text-zinc-300 bg-zinc-800/20 border border-transparent"
            }`}
          >{s || "All"}</button>
        ))}
        <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600 mx-1">Status:</span>
        {["", "open", "investigating", "resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
              statusFilter === s
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "text-zinc-500 hover:text-zinc-300 bg-zinc-800/20 border border-transparent"
            }`}
          >{s || "All"}</button>
        ))}
      </div>

      {/* Anomaly cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-inset p-4 space-y-2 animate-pulse">
              <div className="h-3 w-20 bg-zinc-800/40 rounded" />
              <div className="h-4 w-3/4 bg-zinc-800/30 rounded" />
              <div className="h-3 w-1/3 bg-zinc-800/20 rounded" />
            </div>
          ))}
        </div>
      ) : anomalies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-600 gap-2">
          <ShieldCheck className="h-8 w-8 opacity-30" />
          <p className="text-xs font-medium">No anomalies detected</p>
          <p className="text-[10px]">All systems operating within normal parameters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {anomalies.map((a, i) => {
            const sevCfg = severityConfig[a.severity] || severityConfig.medium;
            const typeCfg = typeConfig[a.type] || { icon: AlertTriangle, label: a.type };
            const Icon = typeCfg.icon;
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className={`glass-inset p-4 border-l-2 ${
                  a.severity === "critical" ? "border-l-rose-500" : a.severity === "high" ? "border-l-orange-500" : a.severity === "medium" ? "border-l-amber-500" : "border-l-zinc-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${sevCfg.bg} shrink-0`}>
                    <Icon className={`h-4 w-4 ${sevCfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[9px] font-semibold uppercase tracking-wider ${sevCfg.color}`}>{typeCfg.label}</span>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${sevCfg.bg} ${sevCfg.color}`}>{a.severity}</span>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                        a.status === "open" ? "bg-rose-500/10 text-rose-400" : a.status === "investigating" ? "bg-blue-500/10 text-blue-400" : "bg-zinc-500/10 text-zinc-400"
                      }`}>{a.status}</span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-200 mb-0.5">{a.description}</p>
                    <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-500 mt-1">
                      {a.detectedValue !== undefined && <span>Detected: {a.detectedValue.toFixed(1)}</span>}
                      {a.expectedValue !== null && a.expectedValue !== undefined && <span>Expected: {a.expectedValue.toFixed(1)}</span>}
                      {a.deviationPercent !== null && a.deviationPercent !== undefined && (
                        <span className={Math.abs(a.deviationPercent) > 20 ? "text-rose-400" : "text-amber-400"}>
                          Δ {a.deviationPercent > 0 ? "+" : ""}{a.deviationPercent.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-1">
                      {a.station?.name || ""}{a.station?.region ? ` · ${a.station.region}` : ""}{a.truck?.plateNumber ? ` · ${a.truck.plateNumber}` : ""}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
