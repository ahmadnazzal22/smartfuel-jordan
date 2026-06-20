export interface KpiSnapshot {
  id: string;
  snapshot_time: string;
  fuel_availability_index: number;
  national_stability_score: number;
  avg_waiting_time_min: number;
  distribution_efficiency: number;
  supply_chain_health: number;
  fraud_detection_score: number;
  total_active_stations: number;
  stations_at_risk: number;
  total_trucks_en_route: number;
}

export interface KpiHistoryPoint {
  date: string;
  fuel_availability_index?: number;
  national_stability_score?: number;
  distribution_efficiency?: number;
  supply_chain_health?: number;
}

export interface RegionBreakdown {
  name: string;
  stations: number;
  active: number;
  at_risk: number;
  avg_fuel: number;
  trend: "up" | "down" | "stable";
}
