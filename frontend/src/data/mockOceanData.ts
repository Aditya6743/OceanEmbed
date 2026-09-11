import type { OceanLocation, PredictionResponse, ArgoFloat } from '../types/ocean';
function generateArgoFloats(location: OceanLocation, baseTemperatures: number[], depths: number[]): ArgoFloat[] {
  const floats: ArgoFloat[] = [];
    const offsets = [
    { id: 'ARGO-4902501', dlat: 0.3, dlon: -0.4 },
    { id: 'ARGO-2901862', dlat: -0.5, dlon: 0.2 },
    { id: 'ARGO-6903047', dlat: 0.1, dlon: 0.5 },
  ];
  for (const offset of offsets) {
    const temperatures = baseTemperatures.map((t, i) => {
      const depthFactor = 1 + depths[i] / 2000;
      const noise = (Math.random() - 0.5) * 0.6 * depthFactor;
      return Number((t + noise).toFixed(3));
    });
    floats.push({
      id: offset.id,
      lat: location.latitude + offset.dlat,
      lon: location.longitude + offset.dlon,
      depths: [...depths],
      temperatures,
    });
  }
  return floats;
}
export function getMockPrediction(location: OceanLocation): PredictionResponse {
  const depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];
  const latFactor = 1 - Math.min(Math.abs(location.latitude) / 90, 1);
  const surfaceTemp = 15 + (latFactor * 15) + (Math.random() * 2 - 1); // 15 to 30 C
  const mld = 30 + Math.random() * 70; // Mixed layer 30-100m
  const temperatures: number[] = [];
  const referenceTemperatures: number[] = [];
  let totalSquaredError = 0;
  let totalError = 0;
  let totalAbsoluteError = 0;
  depths.forEach(depth => {
    let temp = 0;
    if (depth <= mld) {
      temp = surfaceTemp - (depth / mld) * 0.2;
    } else if (depth <= 500) {
      const thermoclineDepth = depth - mld;
      const drop = (surfaceTemp - 6) * (1 - Math.exp(-thermoclineDepth / 150));
      temp = surfaceTemp - drop;
    } else {
      const deepDepth = depth - 500;
      const tempAt500 = surfaceTemp - (surfaceTemp - 6) * (1 - Math.exp(-(500 - mld) / 150));
      temp = Math.max(tempAt500 - (deepDepth / 500) * 3, 2.5);
    }
        const error = (Math.random() - 0.5) * 0.8;
    const refTemp = temp + error;
    temperatures.push(temp);
    referenceTemperatures.push(refTemp);
    totalSquaredError += error * error;
    totalError += error;
    totalAbsoluteError += Math.abs(error);
  });
  const rmse = Math.sqrt(totalSquaredError / depths.length);
  const bias = totalError / depths.length;
  const mae = totalAbsoluteError / depths.length;
  const correlation = 0.95 + Math.random() * 0.04;
  const argoFloats = generateArgoFloats(location, referenceTemperatures, depths);
  return {
    location,
    surface_data: {
      sst: surfaceTemp,
      ssh: (Math.random() * 2 - 1) * 0.5,
      sss: 33 + Math.random() * 4,
      current_u: (Math.random() - 0.5) * 2,
      current_v: (Math.random() - 0.5) * 2,
      wind_u: (Math.random() - 0.5) * 15,
      wind_v: (Math.random() - 0.5) * 15,
    },
    profile: {
      depth: depths,
      temperature: temperatures,
      reference_temperature: referenceTemperatures
    },
    metrics: {
      rmse,
      mae,
      bias,
      correlation
    },
    model_version: 'v1.0.0-rc2',
    estimated_thermocline: Math.round(mld / 5) * 5,
    argo_floats: argoFloats
  };
}

