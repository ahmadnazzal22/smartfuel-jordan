"use client";
import { useCountUp } from "@/hooks/use-count-up";

export function AnimatedCount({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const count = useCountUp(value);
  return <>{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}
