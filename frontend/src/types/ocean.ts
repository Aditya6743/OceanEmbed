export interface OceanLocation {
  latitude: number;
  longitude: number;
  date: string;
  region?: string;
}

export interface SurfaceData {
  sst: number; // Sea Surface Temperature in °C
  ssh: number; // Sea Surface Height / Anomaly in m
  sss: number; // Sea Surface Salinity in PSU
}

export interface OceanProfile {
  depth: number[];
  temperature: number[];
}

export interface PredictionResponse {
  location: OceanLocation;
  surface_data: SurfaceData;
  profile: OceanProfile;
  model_version: string;
  estimated_thermocline?: number;
}

export interface PredictionMetrics {
  rmse: number;
  mae: number;
  r2: number;
}

export interface ArgoComparisonData {
  depth: number[];
  oceanembed_temp: number[];
  argo_temp: number[];
  metrics: PredictionMetrics;
}
