"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { EarlyWarningAI } from "@/components/dashboard/early-warning-ai";
import { predictionOutcomeConfig } from "@/lib/constants";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";
import { motion } from "framer-motion";
import { Clock, Bell, BarChart3, AlertTriangle } from "lucide-react";
import type { PredictionOutcome, PredictionExplanation } from "@/types/prediction";

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [explanations, setExplanations] = useState<Record<string, PredictionExplanation>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"predictions" | "early-warning">("predictions");

  useEffect(() => {
    fetch("/api/v1/predictions").then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); }).then((d) => {
      const exps: Record<string, PredictionExplanation> = {};
      const mapped = d.data.map((p: any) => {
        const exp = p.explanations?.[0];
        if (exp) {
          exps[p.id] = {
            predictionId: p.id,
            stationId: p.stationId,
            region: p.region,
            fuelType: p.fuelType,
            predictionDate: p.predictionDate,
            outcome: p.outcome,
            confidence: p.confidence,
            timestamp: exp.timestamp,
            contributingFactors: (exp.factors || []).map((f: any) => ({
              factor: f.factor,
              label: f.label,
              weight: f.weight,
              value: f.value,
              trend: f.trend,
              threshold: f.threshold,
            })),
            recommendedActions: (exp.actions || []).map((a: any) => ({
              priority: a.priority,
              action: a.action,
              label: a.label,
              params: a.params ? JSON.parse(a.params) : {},
              expectedImpact: a.expectedImpact,
            })),
            shapValues: exp.shapValues ? JSON.parse(exp.shapValues) : undefined,
            counterfactuals: exp.counterfactuals ? JSON.parse(typeof exp.counterfactuals === "string" ? exp.counterfactuals : "[]") : undefined,
          };
        }
        return { ...p, fuel_type: p.fuelType, prediction_date: p.predictionDate, station_id: p.stationId, predicted_level: p.predictedLevel, created_at: p.createdAt };
      });
      setPredictions(mapped);
      setExplanations(exps);
      if (mapped.length > 0) setSelected(mapped[0].id);
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, []);

  if (loading) return <PageSkeleton cards={4} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Predictions & Early Warning AI</h1>
        <p className="text-sm text-zinc-500">AI-powered shortage forecasting with 72-hour early detection</p>
      </div>

      {/* Tab toggle */}
      <div className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-700/30 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("predictions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === "predictions"
              ? "bg-emerald-500/15 text-emerald-400 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Standard Predictions
        </button>
        <button
          onClick={() => setTab("early-warning")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            tab === "early-warning"
              ? "bg-rose-500/15 text-rose-400 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Bell className="h-3.5 w-3.5" />
          Early Warning AI
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/20 text-[8px] font-bold text-rose-400">4</span>
        </button>
      </div>

      {tab === "early-warning" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EarlyWarningAI />
        </motion.div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold">All Predictions</h3>
            {predictions.map((p) => {
              const cfg = predictionOutcomeConfig[p.outcome];
              return (
                <Card
                  key={p.id}
                  className={`glass-card cursor-pointer transition-all duration-200 ${selected === p.id ? "ring-2 ring-amber-500/50" : "hover:bg-zinc-800/40"}`}
                  onClick={() => setSelected(p.id)}
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{cfg.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{p.region}</p>
                        <p className="text-xs text-zinc-500 capitalize">{p.fuel_type.replace("_", " ")} · {p.prediction_date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</p>
                      <p className="text-xs text-zinc-500">{p.confidence}%</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            {selected && explanations[selected] ? (
              <>
                <h3 className="text-sm font-semibold mb-3">Explanation</h3>
                <PredictionCard explanation={explanations[selected]} />
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-sm text-zinc-500">
                {selected ? "No AI explanation available for this prediction" : "Select a prediction to view details"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
