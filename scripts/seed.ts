import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: "file:./prisma/dev.db" }) });

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.action.deleteMany();
  await prisma.factor.deleteMany();
  await prisma.xaiExplanation.deleteMany();
  await prisma.prediction.deleteMany();
  await prisma.sensorReading.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.fuelInventory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.gpsLog.deleteMany();
  await prisma.truck.deleteMany();
  await prisma.session.deleteMany();
  await prisma.kpiSnapshot.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.anomaly.deleteMany();
  await prisma.station.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.createMany({ data: [
    { id: "u1", email: "admin@smartfuel.jo", passwordHash, name: "Ahmad Al-Jordan", role: "admin", region: "Amman" },
    { id: "u2", email: "operator@smartfuel.jo", passwordHash, name: "Sara Al-Hussein", role: "operator", region: "Zarqa" },
  ]});
  console.log("  ✓ 2 users");

  await prisma.station.createMany({ data: [
    { id: "s1", name: "Al-Hussein Station", licenseNumber: "JOF-2021-0042", region: "Amman", city: "Amman", latitude: 31.9566, longitude: 35.9457, status: "active", riskScore: 87, contactPhone: "+962-6-555-1001", lastMaintenanceAt: new Date("2024-11-15T08:00:00Z") },
    { id: "s2", name: "King Abdullah II Station", licenseNumber: "JOF-2022-0081", region: "Amman", city: "Amman", latitude: 31.9639, longitude: 35.9302, status: "active", riskScore: 23, contactPhone: "+962-6-555-1002", lastMaintenanceAt: new Date("2024-12-01T10:00:00Z") },
    { id: "s3", name: "Irbid Central Station", licenseNumber: "JOF-2020-0033", region: "Irbid", city: "Irbid", latitude: 32.5556, longitude: 35.8497, status: "active", riskScore: 45, contactPhone: "+962-2-555-2001", lastMaintenanceAt: new Date("2024-10-20T09:00:00Z") },
    { id: "s4", name: "Zarqa Main Station", licenseNumber: "JOF-2021-0057", region: "Zarqa", city: "Zarqa", latitude: 32.0778, longitude: 36.0928, status: "active", riskScore: 62, contactPhone: "+962-5-555-3001", lastMaintenanceAt: new Date("2024-11-28T11:00:00Z") },
    { id: "s5", name: "Aqaba Port Station", licenseNumber: "JOF-2019-0012", region: "Aqaba", city: "Aqaba", latitude: 29.5319, longitude: 35.0069, status: "active", riskScore: 15, contactPhone: "+962-3-555-4001", lastMaintenanceAt: new Date("2024-12-10T07:00:00Z") },
    { id: "s6", name: "Balqa Station", licenseNumber: "JOF-2022-0095", region: "Balqa", city: "Salt", latitude: 32.0392, longitude: 35.7275, status: "maintenance", riskScore: 0, contactPhone: "+962-5-555-5001", lastMaintenanceAt: new Date("2024-12-15T06:00:00Z") },
    { id: "s7", name: "Mafraq Station", licenseNumber: "JOF-2023-0110", region: "Mafraq", city: "Mafraq", latitude: 32.3429, longitude: 36.2081, status: "active", riskScore: 78, contactPhone: "+962-2-555-6001", lastMaintenanceAt: new Date("2024-09-05T08:00:00Z") },
    { id: "s8", name: "Karak Station", licenseNumber: "JOF-2021-0068", region: "Karak", city: "Karak", latitude: 31.1853, longitude: 35.7048, status: "active", riskScore: 34, contactPhone: "+962-3-555-7001", lastMaintenanceAt: new Date("2024-10-30T09:00:00Z") },
  ]});
  console.log("  ✓ 8 stations");

  const fuelData = [
    { sid: "s1", d: 5400, o90: 12000, o95: 8900, cd: 30000, c90: 25000, c95: 25000 },
    { sid: "s2", d: 22000, o90: 18000, o95: 15000, cd: 30000, c90: 25000, c95: 25000 },
    { sid: "s3", d: 8500, o90: 14000, o95: 6000, cd: 20000, c90: 20000, c95: 15000 },
    { sid: "s4", d: 4200, o90: 6500, o95: 3000, cd: 15000, c90: 12000, c95: 10000 },
    { sid: "s5", d: 28000, o90: 22000, o95: 18000, cd: 35000, c90: 25000, c95: 20000 },
    { sid: "s6", d: 0, o90: 0, o95: 0, cd: 15000, c90: 12000, c95: 10000 },
    { sid: "s7", d: 1800, o90: 3200, o95: 1500, cd: 12000, c90: 10000, c95: 8000 },
    { sid: "s8", d: 11000, o90: 9500, o95: 7200, cd: 18000, c90: 14000, c95: 12000 },
  ];
  for (const f of fuelData) {
    await prisma.fuelInventory.createMany({ data: [
      { stationId: f.sid, fuelType: "diesel", currentLevel: f.d, minThreshold: f.cd * 0.2, maxCapacity: f.cd },
      { stationId: f.sid, fuelType: "octane_90", currentLevel: f.o90, minThreshold: f.c90 * 0.2, maxCapacity: f.c90 },
      { stationId: f.sid, fuelType: "octane_95", currentLevel: f.o95, minThreshold: f.c95 * 0.2, maxCapacity: f.c95 },
    ]});
  }
  console.log("  ✓ 24 fuel inventories");

  const predictions = [
    { id: "p1", stationId: "s1", region: "Amman", fuelType: "diesel", predictionDate: "2024-12-20", outcome: "critical_shortage", predictedLevel: 1800, confidence: 94, factors: [{ factor: "demand_spike", label: "High Demand", weight: 0.42, value: 87, trend: "up", threshold: 50 }, { factor: "delivery_delay", label: "Delivery Delay (14h)", weight: 0.31, value: 14, trend: "up", threshold: 6 }, { factor: "inventory_low", label: "Low Inventory (18%)", weight: 0.27, value: 18, trend: "down", threshold: 25 }], actions: [{ priority: 1, action: "dispatch_truck", label: "Dispatch T-102 → 12,000L Diesel", params: JSON.stringify({ truck_id: "T-102", fuel: "diesel", qty: 12000 }), expectedImpact: "Restores to 58% capacity" }, { priority: 2, action: "alert_authority", label: "Alert Ministry of Energy", params: JSON.stringify({ severity: "warning" }), expectedImpact: "Activates reserve protocol" }] },
    { id: "p2", stationId: "s4", region: "Zarqa", fuelType: "octane_95", predictionDate: "2024-12-21", outcome: "shortage", predictedLevel: 1200, confidence: 82, factors: [{ factor: "demand_spike", label: "High Demand", weight: 0.45, value: 78, trend: "up", threshold: 50 }, { factor: "inventory_low", label: "Low Inventory (30%)", weight: 0.35, value: 30, trend: "down", threshold: 25 }], actions: [{ priority: 1, action: "dispatch_truck", label: "Dispatch T-103 → 8,000L Octane 95", params: JSON.stringify({ truck_id: "T-103", fuel: "octane_95", qty: 8000 }), expectedImpact: "Restores to 60% capacity" }] },
  ];
  for (const p of predictions) {
    const pred = await prisma.prediction.create({ data: { id: p.id, stationId: p.stationId, region: p.region, fuelType: p.fuelType, predictionDate: p.predictionDate, outcome: p.outcome, predictedLevel: p.predictedLevel, confidence: p.confidence } });
    const xai = await prisma.xaiExplanation.create({ data: { predictionId: p.id } });
    await prisma.factor.createMany({ data: p.factors.map(f => ({ explanationId: xai.id, ...f } as any)) });
    await prisma.action.createMany({ data: p.actions.map(a => ({ explanationId: xai.id, ...a } as any)) });
  }
  console.log("  ✓ 2 predictions with XAI");

  await prisma.truck.createMany({ data: [
    { id: "t1", plateNumber: "J-102-2024", driverName: "Mohammad Ali", driverPhone: "+962-7-9000-1001", status: "in_transit", fuelType: "diesel", capacity: 25000, currentLoad: 12000, latitude: 31.8500, longitude: 35.9500, lastGpsUpdate: new Date(), region: "Amman" },
    { id: "t2", plateNumber: "J-103-2024", driverName: "Khaled Hassan", driverPhone: "+962-7-9000-1002", status: "loading", fuelType: "octane_95", capacity: 20000, currentLoad: 8000, latitude: 29.5319, longitude: 35.0069, lastGpsUpdate: new Date(), region: "Aqaba" },
    { id: "t3", plateNumber: "J-104-2024", driverName: "Yousef Ibrahim", driverPhone: "+962-7-9000-1003", status: "idle", fuelType: "diesel", capacity: 30000, currentLoad: 0, region: "Irbid" },
    { id: "t4", plateNumber: "J-105-2024", driverName: "Ali Mahmoud", driverPhone: "+962-7-9000-1004", status: "maintenance", fuelType: "octane_90", capacity: 18000, currentLoad: 0, region: "Zarqa" },
    { id: "t5", plateNumber: "J-106-2024", driverName: "Hussein Ahmad", driverPhone: "+962-7-9000-1005", status: "in_transit", fuelType: "diesel", capacity: 25000, currentLoad: 22000, latitude: 32.0500, longitude: 36.1000, lastGpsUpdate: new Date(), region: "Zarqa" },
  ]});
  console.log("  ✓ 5 trucks");

  const metrics = ["fuel_availability_index", "national_stability_score", "distribution_efficiency", "supply_chain_health"];
  const regions = ["Amman", "Zarqa", "Irbid", "Balqa", "Mafraq", "Karak", "Aqaba"];
  for (let day = 30; day >= 0; day--) {
    const d = new Date(Date.now() - day * 86400000).toISOString().slice(0, 10);
    await prisma.kpiSnapshot.createMany({ data: metrics.map(m => ({ date: d, metric: m, value: Math.random() * 100, region: regions[day % regions.length] })) });
  }
  console.log("  ✓ ~124 KPI snapshots");

  await prisma.notification.createMany({ data: [
    { id: "n1", userId: "u1", title: "Critical Shortage Detected", body: "Al-Hussein Station — Diesel at 18%. Dispatch required.", severity: "critical", category: "shortage", isRead: false, createdAt: new Date(Date.now() - 600000) },
    { id: "n2", userId: "u1", title: "Delivery En Route", body: "T-102 dispatched from Aqaba to Amman. ETA 3 hours.", severity: "info", category: "delivery", isRead: false, createdAt: new Date(Date.now() - 1800000) },
    { id: "n3", userId: "u1", title: "Station Offline", body: "Balqa Station entered maintenance mode.", severity: "warning", category: "maintenance", isRead: true, createdAt: new Date(Date.now() - 3600000) },
    { id: "n4", userId: "u1", title: "Weekly Report Ready", body: "National fuel report for week 50 is available.", severity: "info", category: "system", isRead: true, createdAt: new Date(Date.now() - 7200000) },
    { id: "n5", userId: "u1", title: "Fraud Alert", body: "Anomalous sensor reading detected at Zarqa Main Station.", severity: "warning", category: "system", isRead: true, createdAt: new Date(Date.now() - 14400000) },
  ]});
  console.log("  ✓ 5 notifications");

  await prisma.anomaly.createMany({ data: [
    { id: "a1", stationId: "s1", type: "fuel_theft", severity: "critical", description: "Diesel level dropped 23% overnight — possible theft at Al-Hussein Station", detectedValue: 4200, expectedValue: 5400, deviationPercent: -22.2, status: "open", region: "Amman", createdAt: new Date(Date.now() - 3600000) },
    { id: "a2", stationId: "s4", type: "sensor_malfunction", severity: "high", description: "Fuel flow sensor S-104 reporting erratic readings at Zarqa Main", detectedValue: 9999, expectedValue: 150, deviationPercent: 6566, status: "investigating", region: "Zarqa", createdAt: new Date(Date.now() - 7200000) },
    { id: "a3", stationId: "s7", type: "inventory_discrepancy", severity: "medium", description: "Manual count vs system mismatch: 1,200L unaccounted at Mafraq Station", detectedValue: 1800, expectedValue: 3000, deviationPercent: -40, status: "open", region: "Mafraq", createdAt: new Date(Date.now() - 14400000) },
    { id: "a4", truckId: "t1", type: "route_deviation", severity: "high", description: "Truck J-102-2024 deviated 14km from planned route near Salt", detectedValue: 14, expectedValue: 0, deviationPercent: 100, status: "open", region: "Balqa", createdAt: new Date(Date.now() - 1800000) },
    { id: "a5", stationId: "s1", type: "meter_tampering", severity: "critical", description: "Pump #3 meter shows tamper evidence — volume discrepancy +8.3%", detectedValue: 8.3, expectedValue: 0.5, deviationPercent: 1560, status: "open", region: "Amman", createdAt: new Date(Date.now() - 4800000) },
    { id: "a6", stationId: "s8", type: "sensor_malfunction", severity: "low", description: "Temperature sensor intermittent at Karak Station", detectedValue: 0, expectedValue: 1, deviationPercent: -100, status: "resolved", resolvedAt: new Date(Date.now() - 600000), region: "Karak", createdAt: new Date(Date.now() - 86400000) },
  ]});
  console.log("  ✓ 6 anomalies");

  await prisma.auditLog.createMany({ data: [
    { id: "al1", userId: "u1", action: "login", entity: "User", entityId: "u1", details: "Successful login from admin panel", ipAddress: "192.168.1.100", createdAt: new Date(Date.now() - 600000) },
    { id: "al2", userId: "u1", action: "update", entity: "Station", entityId: "s6", details: "Balqa Station status changed to maintenance", ipAddress: "192.168.1.100", createdAt: new Date(Date.now() - 3600000) },
    { id: "al3", userId: "u1", action: "create", entity: "Prediction", entityId: "p1", details: "Created critical shortage prediction for Al-Hussein Station", ipAddress: "192.168.1.100", createdAt: new Date(Date.now() - 7200000) },
    { id: "al4", userId: "u2", action: "login", entity: "User", entityId: "u2", details: "Successful login from Zarqa office", ipAddress: "10.0.0.50", createdAt: new Date(Date.now() - 14400000) },
    { id: "al5", userId: "u1", action: "view", entity: "Report", entityId: null, details: "Exported weekly national fuel report", ipAddress: "192.168.1.100", createdAt: new Date(Date.now() - 28800000) },
    { id: "al6", userId: "u1", action: "delete", entity: "Truck", entityId: null, details: "Removed decommissioned truck J-101-2023 from fleet", ipAddress: "192.168.1.100", createdAt: new Date(Date.now() - 43200000) },
    { id: "al7", userId: "u2", action: "update", entity: "Sensor", entityId: null, details: "Calibrated fuel flow sensor at Zarqa Main Station", ipAddress: "10.0.0.50", createdAt: new Date(Date.now() - 86400000) },
    { id: "al8", userId: "u1", action: "export", entity: "Data", entityId: null, details: "Exported station performance dataset for Q4 analysis", ipAddress: "192.168.1.100", createdAt: new Date(Date.now() - 172800000) },
    { id: "al9", userId: "u2", action: "login", entity: "User", entityId: "u2", details: "Failed login attempt — incorrect password", ipAddress: "10.0.0.50", createdAt: new Date(Date.now() - 259200000) },
    { id: "al10", userId: "u1", action: "create", entity: "User", entityId: null, details: "Created new operator account: operator@smartfuel.jo", ipAddress: "192.168.1.100", createdAt: new Date(Date.now() - 345600000) },
  ]});
  console.log("  ✓ 10 audit logs");

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
