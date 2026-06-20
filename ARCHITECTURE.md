# SmartFuel Jordan — National Fuel Intelligence Platform

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Citizen Mobile App (React Native)            │
│            Report shortages · View station status · Alerts      │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS/WSS
┌───────────────────────────▼─────────────────────────────────────┐
│                     API Gateway (Next.js Route Handlers)         │
│              Rate limiting · Auth verification · Routing          │
└──────┬──────────────┬──────────────┬──────────────┬──────────────┘
       │              │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌───▼────────┐ ┌───▼──────────┐
│  Auth Svc   │ │ Station Svc│ │ Predict Svc│ │  Truck Svc   │
│ JWT · RBAC  │ │ CRUD · Fuel│ │ AI Gateway │ │ GPS · Routes │
└──────┬──────┘ └─────┬──────┘ └───┬────────┘ └───┬──────────┘
       │              │              │              │
┌──────▼──────────────▼──────────────▼──────────────▼──────────────┐
│                      PostgreSQL + Redis                          │
│          17 tables · Cached KPIs · Session store                 │
└──────────────────────────────────────────────────────────────────┘
       │              │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌───▼────────┐ ┌───▼──────────┐
│   AI Svc    │ │ XAI Layer  │ │ WebSocket  │ │ Notification │
│   Prophet   │ │  SHAP      │ │  Server    │ │   Service    │
│ Forecasts   │ │  LIME      │ │ Real-time  │ │  Email/SMS   │
└─────────────┘ └────────────┘ └────────────┘ └──────────────┘
```

## Design System — National Fuel Intelligence Identity

### Brand DNA
- **Purpose**: National security, energy independence, crisis prevention
- **Tone**: Authoritative, precise, proactive
- **Visual metaphor**: Fuel flowing through Jordan's veins — amber/orange energy pulse across a dark, sophisticated canvas

### Color System
- **Primary**: Amber #F59E0B → Orange #F97316 — energy, fuel, urgency
- **Background**: Near-black #070B14 → Deep navy #0B1120 — authority, depth
- **Accent**: Electric blue #3B82F6 — data, intelligence, cold precision against warm fuel
- **Success**: Emerald #10B981 — stable, healthy
- **Danger**: Rose #F43F5E — critical, action required
- **Surface**: White at 3-8% opacity — glass morphism layers

### Typography
- **Headings**: Inter, heavy weight (700-800), tight tracking (-0.02em)
- **Data**: Tabular-nums, monospace for KPIs
- **Labels**: 11px uppercase, wide tracking, muted

### Component Hierarchy (Next.js + ShadCN + Tailwind)

```
src/
├── app/
│   ├── (auth)/login         — Glass morphism card · Ambient mesh bg
│   ├── (dashboard)/
│   │   ├── overview         — KPI grid · Alerts · Predictions · Map
│   │   ├── stations         — Station cards · Fuel gauges · Risk badges
│   │   ├── predictions      — AI explanation cards · Factor bars
│   │   ├── trucks           — Fleet map · Live GPS · Status cards
│   │   ├── notifications    — Priority list · Real-time feed
│   │   └── analytics        — KPI trends · Regional heatmaps
├── components/
│   ├── ui/                  — Button, Card, Badge, Input, Table, Tabs
│   ├── layout/              — Sidebar, Topbar, Shell
│   ├── dashboard/           — KpiCard, KpiChart, RegionTable
│   ├── stations/            — FuelGauge, RiskBadge, StationMap
│   ├── predictions/         — PredictionCard, FactorBar, ActionList
│   ├── trucks/              — TruckStatusBadge, LiveTracker
│   └── notifications/       — NotificationItem, AlertBanner
├── lib/                     — API client, Auth, Prisma, Utils
├── hooks/                   — useCountUp, useWebSocket, usePoll
└── types/                   — Prediction, Station, Truck, Notification
```

## API Structure (REST)

```
POST   /api/v1/auth/login          → { token, user }
POST   /api/v1/auth/logout         → { success }
POST   /api/v1/auth/refresh        → { token }

