"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, List, Skull } from "lucide-react";
import { RecommendationEngine } from "@/components/dashboard/recommendation-engine";
import { AnomalyAlerts } from "@/components/dashboard/anomaly-alerts";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";

type Tab = "recommendations" | "anomalies";

export default function RecommendationsPage() {
  const [tab, setTab] = useState<Tab>("recommendations");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <PageSkeleton cards={4} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Recommendations & Anomaly Detection</h1>
        <p className="text-sm text-zinc-500">AI-powered smart recommendations and fuel theft detection engine</p>
      </div>

      {/* Tab toggle */}
      <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-700/30 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("recommendations")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === "recommendations"
              ? "bg-emerald-500/15 text-emerald-400 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Lightbulb className="h-3.5 w-3.5" />
          Smart Recommendations
        </button>
        <button
          onClick={() => setTab("anomalies")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === "anomalies"
              ? "bg-rose-500/15 text-rose-400 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Skull className="h-3.5 w-3.5" />
          Anomaly Detection
        </button>
      </div>

      {tab === "recommendations" ? (
        <motion.div key="recs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-5">
          <RecommendationEngine />
        </motion.div>
      ) : (
        <motion.div key="anoms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-5">
          <AnomalyAlerts />
        </motion.div>
      )}
    </div>
  );
}
