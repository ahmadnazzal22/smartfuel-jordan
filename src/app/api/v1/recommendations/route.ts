import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const type = searchParams.get("type");

  const [stations, predictions, inventories, trucks] = await Promise.all([
    prisma.station.findMany({ include: { sensors: true, fuelInventories: true } }),
    prisma.prediction.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.fuelInventory.findMany(),
    prisma.truck.findMany({ where: { status: "active" } }),
  ]);

  const recommendations: any[] = [];

  for (const station of stations) {
    if (region && station.region !== region) continue;

    for (const inv of station.fuelInventories) {
      const ratio = inv.maxCapacity > 0 ? (inv.currentLevel / inv.maxCapacity) * 100 : 0;
      if (ratio < 25) {
        recommendations.push({
          type: "restock",
          priority: ratio < 15 ? 1 : 2,
          stationId: station.id,
          stationName: station.name,
          region: station.region,
          fuelType: inv.fuelType,
          currentLevel: inv.currentLevel,
          maxCapacity: inv.maxCapacity,
          fillPercent: Math.round(ratio),
          message: `Low ${inv.fuelType.replace("_", " ")} — ${Math.round(ratio)}% remaining`,
          action: `Schedule urgent replenishment to ${station.name}`,
          expectedImpact: "Prevents shortage within 48 hours",
        });
      }
    }

    const offlineSensors = station.sensors.filter((s) => !s.isOnline);
    if (offlineSensors.length > 0) {
      recommendations.push({
        type: "maintenance",
        priority: 2,
        stationId: station.id,
        stationName: station.name,
        region: station.region,
        message: `${offlineSensors.length} sensor(s) offline at ${station.name}`,
        action: "Dispatch maintenance crew",
        expectedImpact: "Restores real-time monitoring",
      });
    }
  }

  for (const pred of predictions) {
    if (pred.outcome === "critical_shortage" || pred.outcome === "shortage") {
      const station = stations.find((s) => s.id === pred.stationId);
      recommendations.push({
        type: "prediction_alert",
        priority: pred.outcome === "critical_shortage" ? 1 : 2,
        stationId: pred.stationId,
        stationName: station?.name || pred.region,
        region: pred.region,
        fuelType: pred.fuelType,
        outcome: pred.outcome,
        confidence: pred.confidence,
        message: `${pred.outcome === "critical_shortage" ? "Critical" : "Potential"} ${pred.fuelType.replace("_", " ")} shortage in ${pred.region}`,
        action: "Redirect supply trucks and increase stock",
        expectedImpact: "Mitigates shortage risk",
      });
    }
  }

  const overloadedTrucks = trucks.filter((t) => t.capacity > 0 && (t.currentLoad / t.capacity) > 0.9);
  for (const truck of overloadedTrucks) {
    recommendations.push({
      type: "fleet",
      priority: 3,
      truckId: truck.id,
      plateNumber: truck.plateNumber,
      message: `Truck ${truck.plateNumber} at ${Math.round((truck.currentLoad / truck.capacity) * 100)}% capacity`,
      action: "Distribute load across fleet",
      expectedImpact: "Reduces wear and improves safety",
    });
  }

  const sorted = recommendations
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 20);

  if (type) {
    return NextResponse.json({ data: sorted.filter((r) => r.type === type), meta: { total: sorted.length } });
  }

  return NextResponse.json({
    data: sorted,
    meta: {
      total: sorted.length,
      critical: sorted.filter((r) => r.priority === 1).length,
      warnings: sorted.filter((r) => r.priority === 2).length,
      info: sorted.filter((r) => r.priority === 3).length,
    },
  });
}
