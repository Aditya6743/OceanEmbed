import type { PredictionResponse } from '../types/ocean';

const env = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
const BASE_URL = env?.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function fetchOceanPrediction(lat: number, lon: number, date: string): Promise<PredictionResponse> {
  const query = new URLSearchParams({ lat: String(lat), lon: String(lon), date });
  const res = await fetch(`${BASE_URL}/predict?${query}`);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || `Inference error: ${res.status}`);
  }

  return res.json();
}

export interface HistoryDataPoint {
  date: string;
  sst: number;
}

export async function fetchHistory(lat: number, lon: number): Promise<HistoryDataPoint[]> {
  const query = new URLSearchParams({ lat: String(lat), lon: String(lon) });
  const res = await fetch(`${BASE_URL}/history?${query}`);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || `History error: ${res.status}`);
  }

  const data = await res.json();
  return data.history;
}