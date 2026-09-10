import type { PredictionResponse } from '../types/ocean';
import { getMockPrediction } from '../data/mockOceanData';

export interface HistoryDataPoint {
  date: string;
  sst: number;
}

const env = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
const BASE_URL = env?.VITE_API_URL || 'http://localhost:8000/api/v1';

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
      return getMockPrediction({ latitude: lat, longitude: lon, date, region: "INDIAN OCEAN" });
    }

    return await res.json();
  } catch (err) {
    console.warn("Backend unavailable, using mock data for demo.");
    return getMockPrediction({ latitude: lat, longitude: lon, date, region: "INDIAN OCEAN" });
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
    if (data.history && data.history.length > 0) return data.history; return getMockHistory();
  } catch (err) {
    return getMockHistory();
  }
}
