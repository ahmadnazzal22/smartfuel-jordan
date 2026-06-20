export const dashboardData = {
  data: {
    totalStations: 8,
    activeStations: 7,
    totalTrucks: 5,
    activeTrucks: 3,
    totalTrips: 47,
    alerts: 2,
    avgFuelLevel: 74,
    totalFuel: 184500,
    stabilityScore: 82,
    fuelAvailability: 78,
    distributionEfficiency: 85,
    supplyChainHealth: 74,
  },
};

export const kpiHistory = {
  data: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 29 + i);
    return {
      date: date.toISOString().split("T")[0],
      fuel_stored: Math.round(150000 + Math.random() * 50000),
      fuel_distributed: Math.round(120000 + Math.random() * 40000),
      active_stations: 6 + Math.floor(Math.random() * 3),
      active_trucks: 2 + Math.floor(Math.random() * 3),
      completed_trips: Math.round(30 + Math.random() * 20),
      alerts_triggered: Math.floor(Math.random() * 5),
    };
  }),
  meta: { total: 30 },
};

export const regions = {
  data: [
    { name: "Amman", stations: 3, active: 3, at_risk: 1, avg_fuel: 72, trend: "stable" },
    { name: "Irbid", stations: 1, active: 1, at_risk: 0, avg_fuel: 81, trend: "up" },
    { name: "Zarqa", stations: 1, active: 1, at_risk: 0, avg_fuel: 76, trend: "stable" },
    { name: "Balqa", stations: 1, active: 1, at_risk: 2, avg_fuel: 52, trend: "down" },
    { name: "Mafraq", stations: 1, active: 1, at_risk: 1, avg_fuel: 43, trend: "down" },
    { name: "Karak", stations: 1, active: 1, at_risk: 0, avg_fuel: 78, trend: "up" },
    { name: "Aqaba", stations: 1, active: 1, at_risk: 0, avg_fuel: 89, trend: "up" },
  ],
};

export const stations = {
  data: [
    { id: "1", name: "Al-Hussein Station", region: "Amman", status: "active", lat: 31.9454, lng: 35.9284, fuelInventories: [{ fuelType: "diesel", currentLevel: 15000, maxCapacity: 20000 }, { fuelType: "octane95", currentLevel: 8000, maxCapacity: 12000 }] },
    { id: "2", name: "King Abdullah II Station", region: "Amman", status: "active", lat: 31.9632, lng: 35.9302, fuelInventories: [{ fuelType: "diesel", currentLevel: 12000, maxCapacity: 18000 }, { fuelType: "octane90", currentLevel: 9000, maxCapacity: 10000 }] },
    { id: "3", name: "Irbid Central", region: "Irbid", status: "active", lat: 32.5454, lng: 35.8572, fuelInventories: [{ fuelType: "diesel", currentLevel: 18000, maxCapacity: 22000 }, { fuelType: "octane95", currentLevel: 10000, maxCapacity: 12000 }] },
    { id: "4", name: "Zarqa Main", region: "Zarqa", status: "active", lat: 32.0841, lng: 36.1007, fuelInventories: [{ fuelType: "diesel", currentLevel: 8000, maxCapacity: 15000 }] },
    { id: "5", name: "Balqa Station", region: "Balqa", status: "active", lat: 32.0333, lng: 35.7333, fuelInventories: [{ fuelType: "diesel", currentLevel: 5000, maxCapacity: 10000 }, { fuelType: "octane90", currentLevel: 3000, maxCapacity: 8000 }] },
    { id: "6", name: "Mafraq Station", region: "Mafraq", status: "inactive", lat: 32.3500, lng: 36.2000, fuelInventories: [{ fuelType: "diesel", currentLevel: 1000, maxCapacity: 8000 }] },
    { id: "7", name: "Karak Station", region: "Karak", status: "active", lat: 31.1667, lng: 35.7000, fuelInventories: [{ fuelType: "diesel", currentLevel: 14000, maxCapacity: 18000 }, { fuelType: "octane95", currentLevel: 7000, maxCapacity: 10000 }] },
    { id: "8", name: "Aqaba Port Station", region: "Aqaba", status: "active", lat: 29.5167, lng: 35.0000, fuelInventories: [{ fuelType: "diesel", currentLevel: 25000, maxCapacity: 30000 }, { fuelType: "octane90", currentLevel: 12000, maxCapacity: 15000 }] },
  ],
};

