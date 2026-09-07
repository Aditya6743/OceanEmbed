import { create } from 'zustand';
import type { OceanLocation, PredictionResponse } from '../types/ocean';

interface OceanState {
  selectedLocation: OceanLocation | null;
  selectedDate: string;
  prediction: PredictionResponse | null;
  isLoading: boolean;
  error: string | null;
  errorPosition: { x: number, y: number } | null;
  hoveredDepth: number | null;
  autoPilotMode: boolean;
  activeHighlight: string | null;
  setActiveHighlight: (highlight: string | null) => void;
  setSelectedDate: (date: string) => void;
  
  setLocation: (loc: OceanLocation) => void;
  setPrediction: (data: PredictionResponse) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null, pos?: { x: number, y: number }) => void;
  setHoveredDepth: (depth: number | null) => void;
  setAutoPilotMode: (mode: boolean) => void;
  reset: () => void;
}

export const useOceanStore = create<OceanState>((set) => ({
  selectedLocation: null,
  selectedDate: '2026-05-01', // Lock to a date that works with our training data for the demo
  prediction: null,
  isLoading: false,
  error: null,
  errorPosition: null,
  hoveredDepth: null,
  autoPilotMode: false,
  activeHighlight: null,
  
  setLocation: (loc) => set({ selectedLocation: loc, prediction: null, error: null, errorPosition: null }),
  setPrediction: (data) => set({ prediction: data, isLoading: false, error: null, errorPosition: null }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error, pos) => set({ error, errorPosition: pos || null, isLoading: false }),
  setHoveredDepth: (depth) => set({ hoveredDepth: depth }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setAutoPilotMode: (mode) => set({ autoPilotMode: mode }),
  setActiveHighlight: (highlight) => set({ activeHighlight: highlight }),
  reset: () => set({ selectedLocation: null, prediction: null, isLoading: false, error: null, errorPosition: null }),
}));
