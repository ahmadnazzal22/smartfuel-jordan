import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const fuel = searchParams.get("fuel_type");
  const where: any = {};
  if (region) where.region = region;
  if (fuel) where.fuelType = fuel;

  const data = await prisma.prediction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { explanations: { include: { factors: true, actions: true } } },
  });
  return NextResponse.json({ data, meta: { total: data.length } });
}
