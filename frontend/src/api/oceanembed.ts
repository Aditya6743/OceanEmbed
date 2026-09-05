import type { PredictionResponse } from '../types/ocean';
import { mockPredictionResponse } from '../data/mockOceanData';

const USE_MOCK_DATA = true;
const API_BASE_URL = 'http://localhost:8000/api/v1';

export const getPrediction = async (lat: number, lon: number, date: string): Promise<PredictionResponse> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock data but update it with the requested location
    return {
      ...mockPredictionResponse,
      location: {
        ...mockPredictionResponse.location,
        latitude: Number(lat.toFixed(2)),
        longitude: Number(lon.toFixed(2)),
        date: date,
        region: determineRegion(lat, lon)
      }
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/predict?lat=${lat}&lon=${lon}&date=${date}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch prediction:", error);
    throw error;
  }
};

// Simple helper to mock region names based on rough coordinates
function determineRegion(lat: number, lon: number): string {
  if (lat > 0 && lon > 30 && lon < 100) return "Indian Ocean";
  if (lat > 0 && lon > 100 && lon < 180) return "North Pacific Ocean";
  if (lat < 0 && lon > 100 && lon < 180) return "South Pacific Ocean";
  if (lat > 0 && lon > -80 && lon < 0) return "North Atlantic Ocean";
  if (lat < 0 && lon > -80 && lon < 20) return "South Atlantic Ocean";
  if (lat < -60) return "Southern Ocean";
  if (lat > 60) return "Arctic Ocean";
  return "Ocean";
}