export const predictions = {
  data: [
    { id: "1", stationId: "6", stationName: "Mafraq Station", region: "Mafraq", fuelType: "diesel", predictedShortageDays: 7, confidence: 89, risk: "high", status: "active", createdAt: new Date().toISOString(), factors: [{ name: "low_inventory", impact: 0.7 }], recommendedActions: ["Restock within 3 days"] },
    { id: "2", stationId: "5", stationName: "Balqa Station", region: "Balqa", fuelType: "octane90", predictedShortageDays: 14, confidence: 76, risk: "medium", status: "active", createdAt: new Date().toISOString(), factors: [{ name: "consumption_rate", impact: 0.5 }], recommendedActions: ["Monitor consumption"] },
    { id: "3", stationId: "1", stationName: "Al-Hussein Station", region: "Amman", fuelType: "diesel", predictedShortageDays: 21, confidence: 72, risk: "medium", status: "active", createdAt: new Date().toISOString(), factors: [{ name: "seasonal_demand", impact: 0.4 }], recommendedActions: ["Schedule resupply"] },
  ],
  meta: { total: 3 },
};

export const trucks = {
  data: [
    { id: "1", plate: "12-3456", driver: "Ahmed Hassan", status: "active", lat: 31.95, lng: 35.93, fuelCapacity: 32000, loadPercent: 85, currentLoad: 27200, region: "Amman" },
    { id: "2", plate: "78-9012", driver: "Mohammed Ali", status: "active", lat: 32.55, lng: 35.86, fuelCapacity: 32000, loadPercent: 62, currentLoad: 19840, region: "Irbid" },
    { id: "3", plate: "34-5678", driver: "Khaled Omar", status: "active", lat: 32.08, lng: 36.10, fuelCapacity: 28000, loadPercent: 45, currentLoad: 12600, region: "Zarqa" },
    { id: "4", plate: "90-1234", driver: "Sami Yousef", status: "idle", lat: 31.95, lng: 35.93, fuelCapacity: 32000, loadPercent: 0, currentLoad: 0, region: "Amman" },
    { id: "5", plate: "56-7890", driver: "Nasser Khalil", status: "maintenance", lat: 31.95, lng: 35.93, fuelCapacity: 28000, loadPercent: 0, currentLoad: 0, region: "Amman" },
  ],
};

export const notifications = {
  data: [
    { id: "1", title: "Low Fuel Alert - Mafraq", message: "Mafraq Station diesel below 20%", type: "critical", severity: "critical", read: false, createdAt: new Date().toISOString(), stationId: "6", stationName: "Mafraq Station" },
    { id: "2", title: "Theft Detection - Balqa", message: "Inventory discrepancy detected at Balqa Station", type: "warning", severity: "high", read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), stationId: "5", stationName: "Balqa Station" },
    { id: "3", title: "Route Deviation - Truck 34-5678", message: "Truck deviated from planned route", type: "warning", severity: "medium", read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: "4", title: "Maintenance Due - Truck 56-7890", message: "Scheduled maintenance in 3 days", type: "info", severity: "low", read: false, createdAt: new Date(Date.now() - 14400000).toISOString() },
  ],
};

