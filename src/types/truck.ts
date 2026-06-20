export type TruckStatus = "idle" | "loading" | "en_route" | "delivering" | "returning";

export interface Truck {
  id: string;
  plate: string;
  driver: string;
  fuel_type: string;
  capacity: number;
  current_load: number;
  status: TruckStatus;
  region: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  last_location_at?: string;
}

export interface TruckLocation {
  time: string;
  truck_id: string;
  latitude: number;
  longitude: number;
  speed_kmh: number;
  heading: number;
}
