"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";
import { ExportBar } from "@/components/dashboard/export-bar";
import { EarlyWarningAI } from "@/components/dashboard/early-warning-ai";
import { predictionOutcomeConfig } from "@/lib/constants";
import {
  Bell, Clock, AlertTriangle, Shield, MapPin, BarChart3,
  TrendingUp, Radio, Zap, Globe,
} from "lucide-react";

export default function EarlyWarningPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/predictions")
      .then((r) => r.json())
      .then((d) => {
        const mapped = (d.data || []).map((p: any) => ({
          ...p, fuel_type: p.fuelType, prediction_date: p.predictionDate,
          station_id: p.stationId, predicted_level: p.predictedLevel,
        }));
        setPredictions(mapped);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton cards={4} />;

  const criticalCount = predictions.filter((p) => p.outcome === "critical_shortage").length;
  const warningCount = predictions.filter((p) => p.outcome === "shortage").length;
  const hoursToCritical = predictions
    .filter((p) => p.outcome === "critical_shortage")
    .map((p) => {
      const diff = new Date(p.predictionDate).getTime() - Date.now();
      return Math.max(0, Math.round(diff / 3600000));
    });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
              <Radio className="h-4 w-4 text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Early Warning System</h1>
              <p className="text-sm text-zinc-500">72-hour predictive intelligence — national fuel security monitoring</p>
            </div>
          </div>
        </div>
        <ExportBar title="Early Warning - SmartFuel Jordan" csvData={{ filename: "early-warning", headers: ["Region", "Fuel", "Outcome", "Confidence"], rows: predictions.map((p: any) => [p.region, p.fuelType, p.outcome, `${p.confidence}%`]) }} />
      </div>

      {/* Global Status Bar */}
      <div className="grid grid-cols-12 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-12 lg:col-span-4"
        >
          <Card className={`glass-card border-2 ${criticalCount > 0 ? "border-rose-500/30" : "border-emerald-500/20"}`}>
            <CardContent className="p-5 text-center">
              <AlertTriangle className={`h-8 w-8 mx-auto mb-2 ${criticalCount > 0 ? "text-rose-400 animate-pulse" : "text-emerald-400"}`} />
              <p className={`text-3xl font-mono font-bold ${criticalCount > 0 ? "text-rose-400" : "text-emerald-400"}`}>{criticalCount}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Critical Warnings</p>
              {criticalCount > 0 && <p className="text-[9px] text-rose-400/60 font-mono mt-1">Action required within {Math.min(...hoursToCritical)}h</p>}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-4"
        >
          <Card className="glass-card border-2 border-amber-500/20">
            <CardContent className="p-5 text-center">
              <Clock className="h-8 w-8 text-amber-400 mx-auto mb-2" />
              <p className="text-3xl font-mono font-bold text-amber-400">72</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Hour Horizon</p>
              <p className="text-[9px] text-amber-400/60 font-mono mt-1">Continuous AI monitoring active</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-4"
        >
          <Card className="glass-card border-2 border-blue-500/20">
            <CardContent className="p-5 text-center">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-mono font-bold text-blue-400">{predictions.length}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Active Predictions</p>
              <p className="text-[9px] text-blue-400/60 font-mono mt-1">{warningCount} warnings active</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 72h Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
              <TrendingUp className="h-4 w-4 text-rose-400" />
            </div>
            <div>
              <h3 className="section-title">72-Hour Risk Timeline</h3>
              <p className="text-[10px] text-zinc-600 mt-0.5">Predictive escalation window — all regions</p>
            </div>
          </div>
          <div className="relative">
            {/* Timeline bar */}
            <div className="h-2 rounded-full bg-zinc-800/50 overflow-hidden mb-8">
              <div className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" style={{ width: `${Math.min(criticalCount * 25 + warningCount * 10, 100)}%` }} />
            </div>
            <div className="flex justify-between text-[8px] text-zinc-600 font-mono mb-6">
              <span>0h</span><span>12h</span><span>24h</span><span>36h</span><span>48h</span><span>60h</span><span>72h</span>
            </div>

            {/* Prediction events on timeline */}
            <div className="space-y-3">
              {predictions.slice(0, 6).map((p, i) => {
                const cfg = predictionOutcomeConfig[p.outcome];
                const hoursTo = Math.max(0, Math.round((new Date(p.predictionDate).getTime() - Date.now()) / 3600000));
                const pctPos = Math.min(hoursTo / 72 * 100, 95);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative"
                  >
                    <button
                      onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                      className={`w-full text-left glass-inset transition-all hover:bg-zinc-800/40 ${expanded === p.id ? "ring-1 ring-amber-500/30" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-1 h-8 rounded-full ${p.outcome === "critical_shortage" ? "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.4)]" : p.outcome === "shortage" ? "bg-amber-500" : "bg-emerald-500"}`} />
                        <span className="text-lg">{cfg?.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-200">{p.region}</span>
                            <span className={`text-[8px] font-bold uppercase tracking-widest ${cfg?.text}`}>{cfg?.label}</span>
                          </div>
                          <p className="text-[9px] text-zinc-500">{p.fuelType?.replace(/_/g, " ")} · {p.predictionDate}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-[11px] font-mono font-bold ${hoursTo <= 24 ? "text-rose-400" : hoursTo <= 48 ? "text-amber-400" : "text-emerald-400"}`}>
                            {hoursTo}h
                          </p>
                          <p className="text-[8px] text-zinc-600">to event</p>
                        </div>
                      </div>
                    </button>
                    <AnimatePresence>
                      {expanded === p.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="glass-inset mt-1 ml-4 p-3 rounded-lg border-l-2 border-l-amber-500/30">
                            <div className="flex items-center gap-3 text-[9px] text-zinc-400">
                              <span>Confidence: <span className="font-mono text-zinc-200">{p.confidence}%</span></span>
                              <span>·</span>
                              <span>Level: <span className="font-mono text-zinc-200">{p.predicted_level?.toFixed(0)}L</span></span>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <Zap className="h-3 w-3 text-amber-400" />
                              <span className="text-[9px] text-amber-400/80 font-semibold">AI Recommendation:</span>
                              <span className="text-[9px] text-zinc-400">Pre-position reserves and activate contingency plan</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Early Warning AI Component */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <EarlyWarningAI />
      </motion.div>

      {/* Map Legend */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping-soft" />
              <span className="text-[9px] text-zinc-400 font-medium">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[9px] text-zinc-400 font-medium">Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-zinc-400 font-medium">Stable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[9px] text-zinc-400 font-medium">Surplus</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[8px] text-zinc-600 font-mono">
            <Clock className="h-2.5 w-2.5" />
            Updated in real-time
          </div>
        </div>
      </div>
    </div>
  );
}
