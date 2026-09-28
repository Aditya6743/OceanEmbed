import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { HistoryDataPoint } from '../lib/api';

interface HistoryChartProps {
  data: HistoryDataPoint[];
}

export default function HistoryChart({ data }: HistoryChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-white/50 text-xs font-mono flex items-center justify-center h-full">NO HISTORICAL DATA AVAILABLE</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorSst" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5}/>
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="#888" 
          tick={{ fill: '#888', fontSize: 8 }}
          tickFormatter={(val) => {
            if (!val) return '';
            if (val.includes('-')) {
                // If it's YYYY-MM-DD, parse date and month
                const parts = val.split('-');
                if (parts.length >= 3) {
                    const day = parseInt(parts[2]);
                    const monthIdx = parseInt(parts[1]) - 1;
                    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
                    return `${day} ${months[monthIdx]}`;
                }
            }
            return val;
          }}
          axisLine={{ stroke: '#ffffff', opacity: 0.2 }}
          tickLine={false}
          minTickGap={20}
        />
        <YAxis 
          domain={['auto', 'auto']} 
          stroke="#888" 
          tick={{ fill: '#888', fontSize: 8 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '4px', backdropFilter: 'blur(8px)' }}
          itemStyle={{ fontSize: '10px', fontFamily: 'monospace', color: '#a855f7' }}
          labelStyle={{ color: '#888', marginBottom: '4px', fontSize: '9px', fontFamily: 'monospace' }}
          formatter={(value: any) => [`${Number(value).toFixed(2)} °C`, 'SST']}
        />
        <Area 
          type="monotone" 
          dataKey="sst" 
          stroke="#a855f7" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorSst)" 
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
