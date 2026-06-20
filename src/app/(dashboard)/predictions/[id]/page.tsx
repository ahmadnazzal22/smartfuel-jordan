"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PredictionCard } from "@/components/predictions/prediction-card";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";
import type { PredictionExplanation } from "@/types/prediction";

export default function PredictionDetailPage() {
  const { id } = useParams();
  const [explanation, setExplanation] = useState<PredictionExplanation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/predictions/${id}`).then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); }).then((d) => {
      const p = d.data;
      const exp = p.explanations?.[0];
      if (exp) {
        setExplanation({
          predictionId: p.id,
          stationId: p.stationId,
          region: p.region,
          fuelType: p.fuelType,
          predictionDate: p.predictionDate,
          outcome: p.outcome,
          confidence: p.confidence,
          timestamp: exp.timestamp,
          contributingFactors: (exp.factors || []).map((f: any) => ({ factor: f.factor, label: f.label, weight: f.weight, value: f.value, trend: f.trend, threshold: f.threshold })),
          recommendedActions: (exp.actions || []).map((a: any) => ({ priority: a.priority, action: a.action, label: a.label, params: a.params ? JSON.parse(a.params) : {}, expectedImpact: a.expectedImpact })),
        });
      }
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, [id]);

  if (loading) return <PageSkeleton cards={2} />;
  if (!explanation) return <div className="text-center text-zinc-500 py-12">Prediction not found</div>;

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Prediction Details</h1>
      <PredictionCard explanation={explanation} />
    </div>
  );
}
