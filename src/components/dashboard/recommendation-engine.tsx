"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, AlertTriangle, Clock, Truck, Droplets,
  Wrench, ArrowRight, RefreshCw,
} from "lucide-react";

type Recommendation = {
  type: string;
  priority: number;
  stationId?: string;
  stationName?: string;
  truckId?: string;
  region?: string;
  fuelType?: string;
  message: string;
  action: string;
  expectedImpact?: string;
  currentLevel?: number;
  maxCapacity?: number;
  fillPercent?: number;
  outcome?: string;
  confidence?: number;
  plateNumber?: string;
};

const typeConfig: Record<string, { icon: any; label: string; color: string }> = {
  restock: { icon: Droplets, label: "Restock Alert", color: "text-amber-400" },
  maintenance: { icon: Wrench, label: "Maintenance", color: "text-blue-400" },
  prediction_alert: { icon: AlertTriangle, label: "AI Prediction", color: "text-rose-400" },
  fleet: { icon: Truck, label: "Fleet Advisory", color: "text-emerald-400" },
};

export function RecommendationEngine() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/recommendations");
      const json = await res.json();
      setRecommendations(json.data);
      setMeta(json.meta);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = filter === "all" ? recommendations : recommendations.filter((r) => r.type === filter);

  return (
    <div className="space-y-5">
      {/* Header with filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <Lightbulb className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="section-title">Smart Recommendations</h3>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              {meta ? `${meta.critical} critical, ${meta.warnings} warnings, ${meta.info} info` : "Loading..."}
            </p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/40 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "restock", "maintenance", "prediction_alert", "fleet"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
              filter === t
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                : "text-zinc-500 hover:text-zinc-300 bg-zinc-800/20 border border-transparent"
            }`}
          >
            {t === "all" ? "All" : tConfigLabel(t)}
          </button>
        ))}
      </div>

      {/* Recommendation cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-inset p-4 space-y-2 animate-pulse">
              <div className="h-3 w-24 bg-zinc-800/40 rounded" />
              <div className="h-4 w-3/4 bg-zinc-800/30 rounded" />
              <div className="h-3 w-1/2 bg-zinc-800/20 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-600 gap-2">
          <Lightbulb className="h-8 w-8 opacity-30" />
          <p className="text-xs font-medium">No recommendations</p>
          <p className="text-[10px]">All systems operating normally</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filtered.map((rec, i) => {
              const cfg = typeConfig[rec.type] || { icon: Lightbulb, label: "Advisory", color: "text-zinc-400" };
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={`${rec.type}-${rec.stationId || rec.truckId || i}`}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className={`glass-inset p-4 border-l-2 ${
                    rec.priority === 1 ? "border-l-rose-500" : rec.priority === 2 ? "border-l-amber-500" : "border-l-emerald-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/40 shrink-0 ${cfg.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-semibold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                          rec.priority === 1 ? "bg-rose-500/15 text-rose-400" : rec.priority === 2 ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"
                        }`}>
                          P{rec.priority}
                        </span>
                        {rec.confidence && (
                          <span className="text-[8px] font-mono text-zinc-500">{rec.confidence}% conf</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-zinc-200 mb-0.5">{rec.message}</p>
                      {rec.region && <p className="text-[9px] text-zinc-500 mb-1.5">{rec.region}{rec.stationName ? ` · ${rec.stationName}` : ""}</p>}
                      <div className="flex items-center gap-2 text-[10px]">
                        <ArrowRight className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span className="text-zinc-400">{rec.action}</span>
                      </div>
                      {rec.expectedImpact && (
                        <p className="text-[9px] text-zinc-600 mt-1 italic">Impact: {rec.expectedImpact}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

function tConfigLabel(t: string): string {
  const map: Record<string, string> = {
    restock: "Restock",
    maintenance: "Maintenance",
    prediction_alert: "AI Alerts",
    fleet: "Fleet",
  };
  return map[t] || t;
}
