import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts';
import type { OceanProfile } from '../types/ocean';
import { useOceanStore } from '../store/oceanStore';

interface TemperatureChartProps {
  profile: OceanProfile;
  thermoclineDepth?: number;
  rmse?: number;
}

export default function TemperatureChart({ profile, thermoclineDepth, rmse = 0.5 }: TemperatureChartProps) {
  const { hoveredDepth, setHoveredDepth } = useOceanStore();
  
  // 95% Confidence Interval is approx 1.96 * standard error (RMSE)
  const ci = rmse * 1.96;
  
  const data = profile.depth.map((depth, index) => {
    const temp = profile.temperature[index];
    return {
      depth,
      temperature: temp,
      temp_min: Number((temp - ci).toFixed(2)),
      temp_max: Number((temp + ci).toFixed(2)),
      reference: profile.reference_temperature?.[index]
    };
  });

  const handleMouseMove = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      setHoveredDepth(state.activePayload[0].payload.depth);
    }
  };

  const handleMouseLeave = () => {
    setHoveredDepth(null);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id="colorTemp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} horizontal={true} vertical={true} />
        
        <XAxis 
          type="number" 
          domain={['auto', 'auto']} 
          stroke="#888" 
          tick={{ fill: '#888', fontSize: 10 }}
          axisLine={{ stroke: '#ffffff', opacity: 0.2 }}
          tickLine={{ stroke: '#ffffff', opacity: 0.2 }}
          label={{ value: 'Temperature (°C)', position: 'bottom', fill: '#888', fontSize: 10, offset: 0 }}
        />
        
        <YAxis 
          type="number" 
          dataKey="depth" 
          reversed={true} 
          domain={[0, 1000]} 
          stroke="#888" 
          tick={{ fill: '#888', fontSize: 10 }}
          axisLine={{ stroke: '#ffffff', opacity: 0.2 }}
          tickLine={{ stroke: '#ffffff', opacity: 0.2 }}
          label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: '#888', fontSize: 10, offset: 15 }}
        />
        
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(8px)' }}
          itemStyle={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold' }}
          labelStyle={{ color: '#888', marginBottom: '8px', fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase' }}
          formatter={(value: any, name: any) => {
            if (name === 'temperature') return [`${Number(value).toFixed(2)} °C`, 'PREDICTION'];
            if (name === 'reference') return [`${Number(value).toFixed(2)} °C`, 'ARGO GROUND TRUTH'];
            return [null, null]; // Hide min/max from tooltip clutter
          }}
          labelFormatter={(label: any) => `DEPTH: ${label}m`}
          cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        
        <Legend 
          verticalAlign="top" 
          height={36} 
          iconType="circle"
          wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#888' }}
          formatter={(value) => {
            if (value === 'temperature') return <span className="text-white/50 tracking-widest">PREDICTION ±95% CI</span>;
            if (value === 'reference') return <span className="text-white/50 tracking-widest">REFERENCE</span>;
            return null; // hide min/max
          }}
        />

        {thermoclineDepth !== undefined && (
          <ReferenceLine y={thermoclineDepth} stroke="#ef4444" strokeOpacity={0.4} strokeDasharray="3 3" />
        )}
        
        {hoveredDepth !== null && (
          <ReferenceLine y={hoveredDepth} stroke="#22d3ee" strokeOpacity={0.6} />
        )}
        
        {/* Confidence Interval Band */}
        <Area 
          type="monotone" 
          dataKey="temp_max" 
          stroke="none" 
          fill="url(#colorTemp)" 
          isAnimationActive={true}
        />
        <Area 
          type="monotone" 
          dataKey="temp_min" 
          stroke="none" 
          fill="#000000" // Mask out the bottom half so it looks like a band
          isAnimationActive={true}
        />

        {profile.reference_temperature && (
          <Line 
            type="monotone" 
            dataKey="reference" 
            stroke="#a3e635" 
            strokeWidth={1.5} 
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 3, fill: '#050505', stroke: '#a3e635', strokeWidth: 2 }}
            isAnimationActive={true}
          />
        )}

        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#22d3ee" 
          strokeWidth={3} 
          dot={false}
          activeDot={{ r: 5, fill: '#050505', stroke: '#22d3ee', strokeWidth: 2 }}
          isAnimationActive={true}
          animationDuration={1500}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
