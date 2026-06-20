"use client";
import { cn } from "@/lib/utils";
import { AnimatedCount } from "@/components/ui/animated-count";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  icon?: React.ComponentType<{ className?: string }>;
  desc?: string;
  className?: string;
}

export function KpiCard({ title, value, unit, change, icon: Icon, desc, className }: KpiCardProps) {
  const TrendIcon = change === undefined ? null : change > 0 ? TrendingUp : change < 0 ? TrendingDown : Minus;
  const trendColor = change === undefined ? "" : change > 0 ? "text-emerald-400" : change < 0 ? "text-rose-400" : "text-zinc-500";

  return (
    <div className={cn("glass-card group", className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="kpi-label">{title}</span>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800/40 group-hover:bg-emerald-500/10 transition-colors duration-300">
            <Icon className="h-3.5 w-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors duration-300" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 tabular-nums mb-1.5">
        <span className="kpi-value">
          {typeof value === "number" ? <AnimatedCount value={value} /> : value}
        </span>
        {unit && <span className="text-sm font-medium text-zinc-500">{unit}</span>}
      </div>

      {desc && (
        <p className="text-[10px] text-zinc-600 leading-relaxed mb-3 line-clamp-1">{desc}</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40">
        <div className="h-1 rounded-full bg-zinc-800/60 flex-1 max-w-[80px] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${Math.min(Math.abs(Number(value) || 50), 100)}%` }}
          />
        </div>
        {change !== undefined && (
          <div className={cn("kpi-delta", trendColor)}>
            {TrendIcon && <TrendIcon className="h-3 w-3" />}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
