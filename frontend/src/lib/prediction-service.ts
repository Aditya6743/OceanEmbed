import { DEFAULT_PREDICTION, type OceanPrediction } from "./ocean-data";

export type PredictionRequest = { lat: number; lon: number; date: string };

export async function requestOceanPrediction(input: PredictionRequest): Promise<OceanPrediction> {
  await new Promise((resolve) => window.setTimeout(resolve, 850));
  return {
    ...DEFAULT_PREDICTION,
    lat: input.lat,
    lon: input.lon,
    date: input.date,
  };
}