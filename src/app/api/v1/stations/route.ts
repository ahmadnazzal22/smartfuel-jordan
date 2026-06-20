import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  const where: any = {};
  if (region) where.region = region;

  const data = await prisma.station.findMany({
    where,
    include: { fuelInventories: true, predictions: { take: 3, orderBy: { createdAt: "desc" } } },
  });
  return NextResponse.json({ data, meta: { total: data.length } });
}
