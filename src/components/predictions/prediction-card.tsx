"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { predictionOutcomeConfig } from "@/lib/constants";
import type { PredictionExplanation } from "@/types/prediction";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Gauge, Lightbulb, Target, Truck, Cloud, ShoppingCart, Calendar, DollarSign, Wrench, Fuel, AlertTriangle } from "lucide-react";

const factorIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  traffic: Truck, weather: Cloud, demand: ShoppingCart, supply: Fuel,
  seasonal: Calendar, economic: DollarSign, maintenance: Wrench, price: DollarSign,
  production: Fuel, distribution: Truck, consumption: ShoppingCart,
};

interface Props {
  explanation: PredictionExplanation;
}

export function PredictionCard({ explanation }: Props) {
  const cfg = predictionOutcomeConfig[explanation.outcome];

  return (
    <Card className={cn("glass-card overflow-hidden")}>
      <div className={cn("h-1 w-full", cfg.border.replace("border-l-4 border-", "bg-"))} />
      <CardContent className="p-5 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{cfg.icon}</span>
              <div>
                <span className={cn("font-bold text-sm", cfg.text)}>{cfg.label}</span>
                <Badge variant="outline" className="ml-2 text-[10px] border-zinc-700/40">{explanation.fuelType.replace("_", " ")}</Badge>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
              <Target className="h-3 w-3" />
              {explanation.region}{explanation.stationId ? " · Station" : ""} · {explanation.predictionDate}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tracking-tight">{explanation.confidence}%</div>
            <p className="text-[10px] text-zinc-500 font-medium">Confidence</p>
          </div>
        </div>

        <Separator className="bg-zinc-800/40" />

        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider">
            <Gauge className="h-3 w-3" /> Contributing Factors
          </h4>
          <div className="space-y-2.5">
            {explanation.contributingFactors.map((f) => {
              const FactorIcon = factorIcons[f.factor.toLowerCase()] || AlertTriangle;
              return (
              <div key={f.factor}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FactorIcon className="h-3 w-3 text-zinc-500" />
                    {f.label}
                  </span>
                  <span className="text-zinc-500 tabular-nums">{(f.weight * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800/40 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", f.weight > 0.35 ? "bg-gradient-to-r from-rose-500 to-rose-400" : f.weight > 0.2 ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-blue-500 to-blue-400")}
                    style={{ width: `${f.weight * 100}%` }}
                  />
                </div>
              </div>
              );
            })}
          </div>
        </div>

        <Separator className="bg-zinc-800/40" />

        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 mb-3 uppercase tracking-wider">
            <Lightbulb className="h-3 w-3" /> Recommended Actions
          </h4>
          <div className="space-y-2">
            {explanation.recommendedActions.map((a) => (
              <div key={a.priority} className="flex items-start gap-3 rounded-lg bg-zinc-800/20 border border-zinc-700/30 p-3 hover:bg-zinc-800/30 transition-colors">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800/40 text-[11px] font-bold text-zinc-400">
                  {a.priority}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-200">{a.label}</p>
                  {a.expectedImpact && (
                    <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                      {a.expectedImpact}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
