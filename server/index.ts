import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

async function broadcastDashboard() {
  try {
    const stations = await prisma.station.findMany({ include: { fuelInventories: true } });
    const predictions = await prisma.prediction.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
    const alerts = await prisma.notification.findMany({ where: { isRead: false }, orderBy: { createdAt: "desc" }, take: 5 });
    const trucks = await prisma.truck.findMany();
    const kpis = await prisma.kpiSnapshot.findMany({ orderBy: { date: "desc" }, take: 30 });

    const avgFuel = stations.length ? Math.round(stations.reduce((s, st) => {
      const total = st.fuelInventories.reduce((t, f) => t + (f.currentLevel / f.maxCapacity) * 100, 0);
      return s + total / (st.fuelInventories.length || 1);
    }, 0) / stations.length) : 0;

    const kpi = {
      fuel_availability_index: avgFuel,
      national_stability_score: Math.round(85 + Math.random() * 10),
      avg_waiting_time_min: Math.round(20 + Math.random() * 15),
      distribution_efficiency: Math.round(78 + Math.random() * 15),
      supply_chain_health: Math.round(82 + Math.random() * 12),
      fraud_detection_score: Math.round(92 + Math.random() * 7),
      total_active_stations: stations.filter((s) => s.status === "active").length,
      stations_at_risk: stations.filter((s) => s.riskScore >= 60).length,
      total_trucks_en_route: trucks.filter((t) => t.status === "in_transit").length,
    };

    io.emit("dashboard:snapshot", { kpi, alerts, trucks });
  } catch (err) {
    console.error("Broadcast error:", err);
  }
}

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  broadcastDashboard();

  socket.on("subscribe:truck", (truckId: string) => {
    socket.join(`truck:${truckId}`);
  });

  socket.on("subscribe:station", (stationId: string) => {
    socket.join(`station:${stationId}`);
  });

  socket.on("truck:gps", async (data: { truckId: string; latitude: number; longitude: number; speed?: number }) => {
    await prisma.gpsLog.create({
      data: { truckId: data.truckId, latitude: data.latitude, longitude: data.longitude, speed: data.speed ?? 0 },
    });
    await prisma.truck.update({
      where: { id: data.truckId },
      data: { latitude: data.latitude, longitude: data.longitude, lastGpsUpdate: new Date() },
    });
    io.to(`truck:${data.truckId}`).emit("truck:gps", data);
  });

  socket.on("sensor:reading", async (data: { sensorId: string; value: number }) => {
    await prisma.sensorReading.create({ data: { sensorId: data.sensorId, value: data.value, fuelType: "diesel" } });
    await prisma.sensor.update({ where: { id: data.sensorId }, data: { currentValue: data.value, lastReadingAt: new Date() } });
    io.emit("sensor:reading", data);
  });

  socket.on("disconnect", () => console.log(`Client disconnected: ${socket.id}`));
});

setInterval(broadcastDashboard, 5000);

const PORT = parseInt(process.env.WS_PORT || "3001", 10);
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