export const recommendations = {
  data: [
    { id: "rec-1", priority: "P1", type: "restock", title: "Urgent Restock: Mafraq Station", description: "Diesel inventory critically low (12%). Immediate restock required.", stationId: "6", stationName: "Mafraq Station", confidence: 94, expectedImpact: "Critical", fuelType: "diesel" },
    { id: "rec-2", priority: "P2", type: "maintenance", title: "Route Optimization: Zarqa Region", description: "Current supply routes inefficient. Optimize to reduce fuel waste.", confidence: 82, expectedImpact: "Medium", fuelType: "all" },
    { id: "rec-3", priority: "P1", type: "prediction", title: "Shortage Risk: Balqa Octane90", description: "Predicted shortage within 14 days at Balqa Station.", stationId: "5", stationName: "Balqa Station", confidence: 76, expectedImpact: "High", fuelType: "octane90" },
    { id: "rec-4", priority: "P3", type: "fleet", title: "Fleet Redistribution", description: "3 trucks idle in Amman. Consider redeploying to northern regions.", confidence: 68, expectedImpact: "Low", fuelType: "all" },
  ],
};

export const auditLogs = {
  data: [
    { id: "1", action: "login", entity: "user", entityId: "1", userId: "1", userName: "System Admin", userEmail: "admin@smartfuel.jo", ip: "192.168.1.1", timestamp: new Date(Date.now() - 600000).toISOString(), details: "Admin logged in" },
    { id: "2", action: "update", entity: "station", entityId: "6", userId: "1", userName: "System Admin", userEmail: "admin@smartfuel.jo", ip: "192.168.1.1", timestamp: new Date(Date.now() - 1800000).toISOString(), details: "Mafraq Station status updated" },
    { id: "3", action: "alert", entity: "prediction", entityId: "1", userId: "1", userName: "System Admin", userEmail: "admin@smartfuel.jo", ip: "192.168.1.1", timestamp: new Date(Date.now() - 3600000).toISOString(), details: "Shortage alert triggered for Mafraq" },
    { id: "4", action: "create", entity: "trip", entityId: "trip-47", userId: "2", userName: "Operator", userEmail: "operator@smartfuel.jo", ip: "10.0.0.5", timestamp: new Date(Date.now() - 7200000).toISOString(), details: "New trip created: Amman to Irbid" },
    { id: "5", action: "update", entity: "inventory", entityId: "inv-3", userId: "2", userName: "Operator", userEmail: "operator@smartfuel.jo", ip: "10.0.0.5", timestamp: new Date(Date.now() - 14400000).toISOString(), details: "Irbid Central inventory adjusted" },
  ],
};

export const anomalies = {
  data: [
    { id: "anom-1", type: "fuel_theft", severity: "critical", status: "open", stationId: "5", stationName: "Balqa Station", description: "Inventory discrepancy: 340L unaccounted", deviationPercent: 12, detectedAt: new Date(Date.now() - 7200000).toISOString(), region: "Balqa" },
    { id: "anom-2", type: "sensor_malfunction", severity: "high", status: "investigating", stationId: "6", stationName: "Mafraq Station", description: "Sensor #3 reporting erratic readings", deviationPercent: 45, detectedAt: new Date(Date.now() - 14400000).toISOString(), region: "Mafraq" },
    { id: "anom-3", type: "inventory_discrepancy", severity: "medium", status: "open", stationId: "2", stationName: "King Abdullah II Station", description: "Stock count mismatch in diesel inventory", deviationPercent: 5, detectedAt: new Date(Date.now() - 28800000).toISOString(), region: "Amman" },
    { id: "anom-4", type: "route_deviation", severity: "high", status: "investigating", truckId: "3", truckPlate: "34-5678", description: "Truck deviated 15km from planned route", deviationPercent: 30, detectedAt: new Date(Date.now() - 43200000).toISOString(), region: "Zarqa" },
    { id: "anom-5", type: "meter_tampering", severity: "critical", status: "resolved", stationId: "3", stationName: "Irbid Central", description: "Pump meter tampering detected and resolved", deviationPercent: 8, detectedAt: new Date(Date.now() - 86400000).toISOString(), region: "Irbid" },
  ],
};