GET    /api/v1/stations            → { data: Station[], meta }
GET    /api/v1/stations/:id        → { data: Station }
GET    /api/v1/stations/risk       → { data: Station[] } (sorted by risk)

GET    /api/v1/predictions         → { data: Prediction[] }
GET    /api/v1/predictions/:id     → { data: Prediction + XAI }

GET    /api/v1/trucks              → { data: Truck[] }
GET    /api/v1/trucks/:id          → { data: Truck + GPS + Trips }

GET    /api/v1/notifications       → { data: Notification[] }
PATCH  /api/v1/notifications       → mark read { id }

GET    /api/v1/dashboard           → { data: KPI, meta }
POST   /api/v1/dashboard           → { data: KpiSnapshot[] }

GET    /api/v1/kpi/history         → { data: KpiSnapshot[] }
GET    /api/v1/regions             → { data: Region[] }
```

## Explainable AI (XAI) Output

```json
{
  "predictionId": "p1",
  "outcome": "critical_shortage",
  "confidence": 94,
  "contributingFactors": [
    { "factor": "demand_spike", "label": "High Demand", "weight": 0.42, "value": 87, "trend": "up" },
    { "factor": "delivery_delay", "label": "Delivery Delay (14h)", "weight": 0.31, "value": 14, "trend": "up" },
    { "factor": "inventory_low", "label": "Low Inventory (18%)", "weight": 0.27, "value": 18, "trend": "down" }
  ],
  "recommendedActions": [
    { "priority": 1, "label": "Dispatch T-102 → 12,000L Diesel", "expectedImpact": "Restores to 58%" }
  ]
}
```

## National KPI Framework

| Metric | Description | Target |
|--------|-------------|--------|
| Fuel Availability Index | Avg fuel % across all stations | ≥ 60% |
| National Stability Score | Supply chain resilience | ≥ 80% |
| Avg Waiting Time | Minutes trucks wait at depots | ≤ 15 min |
| Distribution Efficiency | % of on-time deliveries | ≥ 90% |
| Supply Chain Health | Composite logistics score | ≥ 75% |
| Fraud Detection | Sensor anomaly accuracy | ≥ 95% |

## Database (PostgreSQL — 17 Tables)

### Core
- **users** — id, email, password_hash, name, role, region, is_active
- **stations** — id, name, license, region, lat, lng, status, risk_score
- **trucks** — id, plate, driver, status, fuel_type, capacity, current_load

### Inventory & Monitoring
- **fuel_inventory** — station_id, fuel_type, current_level, min_threshold, max_capacity
- **sensors** — id, station_id, type, fuel_type, value, battery, online
- **sensor_readings** — id, sensor_id, value, timestamp

### Intelligence
- **predictions** — id, station_id, region, fuel_type, date, outcome, confidence
- **xai_explanations** — id, prediction_id, shap_values, counterfactuals
- **factors** — id, explanation_id, factor, weight, value, trend
- **actions** — id, explanation_id, priority, action, impact

### Operations
- **trips** — id, truck_id, origin, destination, fuel_type, qty, status
- **gps_logs** — id, truck_id, lat, lng, speed, heading, timestamp
- **notifications** — id, user_id, station_id, title, body, severity, is_read
- **kpi_snapshots** — id, date, metric, value, region
- **audit_logs** — id, user_id, action, entity, details, ip

## MVP Roadmap

### Phase 1 ✅ (Current)
Core Dashboard + Stations + Predictions + Auth

### Phase 2 ✅ (Current)
Trucks + Notifications + Real-time WebSocket + AI Service

### Phase 3 (Next)
- AI Cabinet Advisor dashboard with scenario simulation
- Digital Twin for stations with sensor data visualization
- Advanced RBAC (admin, operator, analyst, viewer)

### Phase 4 (Future)
- National Energy Brain — cross-region optimization
- Predictive distribution routing
- Citizen mobile app
- Ministry-level reporting & export
