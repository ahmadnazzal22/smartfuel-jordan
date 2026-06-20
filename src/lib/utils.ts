import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function formatRelative(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function severityColor(severity: string): string {
  switch (severity) {
    case "critical": return "text-red-500 bg-red-500/10";
    case "warning": return "text-amber-500 bg-amber-500/10";
    case "info": return "text-blue-500 bg-blue-500/10";
    default: return "text-muted-foreground bg-muted";
  }
}

export function riskColor(score: number): string {
  if (score >= 70) return "text-red-500";
  if (score >= 40) return "text-amber-500";
  return "text-green-500";
}

export function riskBg(score: number): string {
  if (score >= 70) return "bg-red-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-green-500";
}

export function fuelTypeLabel(type: string): string {
  const map: Record<string, string> = {
    octane_90: "Octane 90",
    octane_95: "Octane 95",
    diesel: "Diesel",
    kerosene: "Kerosene",
  };
  return map[type] || type;
}
