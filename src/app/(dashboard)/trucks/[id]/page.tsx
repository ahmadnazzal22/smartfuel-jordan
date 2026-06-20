"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TruckStatusBadge } from "@/components/trucks/truck-status-badge";
import { Truck, MapPin, Gauge, Fuel } from "lucide-react";
import { PageSkeleton } from "@/components/ui/dashboard-skeleton";

export default function TruckDetailPage() {
  const { id } = useParams();
  const [truck, setTruck] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/trucks/${id}`).then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); }).then((d) => { setTruck(d.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <PageSkeleton cards={3} />;
  if (!truck) return <div className="text-center text-zinc-500 py-12">Truck not found</div>;

  const gps = truck.gpsLogs?.[0];
  const loadPct = (truck.currentLoad / truck.capacity) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{truck.plateNumber}</h1>
          <p className="text-sm text-zinc-500">{truck.driverName}</p>
        </div>
        <TruckStatusBadge status={truck.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="section-title flex items-center gap-1"><Fuel className="h-3 w-3" /> Load</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Progress value={loadPct} className="h-2" />
            <p className="text-xs text-zinc-500">{truck.currentLoad.toLocaleString()} / {truck.capacity.toLocaleString()} L</p>
            <Badge variant="outline" className="text-[11px]">{truck.fuelType}</Badge>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="section-title flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-200">{truck.region || "N/A"}</p>
            <p className="text-xs text-zinc-500">{gps ? `${gps.latitude.toFixed(4)}, ${gps.longitude.toFixed(4)}` : "No GPS data"}</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2"><CardTitle className="section-title flex items-center gap-1"><Gauge className="h-3 w-3" /> Status</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-200">{gps?.speed ? `${gps.speed} km/h` : "-"}</p>
            <p className="text-xs text-zinc-500">{gps?.heading ? `Heading: ${gps.heading}°` : "No data"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
