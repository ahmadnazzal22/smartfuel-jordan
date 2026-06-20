import type { Factor, Action, PredictionExplanation } from "@/types/prediction";

export const mockKpi = {
  fuel_availability_index: 92.4,
  national_stability_score: 87.1,
  avg_waiting_time_min: 4,
  distribution_efficiency: 78.6,
  supply_chain_health: 81.2,
  fraud_detection_score: 96.3,
  total_active_stations: 284,
  total_stations: 312,
  stations_at_risk: 12,
  total_trucks_en_route: 18,
};

export const mockKpiHistory = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10),
  fuel_availability_index: 85 + Math.random() * 15,
  national_stability_score: 78 + Math.random() * 18,
  distribution_efficiency: 70 + Math.random() * 25,
  supply_chain_health: 75 + Math.random() * 20,
}));

export const mockStations = [
  { id: "s1", name: "Al-Hussein Station", region: "Amman", city: "Amman", status: "active", latitude: 31.9566, longitude: 35.9457, risk_score: 87, license_number: "JOF-2021-0042", contact_phone: "+962-6-555-1001", last_maintenance_at: "2024-11-15T08:00:00Z", fuel: { diesel: 5400, octane_90: 12000, octane_95: 8900 }, capacity: { diesel: 30000, octane_90: 25000, octane_95: 25000 } },
  { id: "s2", name: "King Abdullah II Station", region: "Amman", city: "Amman", status: "active", latitude: 31.9639, longitude: 35.9302, risk_score: 23, license_number: "JOF-2022-0081", contact_phone: "+962-6-555-1002", last_maintenance_at: "2024-12-01T10:00:00Z", fuel: { diesel: 22000, octane_90: 18000, octane_95: 15000 }, capacity: { diesel: 30000, octane_90: 25000, octane_95: 25000 } },
  { id: "s3", name: "Irbid Central Station", region: "Irbid", city: "Irbid", status: "active", latitude: 32.5556, longitude: 35.8497, risk_score: 45, license_number: "JOF-2020-0033", contact_phone: "+962-2-555-2001", last_maintenance_at: "2024-10-20T09:00:00Z", fuel: { diesel: 8500, octane_90: 14000, octane_95: 6000 }, capacity: { diesel: 20000, octane_90: 20000, octane_95: 15000 } },
  { id: "s4", name: "Zarqa Main Station", region: "Zarqa", city: "Zarqa", status: "active", latitude: 32.0778, longitude: 36.0928, risk_score: 62, license_number: "JOF-2021-0057", contact_phone: "+962-5-555-3001", last_maintenance_at: "2024-11-28T11:00:00Z", fuel: { diesel: 4200, octane_90: 6500, octane_95: 3000 }, capacity: { diesel: 15000, octane_90: 12000, octane_95: 10000 } },
  { id: "s5", name: "Aqaba Port Station", region: "Aqaba", city: "Aqaba", status: "active", latitude: 29.5319, longitude: 35.0069, risk_score: 15, license_number: "JOF-2019-0012", contact_phone: "+962-3-555-4001", last_maintenance_at: "2024-12-10T07:00:00Z", fuel: { diesel: 28000, octane_90: 22000, octane_95: 18000 }, capacity: { diesel: 35000, octane_90: 25000, octane_95: 20000 } },
  { id: "s6", name: "Balqa Station", region: "Balqa", city: "Salt", status: "maintenance", latitude: 32.0392, longitude: 35.7275, risk_score: 0, license_number: "JOF-2022-0095", contact_phone: "+962-5-555-5001", last_maintenance_at: "2024-12-15T06:00:00Z", fuel: { diesel: 0, octane_90: 0, octane_95: 0 }, capacity: { diesel: 15000, octane_90: 12000, octane_95: 10000 } },
  { id: "s7", name: "Mafraq Station", region: "Mafraq", city: "Mafraq", status: "active", latitude: 32.3429, longitude: 36.2081, risk_score: 78, license_number: "JOF-2023-0110", contact_phone: "+962-2-555-6001", last_maintenance_at: "2024-09-05T08:00:00Z", fuel: { diesel: 1800, octane_90: 3200, octane_95: 1500 }, capacity: { diesel: 12000, octane_90: 10000, octane_95: 8000 } },
  { id: "s8", name: "Karak Station", region: "Karak", city: "Karak", status: "active", latitude: 31.1853, longitude: 35.7048, risk_score: 34, license_number: "JOF-2021-0068", contact_phone: "+962-3-555-7001", last_maintenance_at: "2024-10-30T09:00:00Z", fuel: { diesel: 11000, octane_90: 9500, octane_95: 7200 }, capacity: { diesel: 18000, octane_90: 14000, octane_95: 12000 } },
];

export const mockPredictions: Array<{
  id: string; station_id: string; region: string; fuel_type: string; prediction_date: string;
  outcome: "critical_shortage" | "shortage" | "stable" | "surplus"; predicted_level: number; confidence: number;
}> = [
  { id: "p1", station_id: "s1", region: "Amman", fuel_type: "diesel", prediction_date: "2024-12-20", outcome: "critical_shortage", predicted_level: 1800, confidence: 94 },
  { id: "p2", station_id: "s4", region: "Zarqa", fuel_type: "octane_95", prediction_date: "2024-12-21", outcome: "shortage", predicted_level: 1200, confidence: 82 },
  { id: "p3", station_id: "s7", region: "Mafraq", fuel_type: "diesel", prediction_date: "2024-12-19", outcome: "shortage", predicted_level: 800, confidence: 76 },
  { id: "p4", station_id: "", region: "Amman", fuel_type: "diesel", prediction_date: "2024-12-22", outcome: "stable", predicted_level: 15000, confidence: 68 },
  { id: "p5", station_id: "s3", region: "Irbid", fuel_type: "octane_90", prediction_date: "2024-12-20", outcome: "surplus", predicted_level: 18000, confidence: 71 },
];

