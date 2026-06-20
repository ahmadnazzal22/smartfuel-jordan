"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiChart } from "@/components/dashboard/kpi-chart";
import { RegionTable } from "@/components/dashboard/region-table";
import { BarChart3, MapIcon } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Analytics</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Deep-dive KPI analytics and regional comparisons</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="section-title">KPI Trends</CardTitle>
            <BarChart3 className="h-3.5 w-3.5 text-amber-400/60" />
          </CardHeader>
          <CardContent><KpiChart /></CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="section-title">Regional Comparison</CardTitle>
            <MapIcon className="h-3.5 w-3.5 text-amber-400/60" />
          </CardHeader>
          <CardContent><RegionTable /></CardContent>
        </Card>
      </div>
    </div>
  );
}
