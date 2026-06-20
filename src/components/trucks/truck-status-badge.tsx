"use client";
import { Badge } from "@/components/ui/badge";
import type { TruckStatus } from "@/types/truck";

const config: Record<TruckStatus, { label: string; variant: "info" | "success" | "warning" | "secondary" | "danger" }> = {
  idle: { label: "Idle", variant: "secondary" },
  loading: { label: "Loading", variant: "warning" },
  en_route: { label: "En Route", variant: "info" },
  delivering: { label: "Delivering", variant: "success" },
  returning: { label: "Returning", variant: "danger" },
};

export function TruckStatusBadge({ status }: { status: TruckStatus }) {
  const c = config[status] || { label: status, variant: "secondary" };
  return <Badge variant={c.variant as any}>{c.label}</Badge>;
}
