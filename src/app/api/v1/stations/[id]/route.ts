import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await prisma.station.findUnique({
    where: { id: params.id },
    include: {
      fuelInventories: true,
      predictions: { take: 5, orderBy: { createdAt: "desc" }, include: { explanations: { include: { factors: true, actions: true } } } },
      sensors: true,
    },
  });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data });
}
