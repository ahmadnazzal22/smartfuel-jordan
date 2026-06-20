import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
    return NextResponse.json({ data });
  } catch {
    const { notifications } = await import("@/lib/mock-data");
    return NextResponse.json(notifications);
  }
}

export async function PATCH(req: Request) {
  const { id } = await req.json();
  await prisma.notification.update({ where: { id }, data: { isRead: true } });
  return NextResponse.json({ success: true });
}
