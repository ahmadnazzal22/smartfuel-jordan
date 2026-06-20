import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({ data });
}

export async function PATCH(req: Request) {
  const { id } = await req.json();
  await prisma.notification.update({ where: { id }, data: { isRead: true } });
  return NextResponse.json({ success: true });
}
