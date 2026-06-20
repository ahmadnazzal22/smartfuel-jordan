# SmartFuel Jordan — National Fuel Intelligence Command

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat-square&logo=prisma" />
  <img src="https://img.shields.io/badge/Framer_Motion-11-EF0076?style=flat-square&logo=framer" />
  <img src="https://img.shields.io/badge/Recharts-2.12-FF6C37?style=flat-square" />
  <img src="https://img.shields.io/badge/Three.js-R3F-000000?style=flat-square&logo=three.js" />
  <br/>
  <img src="https://img.shields.io/badge/Status-Production_Ready-10b981?style=flat-square" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Platform-Web_|_Mobile-8b5cf6?style=flat-square" />
</p>

---

## Overview

**SmartFuel Jordan** is an enterprise-grade, government-class command-and-control platform for monitoring, managing, and securing Jordan's national fuel supply chain. Designed to rival modern military C2 systems, it delivers a real-time, AI-powered dashboard with 3D geospatial visualization, predictive analytics, anomaly detection, and intelligent recommendations.

> *"A unified national energy intelligence platform — combining 3D geospatial visualization, predictive analytics, anomaly detection, and smart recommendations in a single command center."*

---

## Key Features

### 🎯 Unified National Command
- **Executive Dashboard** — National stability gauge, real-time KPIs, AI executive summary
- **3D Jordan Map** — Extruded country mesh with city markers, supply routes, port beacon
- **Digital Twin** — Live Three.js simulation of the national fuel network

### 📊 Analytics & KPIs
- **Live KPI Cards** — 6 real-time indicators with animated counters and trend deltas
- **30-Day Area Chart** — Interactive Recharts visualization with gradient fills
- **Regional Risk Heatmap** — 3×3 governorate risk grid with color-coded cells
- **Governorate Breakdown** — Detailed per-region station and fuel table

### 🤖 AI & Predictions
- **Smart Predictions** — 72-hour shortage forecasting with up to 96% confidence
- **Recommendation Engine** — Automated restock, maintenance, and fleet recommendations
- **AI Insight Cards** — Real-time intelligence with confidence scores and impact metrics
- **AI CoPilot** — Natural language chat interface for data queries

### 🔍 Security & Monitoring
- **Fuel Theft Detection** — Inventory discrepancy alerts, meter tampering detection
- **Anomaly Detection** — Sensor malfunctions, route deviations, unauthorized access
- **Audit Trail** — Full activity log with advanced filtering and pagination
- **Early Warning System** — Instant alerts for critical risks and shortages

### 🚚 Fleet Management
- **Truck Tracking** — Live GPS monitoring with supply routes
- **Load Distribution** — Real-time capacity and load percentage tracking
- **Trip History** — Complete transportation log with origin/destination

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| 3D Graphics | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + Three.js |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Database | SQLite (dev) / Turso LibSQL (prod) |
| Auth | bcryptjs + JWT sessions |
| Real-time | WebSocket (ws) |

### Visual Design System
- **Palette** — Zinc-950 background, emerald-400 accent (`#34d399`), amber/rose for alerts
- **Glassmorphism** — `.glass-panel` with 24–32px backdrop blur and saturate(1.4)
- **Premium Gradients** — Gradient borders, glow effects, text gradients via CSS `mask-composite`
- **Typography** — Inter (UI) + JetBrains Mono (data) with `lining-nums tabular-nums`
- **Responsive** — Desktop sidebar, mobile bottom nav with safe-area-inset-bottom

---

## Project Architecture

```
src/
├── app/
│   ├── (dashboard)/           # Protected dashboard pages
│   │   ├── overview/          # Main command center
│   │   ├── command-center/    # Unified operations room
│   │   ├── digital-twin/      # 3D network simulation
│   │   ├── early-warning/     # AI early detection
│   │   ├── stations/          # Station management
│   │   ├── predictions/       # Predictive analytics
│   │   ├── trucks/            # Fleet tracking
│   │   ├── recommendations/   # Smart recommendations + anomalies
│   │   ├── audit-trail/       # Activity log
│   │   ├── anomalies/         # Theft & anomaly detection
│   │   ├── national-risk/     # Comprehensive risk dashboard
│   │   ├── notifications/     # Alert center
│   │   └── analytics/         # Advanced reporting
│   ├── api/v1/                # REST API endpoints
│   └── login/                 # Authentication
├── components/
│   ├── dashboard/
│   │   ├── executive-summary.tsx     # Circular gauge + AI summary
│   │   ├── jordan-map.tsx            # 3D extruded map
│   │   ├── digital-twin.tsx          # 3D network twin
│   │   ├── risk-heatmap.tsx          # Regional risk grid
│   │   ├── ai-insight-card.tsx       # AI intelligence feed
│   │   ├── recommendation-engine.tsx # Recommendation cards
│   │   ├── anomaly-alerts.tsx        # Theft/anomaly cards
│   │   ├── timeline-feed.tsx         # Activity timeline
│   │   ├── kpi-chart.tsx             # Area chart
│   │   ├── kpi-card.tsx              # KPI metric card
│   │   └── ai-copilot.tsx            # AI chat assistant
│   ├── layout/                # Sidebar, Topbar, BottomNav
│   ├── chat/                  # Chat panel
│   └── ui/                    # Primitive components (Card, Skeleton, etc.)
├── lib/                       # Utilities, constants, prisma client
├── contexts/                  # React contexts (chat, realtime)
├── hooks/                     # Custom hooks (use-realtime)
└── types/                     # TypeScript type definitions
```

---

