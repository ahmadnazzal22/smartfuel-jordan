"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiChart } from "@/components/dashboard/kpi-chart";
import { BarChart3 } from "lucide-react";

export default function TrendsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Trends</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Historical KPI trends and predictive analytics</p>
      </div>
      <Card className="glass-card">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="section-title">30-Day KPI History</CardTitle>
          <BarChart3 className="h-3.5 w-3.5 text-emerald-400/60" />
        </CardHeader>
        <CardContent>
          <KpiChart />
        </CardContent>
      </Card>
    </div>
  );
}
