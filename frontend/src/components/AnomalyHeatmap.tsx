import type { OceanProfile } from '../types/ocean';

interface AnomalyHeatmapProps {
  profile: OceanProfile;
}

export default function AnomalyHeatmap({ profile }: AnomalyHeatmapProps) {
  // Mock standard climatology (exponential decay from 28C to 4C)
  const getClimatology = (depth: number) => {
    return 4 + (28 - 4) * Math.exp(-depth / 150);
  };

  const anomalies = profile.depth.map((depth, i) => {
    const predicted = profile.temperature[i];
    const climatology = getClimatology(depth);
    return predicted - climatology;
  });

  const maxAnomaly = Math.max(...anomalies.map(Math.abs));

  const getColor = (anomaly: number) => {
    // Normalize anomaly between -1 and 1
    const normalized = anomaly / (maxAnomaly || 1);
    if (normalized > 0) {
      // Red for positive anomaly
      return `rgba(239, 68, 68, ${normalized})`;
    } else {
      // Blue for negative anomaly
      return `rgba(59, 130, 246, ${Math.abs(normalized)})`;
    }
  };

  return (
    <div className="w-8 h-full bg-black/50 border-l border-white/10 flex flex-col items-center py-2 z-10 relative">
      <div style={{ writingMode: 'vertical-rl' }} className="text-[7px] text-white/50 font-mono tracking-widest uppercase mb-2 text-center">
        Climatology Anomaly
      </div>
      <div className="flex-1 w-2 rounded-full overflow-hidden flex flex-col bg-white/5">
        {anomalies.map((anomaly, i) => (
          <div 
            key={i} 
            className="w-full flex-1" 
            style={{ backgroundColor: getColor(anomaly) }}
            title={`Depth: ${profile.depth[i]}m\nAnomaly: ${anomaly > 0 ? '+' : ''}${anomaly.toFixed(2)}°C`}
          />
        ))}
      </div>
      <div className="text-[7px] font-mono mt-2 text-white/50">
        ±{maxAnomaly.toFixed(1)}°
      </div>
    </div>
  );
}