## Data Model

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│    User     │────→│  Session     │     │  Station   │
└─────────────┘     └──────────────┘     └─────┬──────┘
       │                                       │
       │                                       ├── Sensor
       │                                       ├── SensorReading
       │                                       ├── FuelInventory
       │                                       ├── Prediction
       │                                       ├── Notification
       │                                       └── Anomaly
       │
       │    ┌────────────┐     ┌────────────┐
       ├───→│ AuditLog   │     │   Truck    │
       │    └────────────┘     └─────┬──────┘
       │                             │
       │                             ├── Trip
       │                             ├── GpsLog
       │                             └── Anomaly
       │
       │    ┌────────────┐     ┌──────────────┐
       │    │ Prediction │────→│XaiExplanation│
       │    └────────────┘     └──────┬───────┘
       │                              ├── Factor
       │                              └── Action
       │
       │    ┌──────────────┐
       │    │ KpiSnapshot  │
       │    └──────────────┘
       │
       │    ┌──────────────┐
       └───→│ Notification │
            └──────────────┘
```

**15 models** total — SQLite (dev) / Turso (prod) via Prisma ORM.

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/your-org/smartfuel-jordan.git
cd smartfuel-jordan
npm install
```

### Database Setup

```bash
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

### Run Development

```bash
# Terminal 1: Next.js dev server
npm run dev

# Terminal 2 (optional): WebSocket for real-time updates
npx tsx server/index.ts
```

### Production Build

```bash
npm run build
npm start
```

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/overview` | Command Center | Main executive dashboard |
| `/command-center` | Operations Room | Unified command interface |
| `/digital-twin` | Digital Twin | 3D network simulation |
| `/early-warning` | Early Warning | AI-powered alert system |
| `/stations` | Stations | Fuel station management |
| `/stations/[id]` | Station Detail | Single station view |
| `/stations/risk` | Risk Matrix | Station risk analysis |
| `/predictions` | Predictions | AI shortage forecasts |
| `/predictions/[id]` | Prediction Detail | XAI explanation view |
| `/predictions/trends` | Trends | Historical trend analysis |
| `/trucks` | Trucks | Fleet management |
| `/trucks/[id]` | Truck Detail | Single truck tracking |
| `/recommendations` | Recommendations | Smart recs + anomaly detection |
| `/audit-trail` | Audit Trail | Full activity log |
| `/anomalies` | Anomaly Detection | Theft & sensor anomalies |
| `/national-risk` | Risk Dashboard | Comprehensive risk view |
| `/notifications` | Alerts | Notification center |
| `/analytics` | Analytics | Advanced reporting |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/dashboard` | Dashboard aggregate data |
| GET | `/api/v1/kpi/history` | 30-day KPI history |
| GET | `/api/v1/regions` | Regional breakdown |
| GET | `/api/v1/stations` | List all stations |
| GET | `/api/v1/stations/[id]` | Station details |
| GET | `/api/v1/predictions` | AI predictions (filterable) |
| GET | `/api/v1/predictions/[id]` | Single prediction with XAI |
| GET | `/api/v1/trucks` | List all trucks |
| GET | `/api/v1/trucks/[id]` | Truck details |
| GET | `/api/v1/notifications` | Notifications |
| GET | `/api/v1/recommendations` | Smart recommendations |
| GET | `/api/v1/audit-logs` | Audit trail (paginated) |
| GET | `/api/v1/anomalies` | Anomaly incidents (filterable) |
| POST | `/api/v1/chat` | AI CoPilot query |
| POST | `/api/v1/auth/login` | Authentication |
| POST | `/api/v1/auth/logout` | Logout |
| POST | `/api/v1/auth/refresh` | Token refresh |

---

## Credentials (Dev)

| Email | Password | Role |
|-------|----------|------|
| admin@smartfuel.jo | admin123 | System Admin |
| operator@smartfuel.jo | admin123 | Operator |

> ⚠️ **Security Note**: The dev environment uses a pass-through middleware (`matcher: []`). Auth is enforced only in production.

---

## Seed Data

The `npm run db:seed` script generates:
- **2 users** (admin + operator)
- **8 stations** across 6 governorates
- **24 fuel inventories** (diesel, octane 90, octane 95)
- **5 trucks** with varying statuses
- **124+ KPI snapshots** over 30 days
- **6 anomalies** (theft, sensor failure, inventory discrepancy, route deviation, meter tampering)
- **10 audit logs**
- **AI predictions** with XAI factors and recommended actions

---

## Jordan Station Map

```
+------------------+     +------------------+
|      Irbid       |     |     Mafraq       |
|  Irbid Central   |     |  Mafraq Station  |
+--------+---------+     +--------+---------+
         |                        |
         |    +------------------+ |
         +----+      Amman      +-+
              |  Al-Hussein      |
              |  King Abdullah II|
              +--------+---------+
                       |
         +-------------+-------------+
         |             |             |
+--------+------+ +----+--------+ +--+-----------+
|    Zarqa      | |   Balqa     | |    Karak      |
|  Zarqa Main   | | Balqa Stn   | |  Karak Stn    |
+---------------+ +-------------+ +---------------+

         +------------------+
         |      Aqaba       |
         |  Aqaba Port Stn  |
         +------------------+
```

---

## Project Stats

| Metric | Value |
|--------|-------|
| TypeScript Files | 80+ |
| React Components | 45+ |
| Prisma Models | 15 |
| API Endpoints | 18 |
| Dashboard Pages | 14 |
| Lucide Icons | 25+ |
| Loader Skeletons | 5 variants |

---

## License

MIT © 2025 — Open-source project for modernizing Jordan's energy infrastructure.

---

<p align="center">
  <strong>SmartFuel Jordan — National Fuel Intelligence Command</strong><br/>
  <em>From legacy to readiness — Energy intelligence for the nation.</em>
</p>
