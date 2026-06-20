import { PrismaClient } from "../src/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
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
  await prisma.kpiSnapshot.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.station.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const passwordHash = await bcrypt.hash("admin123", 10);
  const users = await Promise.all([
    prisma.user.create({ data: { id: "u1", email: "admin@smartfuel.jo", passwordHash, name: "Ahmad Al-Jordan", role: "admin", region: "Amman" } }),
    prisma.user.create({ data: { id: "u2", email: "operator@smartfuel.jo", passwordHash, name: "Sara Al-Hussein", role: "operator", region: "Zarqa" } }),
  ]);
  console.log(`  ✓ ${users.length} users`);

  // Stations
  const stations = await Promise.all([
    prisma.station.create({ data: { id: "s1", name: "Al-Hussein Station", licenseNumber: "JOF-2021-0042", region: "Amman", city: "Amman", latitude: 31.9566, longitude: 35.9457, status: "active", riskScore: 87, contactPhone: "+962-6-555-1001", lastMaintenanceAt: new Date("2024-11-15T08:00:00Z") } }),
    prisma.station.create({ data: { id: "s2", name: "King Abdullah II Station", licenseNumber: "JOF-2022-0081", region: "Amman", city: "Amman", latitude: 31.9639, longitude: 35.9302, status: "active", riskScore: 23, contactPhone: "+962-6-555-1002", lastMaintenanceAt: new Date("2024-12-01T10:00:00Z") } }),
    prisma.station.create({ data: { id: "s3", name: "Irbid Central Station", licenseNumber: "JOF-2020-0033", region: "Irbid", city: "Irbid", latitude: 32.5556, longitude: 35.8497, status: "active", riskScore: 45, contactPhone: "+962-2-555-2001", lastMaintenanceAt: new Date("2024-10-20T09:00:00Z") } }),
    prisma.station.create({ data: { id: "s4", name: "Zarqa Main Station", licenseNumber: "JOF-2021-0057", region: "Zarqa", city: "Zarqa", latitude: 32.0778, longitude: 36.0928, status: "active", riskScore: 62, contactPhone: "+962-5-555-3001", lastMaintenanceAt: new Date("2024-11-28T11:00:00Z") } }),
    prisma.station.create({ data: { id: "s5", name: "Aqaba Port Station", licenseNumber: "JOF-2019-0012", region: "Aqaba", city: "Aqaba", latitude: 29.5319, longitude: 35.0069, status: "active", riskScore: 15, contactPhone: "+962-3-555-4001", lastMaintenanceAt: new Date("2024-12-10T07:00:00Z") } }),
    prisma.station.create({ data: { id: "s6", name: "Balqa Station", licenseNumber: "JOF-2022-0095", region: "Balqa", city: "Salt", latitude: 32.0392, longitude: 35.7275, status: "maintenance", riskScore: 0, contactPhone: "+962-5-555-5001", lastMaintenanceAt: new Date("2024-12-15T06:00:00Z") } }),
    prisma.station.create({ data: { id: "s7", name: "Mafraq Station", licenseNumber: "JOF-2023-0110", region: "Mafraq", city: "Mafraq", latitude: 32.3429, longitude: 36.2081, status: "active", riskScore: 78, contactPhone: "+962-2-555-6001", lastMaintenanceAt: new Date("2024-09-05T08:00:00Z") } }),
    prisma.station.create({ data: { id: "s8", name: "Karak Station", licenseNumber: "JOF-2021-0068", region: "Karak", city: "Karak", latitude: 31.1853, longitude: 35.7048, status: "active", riskScore: 34, contactPhone: "+962-3-555-7001", lastMaintenanceAt: new Date("2024-10-30T09:00:00Z") } }),
  ]);
  console.log(`  ✓ ${stations.length} stations`);

  // Fuel inventories
  const fuelData = [
    { stationId: "s1", diesel: 5400, o90: 12000, o95: 8900, capD: 30000, cap90: 25000, cap95: 25000 },
    { stationId: "s2", diesel: 22000, o90: 18000, o95: 15000, capD: 30000, cap90: 25000, cap95: 25000 },
    { stationId: "s3", diesel: 8500, o90: 14000, o95: 6000, capD: 20000, cap90: 20000, cap95: 15000 },
    { stationId: "s4", diesel: 4200, o90: 6500, o95: 3000, capD: 15000, cap90: 12000, cap95: 10000 },
    { stationId: "s5", diesel: 28000, o90: 22000, o95: 18000, capD: 35000, cap90: 25000, cap95: 20000 },
    { stationId: "s6", diesel: 0, o90: 0, o95: 0, capD: 15000, cap90: 12000, cap95: 10000 },
    { stationId: "s7", diesel: 1800, o90: 3200, o95: 1500, capD: 12000, cap90: 10000, cap95: 8000 },
    { stationId: "s8", diesel: 11000, o90: 9500, o95: 7200, capD: 18000, cap90: 14000, cap95: 12000 },
  ];
  const inventories = [];
  for (const f of fuelData) {
    inventories.push(await prisma.fuelInventory.create({ data: { stationId: f.stationId, fuelType: "diesel", currentLevel: f.diesel, minThreshold: f.capD * 0.2, maxCapacity: f.capD } }));
    inventories.push(await prisma.fuelInventory.create({ data: { stationId: f.stationId, fuelType: "octane_90", currentLevel: f.o90, minThreshold: f.cap90 * 0.2, maxCapacity: f.cap90 } }));
    inventories.push(await prisma.fuelInventory.create({ data: { stationId: f.stationId, fuelType: "octane_95", currentLevel: f.o95, minThreshold: f.cap95 * 0.2, maxCapacity: f.cap95 } }));
  }
  console.log(`  ✓ ${inventories.length} fuel inventories`);

  // Predictions + XAI
  const predictions = [
    { id: "p1", stationId: "s1", region: "Amman", fuelType: "diesel", predictionDate: "2024-12-20", outcome: "critical_shortage", predictedLevel: 1800, confidence: 94, factors: [{ factor: "demand_spike", label: "High Demand", weight: 0.42, value: 87, trend: "up", threshold: 50 }, { factor: "delivery_delay", label: "Delivery Delay (14h)", weight: 0.31, value: 14, trend: "up", threshold: 6 }, { factor: "inventory_low", label: "Low Inventory (18%)", weight: 0.27, value: 18, trend: "down", threshold: 25 }], actions: [{ priority: 1, action: "dispatch_truck", label: "Dispatch T-102 → 12,000L Diesel", params: JSON.stringify({ truck_id: "T-102", fuel: "diesel", qty: 12000 }), expectedImpact: "Restores to 58% capacity" }, { priority: 2, action: "alert_authority", label: "Alert Ministry of Energy", params: JSON.stringify({ severity: "warning" }), expectedImpact: "Activates reserve protocol" }] },
    { id: "p2", stationId: "s4", region: "Zarqa", fuelType: "octane_95", predictionDate: "2024-12-21", outcome: "shortage", predictedLevel: 1200, confidence: 82, factors: [{ factor: "demand_spike", label: "High Demand", weight: 0.45, value: 78, trend: "up", threshold: 50 }, { factor: "inventory_low", label: "Low Inventory (30%)", weight: 0.35, value: 30, trend: "down", threshold: 25 }], actions: [{ priority: 1, action: "dispatch_truck", label: "Dispatch T-103 → 8,000L Octane 95", params: JSON.stringify({ truck_id: "T-103", fuel: "octane_95", qty: 8000 }), expectedImpact: "Restores to 60% capacity" }] },
  ];
  for (const p of predictions) {
    const pred = await prisma.prediction.create({ data: { id: p.id, stationId: p.stationId, region: p.region, fuelType: p.fuelType, predictionDate: p.predictionDate, outcome: p.outcome, predictedLevel: p.predictedLevel, confidence: p.confidence } });
    const xai = await prisma.xaiExplanation.create({ data: { predictionId: p.id } });
    for (const f of p.factors) {
      await prisma.factor.create({ data: { explanationId: xai.id, ...f } });
    }
    for (const a of p.actions) {
      await prisma.action.create({ data: { explanationId: xai.id, ...a } });
    }
  }
  console.log(`  ✓ ${predictions.length} predictions with XAI`);

  // Trucks
  const trucks = await Promise.all([
    prisma.truck.create({ data: { id: "t1", plateNumber: "J-102-2024", driverName: "Mohammad Ali", driverPhone: "+962-7-9000-1001", status: "in_transit", fuelType: "diesel", capacity: 25000, currentLoad: 12000, latitude: 31.8500, longitude: 35.9500, lastGpsUpdate: new Date(), region: "Amman" } }),
    prisma.truck.create({ data: { id: "t2", plateNumber: "J-103-2024", driverName: "Khaled Hassan", driverPhone: "+962-7-9000-1002", status: "loading", fuelType: "octane_95", capacity: 20000, currentLoad: 8000, latitude: 29.5319, longitude: 35.0069, lastGpsUpdate: new Date(), region: "Aqaba" } }),
    prisma.truck.create({ data: { id: "t3", plateNumber: "J-104-2024", driverName: "Yousef Ibrahim", driverPhone: "+962-7-9000-1003", status: "idle", fuelType: "diesel", capacity: 30000, currentLoad: 0, region: "Irbid" } }),
    prisma.truck.create({ data: { id: "t4", plateNumber: "J-105-2024", driverName: "Ali Mahmoud", driverPhone: "+962-7-9000-1004", status: "maintenance", fuelType: "octane_90", capacity: 18000, currentLoad: 0, region: "Zarqa" } }),
    prisma.truck.create({ data: { id: "t5", plateNumber: "J-106-2024", driverName: "Hussein Ahmad", driverPhone: "+962-7-9000-1005", status: "in_transit", fuelType: "diesel", capacity: 25000, currentLoad: 22000, latitude: 32.0500, longitude: 36.1000, lastGpsUpdate: new Date(), region: "Zarqa" } }),
  ]);
  console.log(`  ✓ ${trucks.length} trucks`);

  // KPI snapshots (30 days)
  const kpis = [];
  const metrics = ["national_reserve_days", "avg_delivery_time", "station_uptime", "prediction_accuracy"];
  const regions = ["Amman", "Zarqa", "Irbid", "Balqa", "Mafraq", "Karak", "Aqaba"];
  for (let day = 30; day >= 0; day--) {
    const d = new Date(Date.now() - day * 86400000).toISOString().slice(0, 10);
    for (const metric of metrics) {
      kpis.push(await prisma.kpiSnapshot.create({ data: { date: d, metric, value: Math.random() * 100, region: regions[day % regions.length] } }));
    }
  }
  console.log(`  ✓ ${kpis.length} KPI snapshots`);

  // Notifications
  const notifs = await Promise.all([
    prisma.notification.create({ data: { id: "n1", userId: "u1", title: "Critical Shortage Detected", body: "Al-Hussein Station — Diesel at 18%. Dispatch required.", severity: "critical", category: "shortage", isRead: false, createdAt: new Date(Date.now() - 600000) } }),
    prisma.notification.create({ data: { id: "n2", userId: "u1", title: "Delivery En Route", body: "T-102 dispatched from Aqaba to Amman. ETA 3 hours.", severity: "info", category: "delivery", isRead: false, createdAt: new Date(Date.now() - 1800000) } }),
    prisma.notification.create({ data: { id: "n3", userId: "u1", title: "Station Offline", body: "Balqa Station entered maintenance mode.", severity: "warning", category: "maintenance", isRead: true, createdAt: new Date(Date.now() - 3600000) } }),
    prisma.notification.create({ data: { id: "n4", userId: "u1", title: "Weekly Report Ready", body: "National fuel report for week 50 is available.", severity: "info", category: "system", isRead: true, createdAt: new Date(Date.now() - 7200000) } }),
    prisma.notification.create({ data: { id: "n5", userId: "u1", title: "Fraud Alert", body: "Anomalous sensor reading detected at Zarqa Main Station.", severity: "warning", category: "system", isRead: true, createdAt: new Date(Date.now() - 14400000) } }),
  ]);
  console.log(`  ✓ ${notifs.length} notifications`);

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
