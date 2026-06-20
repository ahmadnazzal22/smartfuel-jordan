"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RiskBadge } from "@/components/stations/risk-badge";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";

export default function RiskPage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/stations").then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); }).then((d) => { setStations(d.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <PageSkeleton cards={3} />;

  const sorted = [...stations].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Risk Assessment</h1>
        <p className="text-sm text-zinc-500">Stations sorted by risk score</p>
      </div>
      <Card className="glass-card">
        <CardHeader className="pb-2"><CardTitle className="section-title">Station Risk Scores</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800/40">
                <TableHead className="text-[11px]">Station</TableHead>
                <TableHead className="text-[11px]">Region</TableHead>
                <TableHead className="text-[11px]">Status</TableHead>
                <TableHead className="text-[11px]">Risk Score</TableHead>
                <TableHead className="text-[11px]">Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((s) => (
                <TableRow key={s.id} className="border-zinc-800/40">
                  <TableCell className="font-medium text-sm">{s.name}</TableCell>
                  <TableCell className="text-xs">{s.region}</TableCell>
                  <TableCell><Badge variant={s.status === "active" ? "success" : "secondary"} className="text-[10px]">{s.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={s.riskScore} className="w-24 h-1.5" />
                      <span className="text-xs tabular-nums">{s.riskScore}</span>
                    </div>
                  </TableCell>
                  <TableCell><RiskBadge score={s.riskScore} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
