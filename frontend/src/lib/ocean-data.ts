export type ProfilePoint = { depth: number; temp: number };

export type OceanPrediction = {
  lat: number;
  lon: number;
  date: string;
  surfaceData: { sst: number; ssh: number; sss: number };
  profile: ProfilePoint[];
  referenceProfile: ProfilePoint[] | null;
  metrics: { rmse: number | null; mae: number | null };
  modelVersion: string;
};

export const DEFAULT_LOCATION = { lat: -20, lon: 80 };
export const DEFAULT_DATE = "2026-09-04";

export const DEFAULT_PREDICTION: OceanPrediction = {
  ...DEFAULT_LOCATION,
  date: DEFAULT_DATE,
  surfaceData: { sst: 28.4, ssh: 0.42, sss: 35.1 },
  profile: [
    { depth: 0, temp: 28.4 },
    { depth: 50, temp: 26.1 },
    { depth: 100, temp: 22.8 },
    { depth: 200, temp: 15.2 },
    { depth: 500, temp: 8.4 },
    { depth: 1000, temp: 4.2 },
    { depth: 2000, temp: 2.1 },
  ],
  referenceProfile: null,
  metrics: { rmse: null, mae: null },
  modelVersion: "v1.0",
};

export function interpolateTemperature(profile: ProfilePoint[], depth: number) {
  if (profile.length === 0) return 0;
  const first = profile[0]!;
  if (depth <= first.depth) return first.temp;
  const last = profile[profile.length - 1]!;
  if (depth >= last.depth) return last.temp;

  for (let index = 1; index < profile.length; index += 1) {
    const upper = profile[index - 1]!;
    const lower = profile[index]!;
    if (depth <= lower.depth) {
      const progress = (depth - upper.depth) / (lower.depth - upper.depth);
      return upper.temp + (lower.temp - upper.temp) * progress;
    }
  }
  return last.temp;
}

export function getDepthZone(depth: number) {
  if (depth < 100) return "Surface Layer";
  if (depth < 500) return "Thermocline";
  if (depth < 1000) return "Deep Water";
  return "Abyssal";
}

export function getProfileStats(profile: ProfilePoint[]) {
  const temperatures = profile.map(({ temp }) => temp);
  return {
    min: Math.min(...temperatures),
    max: Math.max(...temperatures),
    maxDepth: Math.max(...profile.map(({ depth }) => depth)),
  };
}