"use client";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface RiskBadgeProps {
  score: number;
}

export function RiskBadge({ score }: RiskBadgeProps) {
  const isHigh = score >= 70;
  const isMedium = score >= 40;
  const Icon = isHigh ? AlertTriangle : isMedium ? AlertCircle : CheckCircle;

  return (
    <div className={cn(
      "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border",
      isHigh ? "bg-rose-500/10 border-rose-500/30 text-rose-400" :
      isMedium ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
      "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
    )}>
      <Icon className="h-3 w-3" />
      <span>{isHigh ? "High" : isMedium ? "Medium" : "Low"} Risk · {score}</span>
    </div>
  );
}
