# SmartFuel Jordan — Fuel Supply Intelligence Platform

<p align="center">
  <strong>A dashboard concept for fuel supply monitoring, analytics, and operational insights.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/Framer_Motion-11-EF0076?style=flat-square&logo=framer" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Recharts-2.12-FF6C37?style=flat-square" alt="Recharts"/>
  <img src="https://img.shields.io/badge/Three.js-3D-000000?style=flat-square&logo=three.js" alt="Three.js"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License"/>
</p>

---

## Overview

**SmartFuel Jordan** is a web application concept for visualizing and managing fuel supply operations through a centralized dashboard.

The platform brings together operational indicators, station information, fleet management, analytics, and predictive features in a single interface.

It is designed around a Jordan-focused fuel network, with regional visualizations and tools for exploring supply activity, potential risks, and operational performance.

> This project demonstrates a software platform concept. Its dashboards, predictions, and monitoring capabilities should not be interpreted as verified live data from Jordan's national fuel infrastructure.

---

## Key Features

### Command Dashboard
- Executive overview with key performance indicators.
- Summary of fuel supply and operational activity.
- Regional information displayed through dashboard visualizations.
- AI-generated summary interface.

### 3D Visualization
- Interactive 3D map interface for Jordan.
- City and regional markers.
- Visual representation of fuel supply routes.
- Digital-twin-style network visualization.

### Analytics
- KPI cards and historical charts.
- Regional risk visualization.
- Governorate-level station and fuel information.
- Operational activity summaries.

### AI & Predictions
- Shortage forecasting interface.
- Recommendation engine for restocking and maintenance scenarios.
- AI insight cards.
- Natural-language AI CoPilot interface.

*Prediction accuracy and operational reliability depend on the underlying data and models. Do not interpret demonstration results as validated forecasts.*

### Monitoring & Anomaly Interfaces
- Fuel inventory discrepancy alerts.
- Sensor anomaly scenarios.
- Route deviation indicators.
- Audit trail and activity history.
- Early-warning dashboard.

### Fleet Management
- Truck location visualization.
- Supply route display.
- Load and capacity indicators.
- Trip history interface.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14, App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| 3D Visualization | React Three Fiber, Three.js |
| Charts | Recharts |
| Icons | Lucide React |
| ORM | Prisma |
| Database | SQLite / Turso LibSQL |
| Authentication | bcryptjs, JWT sessions |
| Real-time | WebSocket (`ws`) |

### Visual Design

- Dark interface based on Zinc-950.
- Emerald accent color (`#34d399`).
- Glass-style dashboard panels.
- Gradient effects and animated components.
- Inter and JetBrains Mono typography.
- Responsive desktop and mobile layouts.

---

## Project Structure

The application uses the Next.js App Router and organizes its code into application routes, reusable components, and supporting modules.

```text
smartfuel-jordan/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   ├── api/
│   │   └── login/
│   ├── components/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── chat/
│   │   └── ui/
│   ├── lib/
│   ├── contexts/
│   ├── hooks/
│   └── types/
├── prisma/
├── public/
├── package.json
└── README.md
```

*This is a simplified structure based on the project description. Confirm the actual folder and file names in the repository before relying on this tree.*

---

## Quick Start

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd smartfuel-jordan
```

Replace `<YOUR_REPOSITORY_URL>` with the actual repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Database

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

If the project includes a seed script, run:

```bash
npm run db:seed
```

### 4. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Production Build

```bash
npm run build
npm start
```

---

## Main Dashboard Routes

The project description includes the following application areas:

| Route | Description |
|---|---|
| `/overview` | Main dashboard |
| `/command-center` | Operations overview |
| `/digital-twin` | 3D network visualization |
| `/early-warning` | Early-warning interface |
| `/stations` | Station management |
| `/predictions` | Prediction dashboard |
| `/trucks` | Fleet management |
| `/recommendations` | Recommendations and anomalies |
| `/audit-trail` | Activity history |
| `/anomalies` | Anomaly monitoring |
| `/national-risk` | Risk dashboard |
| `/notifications` | Notification center |
| `/analytics` | Analytics and reporting |

---

## Data & Demonstration Environment

The project description includes sample data for dashboard development, such as:

- Users and roles.
- Fuel stations and inventories.
- Truck and trip records.
- KPI snapshots.
- Anomaly examples.
- Prediction and recommendation records.
- Audit logs.

Sample data is intended for development and demonstration. It should not be presented as verified operational information.

---

## Security Notes

- Change all development credentials before deployment.
- Store secrets in environment variables.
- Never commit real database credentials or JWT secrets.
- Protect API routes and administrative operations.
- Do not expose sensitive operational or personal information.

---

## License

MIT License.

---

<p align="center">
  <strong>SmartFuel Jordan</strong><br/>
  <em>Exploring smarter fuel supply monitoring through data and technology.</em>
</p>
