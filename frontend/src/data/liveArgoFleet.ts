import type { LiveArgoMarker } from '../types/ocean';

const env = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env;
const BASE_URL = env?.VITE_API_URL || 'http://localhost:8000/api/v1';

export const DEFAULT_LIVE_ARGO_FLOATS: LiveArgoMarker[] = [
  { id: '3901923', lat: 15.2, lon: 65.5, timestamp: new Date().toISOString(), cycleNumber: 120, dataTypes: ['T', 'S', 'P'] },
  { id: '1901955', lat: 8.5, lon: 88.2, timestamp: new Date().toISOString(), cycleNumber: 94, dataTypes: ['T', 'S'] },
  { id: '5904832', lat: -5.1, lon: 75.3, timestamp: new Date().toISOString(), cycleNumber: 211, dataTypes: ['T', 'S', 'P', 'DOXY'] },
  { id: '2902314', lat: 22.4, lon: 60.1, timestamp: new Date().toISOString(), cycleNumber: 18, dataTypes: ['T'] }
];

export const fetchLiveArgoFleet = async (): Promise<LiveArgoMarker[]> => {
  try {
    const res = await fetch(`${BASE_URL}/argo/live`);
    if (!res.ok) throw new Error('Failed to fetch Argo fleet');
    const data = await res.json();
    return Array.isArray(data) ? data : DEFAULT_LIVE_ARGO_FLOATS;
  } catch (e) {
    console.error('ARGO fetch failed, using fallback fleet', e);
    return DEFAULT_LIVE_ARGO_FLOATS;
  }
};

export const getRelativeArgoTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Updated just now';
    if (diffHours < 24) return `Updated ${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Updated ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } catch {
    return 'Unknown time';
  }
};
