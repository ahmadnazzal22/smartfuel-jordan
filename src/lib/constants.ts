export const predictionOutcomeConfig: Record<string, { label: string; icon: string; text: string; border: string; bg: string }> = {
  critical_shortage: { label: "Critical Shortage", icon: "🔴", text: "text-red-500", border: "border-l-red-500", bg: "bg-red-500/5" },
  shortage: { label: "Shortage", icon: "🟠", text: "text-amber-500", border: "border-l-amber-500", bg: "bg-amber-500/5" },
  stable: { label: "Stable", icon: "🟢", text: "text-green-500", border: "border-l-green-500", bg: "bg-green-500/5" },
  surplus: { label: "Surplus", icon: "🔵", text: "text-blue-500", border: "border-l-blue-500", bg: "bg-blue-500/5" },
};

export const fuelTypes = [
  { value: "diesel", label: "Diesel" },
  { value: "octane_90", label: "Octane 90" },
  { value: "octane_95", label: "Octane 95" },
  { value: "kerosene", label: "Kerosene" },
];

export const regions = ["Amman", "Irbid", "Zarqa", "Balqa", "Aqaba", "Mafraq", "Karak", "Madaba", "Jerash"];
