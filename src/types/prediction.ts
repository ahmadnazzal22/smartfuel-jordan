export type PredictionOutcome = "critical_shortage" | "shortage" | "stable" | "surplus";

export interface Prediction {
  id: string;
  station_id?: string;
  region: string;
  fuel_type: string;
  prediction_date: string;
  outcome: PredictionOutcome;
  predicted_level: number;
  confidence: number;
  model_version?: string;
  created_at: string;
}

export interface Factor {
  factor: string;
  label: string;
  weight: number;
  value: number | string;
  trend: "up" | "down" | "stable";
  threshold?: number;
}

export interface Action {
  priority: 1 | 2 | 3;
  action: string;
  label: string;
  params: Record<string, any>;
  expectedImpact?: string;
}

export interface PredictionExplanation {
  predictionId: string;
  stationId?: string;
  region: string;
  fuelType: string;
  predictionDate: string;
  outcome: PredictionOutcome;
  confidence: number;
  timestamp: string;
  contributingFactors: Factor[];
  recommendedActions: Action[];
  shapValues?: Record<string, number>;
  counterfactuals?: Counterfactual[];
}

export interface Counterfactual {
  what: string;
  outcome: PredictionOutcome;
  confidenceDelta: number;
}
