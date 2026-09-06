import type { OceanLocation, PredictionResponse } from '../types/ocean';

export function getMockPrediction(location: OceanLocation): PredictionResponse {
  // The exact 15 standard depths required by SIH26066
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
    
    // Slight realistic noise for reference Argo data
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
  // Mock correlation 0.95 - 0.99
  const correlation = 0.95 + Math.random() * 0.04;

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
    estimated_thermocline: Math.round(mld / 5) * 5
  };
}
