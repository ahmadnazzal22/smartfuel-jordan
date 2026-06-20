export type StationStatus = "active" | "maintenance" | "closed" | "emergency";
export type FuelType = "octane_90" | "octane_95" | "diesel" | "kerosene";

export interface Station {
  id: string;
  name: string;
  license_number: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  status: StationStatus;
  risk_score: number;
  fuel_capacity?: Record<FuelType, number>;
  operating_hours?: Record<string, string>;
  contact_phone?: string;
  last_maintenance_at?: string;
  created_at: string;
  fuel?: Record<FuelType, number>;
  capacity?: Record<FuelType, number>;
}

export interface StationSensor {
  id: string;
  station_id: string;
  sensor_type: string;
  fuel_type: FuelType;
  current_value: number;
  battery_level: number;
  last_reading_at: string;
  is_online: boolean;
}

export interface SensorReading {
  time: string;
  value: number;
  fuel_type: FuelType;
}

export interface FuelInventory {
  station_id: string;
  fuel_type: FuelType;
  current_level: number;
  min_threshold: number;
  max_capacity: number;
  replenishment_eta?: string;
  last_restocked_at?: string;
}
