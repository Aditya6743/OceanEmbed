import type { PredictionResponse } from '../types/ocean';
import { getMockPrediction } from '../data/mockOceanData';

export interface HistoryDataPoint {
  date: string;
  sst: number;
}

const env = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
const BASE_URL = env?.VITE_API_URL || 'http://localhost:8000/api/v1';


export async function fetchOceanPrediction(lat: number, lon: number, date: string, tempOffset: number = 0): Promise<PredictionResponse> {
  try {
    const query = new URLSearchParams({ lat: String(lat), lon: String(lon), date, temp_offset: String(tempOffset) });
    const res = await fetch(`${BASE_URL}/predict?${query}`);

    if (!res.ok) {
      if (res.status === 400) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Coordinate out of bounds. Please click inside the ocean.");
      }
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
      if (res.status === 400) {
        throw new Error("Coordinate out of bounds.");
      }
      return [];
    }

    const data = await res.json();
    if (data.history && data.history.length > 0) return data.history; return [];
  } catch (err) {
    return [];
  }
}
