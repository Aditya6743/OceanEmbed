import { create } from 'zustand';
import type { OceanLocation, PredictionResponse, LiveArgoMarker } from '../types/ocean';

interface OceanState {
  selectedLocation: OceanLocation | null;
  selectedDate: string;
  prediction: PredictionResponse | null;
  isLoading: boolean;
  error: string | null;
  errorPosition: { x: number, y: number } | null;
  clickPosition: { x: number, y: number } | null;
  clickIntensity: number | null;
  hoveredDepth: number | null;
  autoPilotMode: boolean;
  activeHighlight: string | null;
  showArgoTubes: boolean;
  showGlobeArgo: boolean;
  selectedArgoMarker: LiveArgoMarker | null;
  setActiveHighlight: (highlight: string | null) => void;
  setSelectedDate: (date: string) => void;
  
  setLocation: (loc: OceanLocation, pos?: { x: number, y: number }, intensity?: number) => void;
  setPrediction: (data: PredictionResponse) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null, pos?: { x: number, y: number }) => void;
  setHoveredDepth: (depth: number | null) => void;
  setAutoPilotMode: (mode: boolean) => void;
  setShowArgoTubes: (show: boolean) => void;
  setShowGlobeArgo: (show: boolean) => void;
  setSelectedArgoMarker: (marker: LiveArgoMarker | null) => void;
  reset: () => void;
}

const todayStr = new Date().toISOString().split('T')[0];

export const useOceanStore = create<OceanState>((set) => ({
  selectedLocation: null,
  selectedDate: todayStr, // Default to current day on page refresh
  prediction: null,
  isLoading: false,
  error: null,
  errorPosition: null,
  clickPosition: null,
  clickIntensity: null,
  hoveredDepth: null,
  autoPilotMode: false,
  activeHighlight: null,
  showArgoTubes: false,
  showGlobeArgo: false,
  selectedArgoMarker: null,
  
  setLocation: (loc, pos, intensity) => set({ selectedLocation: loc, clickPosition: pos || null, clickIntensity: intensity || 0, prediction: null, isLoading: true, error: null, errorPosition: null }),
  setPrediction: (data) => set({ prediction: data, isLoading: false, error: null, errorPosition: null }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error, pos) => set({ error, errorPosition: pos || null, isLoading: false }),
  setHoveredDepth: (depth) => set({ hoveredDepth: depth }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setAutoPilotMode: (mode) => set({ autoPilotMode: mode }),
  setShowArgoTubes: (show) => set({ showArgoTubes: show }),
  setShowGlobeArgo: (show) => set({ showGlobeArgo: show }),
  setSelectedArgoMarker: (marker) => set({ selectedArgoMarker: marker }),
  setActiveHighlight: (highlight) => set({ activeHighlight: highlight }),
  reset: () => set({ selectedLocation: null, prediction: null, selectedArgoMarker: null, isLoading: false, error: null, errorPosition: null, clickPosition: null, clickIntensity: null }),
}));
