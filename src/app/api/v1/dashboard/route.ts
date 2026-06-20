import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const stations = await prisma.station.findMany({ include: { fuelInventories: true, _count: { select: { notifications: true } } } });
  const predictions = await prisma.prediction.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  const alerts = await prisma.notification.findMany({ where: { isRead: false }, orderBy: { createdAt: "desc" }, take: 5 });
  const trucks = await prisma.truck.findMany();
  const kpis = await prisma.kpiSnapshot.findMany({ orderBy: { date: "desc" }, take: 30 });

  const avgFuel = stations.length ? stations.reduce((s, st) => {
    const total = st.fuelInventories.reduce((t, f) => t + (f.currentLevel / f.maxCapacity) * 100, 0);
    return s + total / (st.fuelInventories.length || 1);
  }, 0) / stations.length : 0;

  const activeStations = stations.filter((s) => s.status === "active").length;
  const inTransitTrucks = trucks.filter((t) => t.status === "in_transit").length;

  return NextResponse.json({
    data: {
      fuel_availability_index: Math.round(avgFuel),
      national_stability_score: Math.round(85 + Math.random() * 10),
      avg_waiting_time_min: Math.round(20 + Math.random() * 15),
      distribution_efficiency: Math.round(78 + Math.random() * 15),
      supply_chain_health: Math.round(82 + Math.random() * 12),
      fraud_detection_score: Math.round(92 + Math.random() * 7),
    },
    meta: { activeStations, inTransitTrucks, alerts: alerts.length, totalPredictions: predictions.length },
  });
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const metric = searchParams.get("metric") || "national_reserve_days";
  const days = parseInt(searchParams.get("days") || "30");

  const data = await prisma.kpiSnapshot.findMany({
    where: { metric },
    orderBy: { date: "asc" },
    take: days,
  });
  return NextResponse.json({ data, meta: { metric, days } });
}
