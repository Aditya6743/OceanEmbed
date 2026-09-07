import type { PredictionResponse } from '../types/ocean';
export interface HistoryDataPoint {
  date: string;
  sst: number;
}

const env = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
const BASE_URL = env?.VITE_API_URL || 'http://localhost:8000/api/v1';

// MOCK DATA for seamless demos if the backend is unreachable
const getMockPrediction = (lat: number, lon: number, date: string): PredictionResponse => ({
  location: { latitude: lat, longitude: lon, date, region: "ARABIAN SEA" },
  surface_data: { sst: 29.5, ssh: 0.42, sss: 35.8, current_u: 0.15, current_v: -0.08, wind_u: 4.2, wind_v: -2.1 },
  profile: {
    depth: [0, 10, 20, 30, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000],
    temperature: [29.5, 29.4, 29.3, 29.2, 28.5, 26.8, 24.2, 21.5, 19.1, 15.8, 13.4, 11.7, 9.2, 7.5, 6.1, 5.4, 4.8, 4.3, 3.9],
    reference_temperature: [29.4, 29.3, 29.3, 29.1, 28.3, 26.9, 24.5, 21.8, 19.4, 16.0, 13.5, 11.8, 9.3, 7.6, 6.2, 5.5, 4.9, 4.4, 4.0]
  },
  model_version: "OceanEmbed-v1.2 (ResNet)",
  estimated_thermocline: 65,
  metrics: { rmse: 0.142, mae: 0.110, bias: -0.015, correlation: 0.987 }
});

const getMockHistory = (): HistoryDataPoint[] => {
  return [
    { date: "2025-12-01", sst: 28.2 },
    { date: "2026-01-01", sst: 28.5 },
    { date: "2026-02-01", sst: 28.8 },
    { date: "2026-03-01", sst: 29.1 },
    { date: "2026-04-01", sst: 29.4 },
    { date: "2026-05-01", sst: 29.5 }
  ];
};

export async function fetchOceanPrediction(lat: number, lon: number, date: string): Promise<PredictionResponse> {
  try {
    const query = new URLSearchParams({ lat: String(lat), lon: String(lon), date });
    const res = await fetch(`${BASE_URL}/predict?${query}`);

    if (!res.ok) {
      console.warn("Backend unavailable, using mock data for demo.");
      return getMockPrediction(lat, lon, date);
    }

    return await res.json();
  } catch (err) {
    console.warn("Backend unavailable, using mock data for demo.");
    return getMockPrediction(lat, lon, date);
  }
}

export async function fetchHistory(lat: number, lon: number): Promise<HistoryDataPoint[]> {
  try {
    const query = new URLSearchParams({ lat: String(lat), lon: String(lon) });
    const res = await fetch(`${BASE_URL}/history?${query}`);

    if (!res.ok) {
      return getMockHistory();
    }

    const data = await res.json();
    return data.history;
  } catch (err) {
    return getMockHistory();
  }
}