export const mockExplanation = {
  predictionId: "p1",
  stationId: "s1",
  region: "Amman",
  fuelType: "diesel",
  predictionDate: "2024-12-20",
  outcome: "critical_shortage" as const,
  confidence: 94,
  timestamp: new Date().toISOString(),
  contributingFactors: [
    { factor: "demand_spike", label: "High Demand", weight: 0.42, value: 87, trend: "up" as const, threshold: 50 },
    { factor: "delivery_delay", label: "Delivery Delay (14h)", weight: 0.31, value: 14, trend: "up" as const, threshold: 6 },
    { factor: "inventory_low", label: "Low Inventory (18%)", weight: 0.27, value: 18, trend: "down" as const, threshold: 25 },
  ] satisfies Factor[],
  recommendedActions: [
    { priority: 1 as const, action: "dispatch_truck", label: "Dispatch T-102 → 12,000L Diesel", params: { truck_id: "T-102", fuel: "diesel", qty: 12000 }, expectedImpact: "Restores to 58% capacity" },
    { priority: 2 as const, action: "alert_authority", label: "Alert Ministry of Energy", params: { severity: "warning" }, expectedImpact: "Activates reserve protocol" },
  ] satisfies Action[],
} satisfies PredictionExplanation;

export const mockTrucks = [
  { id: "t1", plate: "T-101", driver: "Ahmed Hassan", fuel_type: "diesel", capacity: 15000, current_load: 12000, status: "en_route", region: "Amman", latitude: 31.9700, longitude: 35.9400, speed: 62, heading: 180 },
  { id: "t2", plate: "T-102", driver: "Mohammad Ali", fuel_type: "diesel", capacity: 15000, current_load: 15000, status: "loading", region: "Aqaba", latitude: 29.5300, longitude: 35.0100, speed: 0, heading: 0 },
  { id: "t3", plate: "T-103", driver: "Khalid Ibrahim", fuel_type: "octane_90", capacity: 12000, current_load: 8000, status: "en_route", region: "Irbid", latitude: 32.5000, longitude: 35.8000, speed: 78, heading: 45 },
  { id: "t4", plate: "T-104", driver: "Yousef Omar", fuel_type: "diesel", capacity: 15000, current_load: 0, status: "returning", region: "Amman", latitude: 32.0000, longitude: 35.9000, speed: 55, heading: 200 },
  { id: "t5", plate: "T-105", driver: "Sami Nasser", fuel_type: "octane_95", capacity: 10000, current_load: 10000, status: "idle", region: "Zarqa", latitude: 32.0700, longitude: 36.0800, speed: 0, heading: 0 },
];

export const mockNotifications: Array<{
  id: string; title: string; body: string; severity: "info" | "warning" | "critical" | "emergency";
  category: "shortage" | "delivery" | "maintenance" | "system"; created_at: string; is_read: boolean;
}> = [
  { id: "n1", title: "Critical Shortage Detected", body: "Al-Hussein Station — Diesel at 18%. Dispatch required.", severity: "critical", category: "shortage", created_at: new Date(Date.now() - 600000).toISOString(), is_read: false },
  { id: "n2", title: "Delivery En Route", body: "T-102 dispatched from Aqaba to Amman. ETA 3 hours.", severity: "info", category: "delivery", created_at: new Date(Date.now() - 1800000).toISOString(), is_read: false },
  { id: "n3", title: "Station Offline", body: "Balqa Station entered maintenance mode.", severity: "warning", category: "maintenance", created_at: new Date(Date.now() - 3600000).toISOString(), is_read: true },
  { id: "n4", title: "Weekly Report Ready", body: "National fuel report for week 50 is available.", severity: "info", category: "system", created_at: new Date(Date.now() - 7200000).toISOString(), is_read: true },
  { id: "n5", title: "Fraud Alert", body: "Anomalous sensor reading detected at Zarqa Main Station.", severity: "warning", category: "system", created_at: new Date(Date.now() - 14400000).toISOString(), is_read: true },
];

export const mockRegions = [
  { name: "Amman", stations: 98, active: 92, at_risk: 5, avg_fuel: 62, trend: "stable" },
  { name: "Irbid", stations: 52, active: 48, at_risk: 3, avg_fuel: 48, trend: "down" },
  { name: "Zarqa", stations: 45, active: 40, at_risk: 2, avg_fuel: 55, trend: "up" },
  { name: "Balqa", stations: 28, active: 24, at_risk: 1, avg_fuel: 71, trend: "stable" },
  { name: "Aqaba", stations: 22, active: 22, at_risk: 0, avg_fuel: 88, trend: "stable" },
  { name: "Mafraq", stations: 18, active: 15, at_risk: 1, avg_fuel: 38, trend: "down" },
  { name: "Karak", stations: 25, active: 23, at_risk: 0, avg_fuel: 65, trend: "up" },
  { name: "Madaba", stations: 14, active: 12, at_risk: 0, avg_fuel: 52, trend: "stable" },
  { name: "Jerash", stations: 10, active: 8, at_risk: 0, avg_fuel: 45, trend: "down" },
];
