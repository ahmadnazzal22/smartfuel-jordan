"use client";
import { cn } from "@/lib/utils";

interface FuelGaugeProps {
  label: string;
  current: number;
  max: number;
}

export function FuelGauge({ label, current, max }: FuelGaugeProps) {
  const pct = Math.round((current / max) * 100);
  const color = pct < 20 ? "from-rose-500 to-rose-400" : pct < 40 ? "from-amber-500 to-amber-400" : "from-emerald-500 to-emerald-400";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold capitalize">{label.replace("_", " ")}</span>
        <span className="text-[11px] text-zinc-500 tabular-nums">{current.toLocaleString()} / {max.toLocaleString()} L</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800/40 overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className={cn("text-[10px] font-medium", pct < 20 ? "text-rose-400" : pct < 40 ? "text-amber-400" : "text-emerald-400")}>{pct}%</span>
        <span className="text-[10px] text-zinc-500">{pct < 20 ? "⚠ Critical" : pct < 40 ? "⚠ Low" : "✓ Healthy"}</span>
      </div>
    </div>
  );
}
