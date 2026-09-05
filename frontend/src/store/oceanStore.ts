import { create } from 'zustand';
import type { OceanLocation, PredictionResponse } from '../types/ocean';

interface OceanState {
  selectedLocation: OceanLocation | null;
  prediction: PredictionResponse | null;
  isLoading: boolean;
  error: string | null;
  
  setLocation: (loc: OceanLocation) => void;
  setPrediction: (data: PredictionResponse) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useOceanStore = create<OceanState>((set) => ({
  selectedLocation: null,
  prediction: null,
  isLoading: false,
  error: null,
  
  setLocation: (loc) => set({ selectedLocation: loc, error: null }),
  setPrediction: (data) => set({ prediction: data, isLoading: false, error: null }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ selectedLocation: null, prediction: null, isLoading: false, error: null }),
}));
