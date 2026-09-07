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
    
    // Calculate Thermal Gradient (dT/dz) - rate of temperature change per meter
    let gradient = 0;
    if (index < profile.depth.length - 1) {
      const dz = profile.depth[index + 1] - depth;
      const dT = temp - profile.temperature[index + 1];
      gradient = dz > 0 ? (dT / dz) : 0;
    }

    return {
      depth,
      temperature: temp,
      tempRange: [Number((temp - ci).toFixed(2)), Number((temp + ci).toFixed(2))],
      gradient: Number(gradient.toFixed(4)),
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
            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05}/>
          </linearGradient>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.0}/>
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.4}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} horizontal={true} vertical={true} />
        
        {/* Primary Axis: Temperature */}
        <XAxis 
          xAxisId="temp"
          type="number" 
          domain={['auto', 'auto']} 
          stroke="#888" 
          tick={{ fill: '#888', fontSize: 10 }}
          axisLine={{ stroke: '#ffffff', opacity: 0.2 }}
          tickLine={{ stroke: '#ffffff', opacity: 0.2 }}
          label={{ value: 'Temperature (°C)', position: 'bottom', fill: '#888', fontSize: 10, offset: 0 }}
        />
        
        {/* Secondary Axis: Thermal Gradient (dT/dz) */}
        <XAxis 
          xAxisId="gradient"
          type="number" 
          orientation="top"
          domain={[0, 'auto']} 
          stroke="#f59e0b" 
          tick={{ fill: '#f59e0b', fontSize: 10, opacity: 0.7 }}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Thermal Gradient (dT/dz)', position: 'top', fill: '#f59e0b', fontSize: 10, offset: 0, opacity: 0.7 }}
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
            if (name === 'tempRange') return [`${value[0]} to ${value[1]} °C`, '±95% CONFIDENCE'];
            if (name === 'gradient') return [`${Number(value).toFixed(4)} °C/m`, 'THERMAL GRADIENT'];
            return [null, null];
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
            if (value === 'temperature') return <span className="text-cyan-400/80 tracking-widest">PREDICTION</span>;
            if (value === 'reference') return <span className="text-lime-400/80 tracking-widest">ARGO REF</span>;
            if (value === 'tempRange') return <span className="text-white/30 tracking-widest">CONFIDENCE</span>;
            if (value === 'gradient') return <span className="text-amber-500/80 tracking-widest">dT/dz</span>;
            return null;
          }}
        />

        {thermoclineDepth !== undefined && (
          <ReferenceLine y={thermoclineDepth} stroke="#ef4444" strokeOpacity={0.4} strokeDasharray="3 3" xAxisId="temp" />
        )}
        
        {hoveredDepth !== null && (
          <ReferenceLine y={hoveredDepth} stroke="#22d3ee" strokeOpacity={0.6} xAxisId="temp" />
        )}
        
        {/* 1. Thermodynamic Gradient (Secondary Axis) */}
        <Area 
          xAxisId="gradient"
          type="monotone" 
          dataKey="gradient" 
          stroke="#f59e0b"
          strokeWidth={2} 
          strokeOpacity={0.5}
          fill="url(#colorGradient)" 
          isAnimationActive={true}
        />

        {/* 2. Confidence Interval Area (tempRange) */}
        <Area 
          xAxisId="temp"
          type="monotone" 
          dataKey="tempRange" 
          stroke="none" 
          fill="url(#colorTemp)" 
          isAnimationActive={true}
        />

        {profile.reference_temperature && (
          <Line 
            xAxisId="temp"
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
          xAxisId="temp"
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
