import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts';
import type { OceanProfile } from '../types/ocean';
import { useOceanStore } from '../store/oceanStore';

interface TemperatureChartProps {
  profile: OceanProfile;
  thermoclineDepth?: number;
  rmse?: number;
}


const renderCustomLegend = (props: any) => {
  const { payload } = props;
  const config: Record<string, { label: string, color: string }> = {
    temperature: { label: 'PREDICTION', color: '#22d3ee' },
    reference: { label: 'ARGO REF', color: '#a3e635' },
    tempRange: { label: 'CONFIDENCE', color: '#fbbf24' },
    gradient: { label: 'dT/dz', color: '#f59e0b' },
    speed_of_sound: { label: 'SONAR VEL', color: '#c084fc' }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 w-full pb-8">
      {payload.map((entry: any, index: number) => {
        const conf = config[entry.value];
        if (!conf) return null;
        return (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: conf.color }}></div>
            <span className="text-[10px] font-mono font-bold tracking-[0.15em]" style={{ color: conf.color }}>
              {conf.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function TemperatureChart({ profile, thermoclineDepth, rmse = 0.5 }: TemperatureChartProps) {
  const { hoveredDepth, setHoveredDepth } = useOceanStore();
  
  // 95% Confidence Interval is approx 1.96 * standard error (RMSE)
  const baseCi = rmse * 1.96;
  
  const data = profile.depth.map((depth, index) => {
    const temp = profile.temperature[index];
    
    // Calculate Thermal Gradient (dT/dz) - rate of temperature change per meter
    let gradient = 0;
    if (index < profile.depth.length - 1) {
      const dz = profile.depth[index + 1] - depth;
      const dT = temp - profile.temperature[index + 1];
      gradient = dz > 0 ? (dT / dz) : 0;
    }

    // Mathematical Realism: Confidence band narrows at surface (high sensor density) 
    // and widens in deep water (sparse data) and high gradient zones.
    const depthFactor = (depth / 1000.0) * 0.6;
    const gradientFactor = Math.min(Math.abs(gradient) * 2.5, 0.9);
    const dynamicCi = Math.max(baseCi, 0.25) + depthFactor + gradientFactor;

    return {
      depth,
      temperature: temp,
      tempRange: [Number((temp - dynamicCi).toFixed(2)), Number((temp + dynamicCi).toFixed(2))],
      gradient: Number(gradient.toFixed(4)),
      speed_of_sound: profile.speed_of_sound?.[index],
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
        margin={{ top: 35, right: 30, left: 0, bottom: 20 }}
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
        <XAxis xAxisId="sos" type="number" hide={true} domain={['auto', 'auto']} />
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
            if (name === 'speed_of_sound') return [`${Number(value).toFixed(1)} m/s`, 'ACOUSTIC SONAR SPEED'];
            return [null, null];
          }}
          labelFormatter={(label: any) => `DEPTH: ${label}m`}
          cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        
        <Legend verticalAlign="top" height={75} content={renderCustomLegend} />

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
          fill="rgba(251, 191, 36, 0.25)" 
          isAnimationActive={true}
        />

        {profile.speed_of_sound && (
          <Line xAxisId="sos" type="monotone" dataKey="speed_of_sound" stroke="#c084fc" strokeWidth={1.5} strokeDasharray="3 3" dot={false} activeDot={{ r: 3, fill: '#050505', stroke: '#c084fc', strokeWidth: 2 }} isAnimationActive={true} />
        )}
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
