import type { PredictionResponse, ArgoComparisonData } from '../types/ocean';

export const mockPredictionResponse: PredictionResponse = {
  location: {
    latitude: 18.42,
    longitude: 71.83,
    date: "2026-08-20",
    region: "Indian Ocean"
  },
  surface_data: {
    sst: 27.4,
    ssh: 0.18,
    sss: 35.2
  },
  profile: {
    depth: [0, 10, 50, 100, 120, 200, 500, 1000, 1500, 2000],
    temperature: [27.4, 27.2, 26.6, 24.8, 20.1, 19.5, 10.7, 5.2, 3.8, 3.1]
  },
  model_version: "OceanEmbed-v1",
  estimated_thermocline: 120
};

export const mockArgoComparison: ArgoComparisonData = {
  depth: [0, 10, 50, 100, 120, 200, 500, 1000, 1500, 2000],
  oceanembed_temp: [27.4, 27.2, 26.6, 24.8, 20.1, 19.5, 10.7, 5.2, 3.8, 3.1],
  argo_temp: [27.3, 27.3, 26.4, 25.0, 19.8, 19.2, 10.5, 5.0, 3.7, 3.2],
  metrics: {
    rmse: 0.24,
    mae: 0.18,
    r2: 0.96
  }
};
