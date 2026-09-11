export interface OceanLocation {
  latitude: number;
  longitude: number;
  date: string;
  region?: string;
}

export interface SurfaceData {
  sst: number;       // Sea Surface Temperature in °C
  ssh: number;       // Sea Surface Height / Anomaly in m
  sss: number;       // Sea Surface Salinity in PSU
  current_u: number; // Surface Ocean Current U in m/s
  current_v: number; // Surface Ocean Current V in m/s
  wind_u: number;    // Surface Wind U in m/s
  wind_v: number;    // Surface Wind V in m/s
}

export interface OceanProfile {
  depth: number[];
  temperature: number[];
  speed_of_sound?: number[];
  reference_temperature?: number[];
}

export interface PredictionMetrics {
  rmse: number;
  mae: number;
  bias: number;
  correlation: number;
}

export interface ArgoFloat {
  id: string;
  lat: number;
  lon: number;
  timestamp?: string;
  depths: number[];
  temperatures: number[];
}

export interface LiveArgoMarker {
  id: string;
  lat: number;
  lon: number;
  timestamp: string;
  cycleNumber?: number;
  dataTypes?: string[];
}

export interface PredictionResponse {
  location: OceanLocation;
  surface_data: SurfaceData;
  profile: OceanProfile;
  model_version: string;
  estimated_thermocline?: number;
  metrics?: PredictionMetrics;
  argo_floats?: ArgoFloat[];
}
