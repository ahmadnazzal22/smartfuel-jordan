-- SmartFuel Jordan — Database Schema
-- PostgreSQL 16 + TimescaleDB + PostGIS

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE user_role AS ENUM ('citizen','station_owner','dispatcher','analyst','administrator','cabinet_member');
CREATE TYPE station_status AS ENUM ('active','maintenance','closed','emergency');
CREATE TYPE fuel_type AS ENUM ('octane_90','octane_95','diesel','kerosene');
CREATE TYPE alert_severity AS ENUM ('info','warning','critical','emergency');
CREATE TYPE prediction_outcome AS ENUM ('shortage','surplus','stable','critical_shortage');
CREATE TYPE truck_status AS ENUM ('idle','loading','en_route','delivering','returning');

-- =============================================
-- USERS & AUTH
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role user_role NOT NULL DEFAULT 'citizen',
  is_active BOOLEAN DEFAULT true,
  mfa_enabled BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  UNIQUE(role_id, resource, action)
);

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token VARCHAR(512) NOT NULL,
  device_info JSONB,
  ip_address INET,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- STATIONS
-- =============================================
CREATE TABLE stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  region VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  status station_status DEFAULT 'active',
  risk_score DECIMAL(5,2) DEFAULT 0.00,
  fuel_capacity JSONB,
  operating_hours JSONB,
  contact_phone VARCHAR(20),
  last_maintenance_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_stations_region ON stations(region);
CREATE INDEX idx_stations_status ON stations(status);
CREATE INDEX idx_stations_risk ON stations(risk_score DESC);

CREATE TABLE station_sensors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  sensor_type VARCHAR(50) NOT NULL,
  fuel_type fuel_type,
  unit VARCHAR(20) DEFAULT 'liters',
  current_value DECIMAL(12,2) NOT NULL,
  battery_level DECIMAL(5,2),
  last_reading_at TIMESTAMPTZ DEFAULT now(),
  is_online BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_sensors_station ON station_sensors(station_id);
CREATE INDEX idx_sensors_online ON station_sensors(is_online) WHERE is_online = true;

-- TimescaleDB hypertable for sensor readings
CREATE TABLE sensor_readings (
  time TIMESTAMPTZ NOT NULL,
  sensor_id UUID NOT NULL REFERENCES station_sensors(id) ON DELETE CASCADE,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  value DECIMAL(12,2) NOT NULL,
  fuel_type fuel_type NOT NULL
);
SELECT create_hypertable('sensor_readings', 'time', chunk_time_interval => INTERVAL '1 day', if_not_exists => TRUE);
CREATE INDEX idx_readings_station_time ON sensor_readings(station_id, time DESC);

-- =============================================
-- INVENTORY
-- =============================================
CREATE TABLE fuel_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  fuel_type fuel_type NOT NULL,
  current_level DECIMAL(12,2) NOT NULL,
  min_threshold DECIMAL(12,2) NOT NULL,
  max_capacity DECIMAL(12,2) NOT NULL,
  replenishment_eta TIMESTAMPTZ,
  last_restocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(station_id, fuel_type)
);
CREATE INDEX idx_inventory_low ON fuel_inventory(station_id) WHERE current_level <= min_threshold;

-- =============================================
-- TRUCKS
-- =============================================
CREATE TABLE trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate_number VARCHAR(50) UNIQUE NOT NULL,
  driver_id UUID REFERENCES users(id),
  fuel_type fuel_type NOT NULL,
  capacity_liters DECIMAL(10,2) NOT NULL,
  current_load DECIMAL(10,2) DEFAULT 0,
  status truck_status DEFAULT 'idle',
  region VARCHAR(100),
  last_location GEOGRAPHY(POINT, 4326),
  last_location_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_trucks_status ON trucks(status);
CREATE INDEX idx_trucks_region ON trucks(region);

CREATE TABLE truck_locations (
  time TIMESTAMPTZ NOT NULL DEFAULT now(),
  truck_id UUID NOT NULL REFERENCES trucks(id) ON DELETE CASCADE,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  speed_kmh DECIMAL(5,1),
  heading INTEGER
);
CREATE INDEX idx_truck_loc_time ON truck_locations(truck_id, time DESC);

-- =============================================
-- PREDICTIONS & AI
-- =============================================
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stations(id) ON DELETE SET NULL,
  region VARCHAR(100),
  fuel_type fuel_type NOT NULL,
  prediction_date DATE NOT NULL,
  outcome prediction_outcome NOT NULL,
  predicted_level DECIMAL(12,2),
  confidence DECIMAL(5,2) NOT NULL,
  model_version VARCHAR(50),
  run_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_predictions_station ON predictions(station_id, prediction_date DESC);
CREATE INDEX idx_predictions_region ON predictions(region, fuel_type, prediction_date);

CREATE TABLE ai_explanations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
  confidence DECIMAL(5,2) NOT NULL,
  contributing_factors JSONB NOT NULL,
  recommended_actions JSONB,
  feature_importance JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  severity alert_severity DEFAULT 'info',
  category VARCHAR(50),
  reference_type VARCHAR(50),
  reference_id UUID,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_notif_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notif_unread ON notifications(user_id) WHERE is_read = false;

-- =============================================
-- AUDIT
-- =============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource, resource_id);

-- =============================================
-- KPI SNAPSHOTS
-- =============================================
CREATE TABLE kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  fuel_availability_index DECIMAL(5,2),
  national_stability_score DECIMAL(5,2),
  avg_waiting_time_min INTEGER,
  distribution_efficiency DECIMAL(5,2),
  supply_chain_health DECIMAL(5,2),
  fraud_detection_score DECIMAL(5,2),
  total_active_stations INTEGER,
  stations_at_risk INTEGER,
  total_trucks_en_route INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_kpi_time ON kpi_snapshots(snapshot_time DESC);
