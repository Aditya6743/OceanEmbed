import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Context,
  type ReactNode,
} from "react";
import { DEFAULT_PREDICTION, type OceanPrediction } from "./ocean-data";

type PredictionContextValue = {
  prediction: OceanPrediction;
  setPrediction: (prediction: OceanPrediction) => void;
  resetPrediction: () => void;
};

type PredictionContextGlobal = typeof globalThis & {
  __oceanEmbedPredictionContext?: Context<PredictionContextValue | null>;
};

// TanStack route splitting can evaluate this module through more than one
// module URL in development. Keep one context identity so the provider and
// every split route always refer to the same React context object.
const predictionContextGlobal = globalThis as PredictionContextGlobal;
const PredictionContext =
  predictionContextGlobal.__oceanEmbedPredictionContext ??
  createContext<PredictionContextValue | null>(null);

predictionContextGlobal.__oceanEmbedPredictionContext = PredictionContext;

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [prediction, setPrediction] = useState(DEFAULT_PREDICTION);
  const value = useMemo(
    () => ({ prediction, setPrediction, resetPrediction: () => setPrediction(DEFAULT_PREDICTION) }),
    [prediction],
  );
  return <PredictionContext.Provider value={value}>{children}</PredictionContext.Provider>;
}

export function usePrediction() {
  const context = useContext(PredictionContext);
  if (!context) throw new Error("usePrediction must be used within PredictionProvider");
  return context;
}