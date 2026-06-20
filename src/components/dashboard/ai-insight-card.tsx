"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, ArrowRight, TrendingUp, TrendingDown,
  AlertTriangle, Droplets, Truck, Zap,
} from "lucide-react";

interface Insight {
  id: string;
  type: "shortage" | "supply" | "demand" | "risk" | "fleet";
  severity: "critical" | "warning" | "success" | "info";
  title: string;
  description: string;
  metric: string;
  change: number;
  source: string;
  confidence: number;
  action?: string;
}

const severityConfig: Record<string, { bar: string; icon: any; color: string; bg: string }> = {
  critical: { bar: "critical", icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10" },
  warning: { bar: "warning", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
  success: { bar: "success", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  info: { bar: "info", icon: Droplets, color: "text-blue-400", bg: "bg-blue-500/10" },
};

const typeLabel: Record<string, string> = {
  shortage: "Shortage Forecast",
  supply: "Supply Alert",
  demand: "Demand Spike",
  risk: "Risk Detection",
  fleet: "Fleet Advisory",
};

export function AIInsightCards() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch("/api/v1/recommendations");
        const json = await res.json();
        const recs: Insight[] = (json.data || []).slice(0, 4).map((r: any, i: number) => {
          const severityMap: Record<number, string> = { 1: "critical", 2: "warning", 3: "info" };
          const typeMap: Record<string, string> = { restock: "supply", maintenance: "risk", prediction_alert: "shortage", fleet: "fleet" };
          return {
            id: `insight-${i}`,
            type: (typeMap[r.type] || "info") as Insight["type"],
            severity: (severityMap[r.priority] || "info") as Insight["severity"],
            title: r.message?.split(" — ")[0] || r.message,
            description: r.action || "",
            metric: r.region || r.stationName || "",
            change: r.fillPercent ? -(100 - r.fillPercent) : r.confidence ? r.confidence : 0,
            source: r.type === "prediction_alert" ? "AI Forecast" : "System Monitor",
            confidence: r.confidence || 82,
            action: r.expectedImpact,
          };
        });
        setInsights(recs.length > 0 ? recs : defaultInsights);
      } catch { setInsights(defaultInsights); }
      setLoading(false);
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="skeleton-premium h-8 w-8 rounded-lg" />
          <div className="space-y-1">
            <div className="skeleton-premium h-3 w-28" />
            <div className="skeleton-premium h-2 w-20" />
          </div>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton-premium h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
          <Brain className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="section-title">AI Intelligence</h3>
          <p className="text-[10px] text-zinc-600 mt-0.5">Machine-generated insights</p>
        </div>
      </div>

      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {insights.map((insight, i) => {
            const cfg = severityConfig[insight.severity];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={insight.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="insight-card"
              >
                <div className={`accent-bar ${cfg.bar}`} />
                <div className="flex items-start gap-3 pl-1">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.bg} shrink-0`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${cfg.color}`}>
                        {typeLabel[insight.type] || insight.type}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-600 bg-zinc-800/30 px-1.5 py-0.5 rounded">
                        {insight.confidence}% conf
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-200 mb-0.5">{insight.title}</p>
                    <p className="text-[9px] text-zinc-500 leading-relaxed mb-2">{insight.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-zinc-600">{insight.metric}</span>
                        {insight.change !== 0 && (
                          <span className={`flex items-center gap-0.5 text-[9px] font-mono ${
                            insight.change > 0 ? "text-emerald-400" : "text-rose-400"
                          }`}>
                            {insight.change > 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                            {Math.abs(insight.change).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      {insight.action && (
                        <div className="flex items-center gap-1 text-[8px] text-emerald-500 font-semibold">
                          <span>Impact</span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

const defaultInsights: Insight[] = [
  { id: "di1", type: "supply", severity: "warning", title: "Diesel reserves at 68% capacity", description: "Amman region inventory dropping 2.1%/day — schedule replenishment within 48 hours", metric: "Al-Hussein Station", change: -2.1, source: "Inventory Monitor", confidence: 87, action: "Prevents shortage" },
  { id: "di2", type: "demand", severity: "info", title: "Octane 95 demand up 12% in Zarqa", description: "Week-over-week increase correlates with new industrial zone opening", metric: "Zarqa Region", change: 12, source: "Demand Forecast", confidence: 92, action: "Adjust allocation" },
  { id: "di3", type: "risk", severity: "success", title: "Aqaba port supply chain stable", description: "All 3 tankers offloaded on schedule. Diesel surplus of 28% above threshold", metric: "Aqaba Port", change: 28, source: "Port Monitor", confidence: 96, action: "Maintain current" },
];
