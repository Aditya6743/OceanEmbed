import Plot from 'react-plotly.js';
import { useOceanStore } from '../store/oceanStore';
import { mockArgoComparison } from '../data/mockOceanData';

export default function TemperatureChart() {
  const prediction = useOceanStore(state => state.prediction);

  if (!prediction) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white/40 bg-card rounded-xl border border-white/5">
        <p className="text-sm font-mono uppercase tracking-widest text-white/30">Awaiting Prediction Data</p>
      </div>
    );
  }

  const depths = prediction.profile.depth;
  const temps = prediction.profile.temperature;

  return (
    <div className="w-full h-full bg-card rounded-xl border border-white/5 relative overflow-hidden flex flex-col">
      <div className="p-4 border-b border-white/5 bg-white/[0.01]">
        <h2 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
          Temperature vs Depth
        </h2>
      </div>
      
      <div className="flex-1 w-full relative">
        <Plot
          data={[
            {
              x: temps,
              y: depths,
              type: 'scatter',
              mode: 'lines+markers',
              name: 'OceanEmbed',
              line: { color: '#22d3ee', width: 2 }, // cyan-400
              marker: { size: 5, color: '#0891b2' }, // cyan-600
              hovertemplate: 'Depth: %{y}m<br>Temperature: %{x}°C<extra></extra>',
            },
            {
              x: mockArgoComparison.argo_temp,
              y: mockArgoComparison.depth,
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Argo Reference',
              line: { color: '#64748b', width: 1.5, dash: 'dash' }, // slate-500
              marker: { size: 4, color: '#475569' }, // slate-600
              hovertemplate: 'Depth: %{y}m<br>Argo Temp: %{x}°C<extra></extra>',
            }
          ]}
          layout={{
            autosize: true,
            margin: { l: 50, r: 30, t: 30, b: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { color: '#64748b', family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', size: 10 },
            xaxis: {
              title: 'Temperature (°C)',
              gridcolor: 'rgba(255,255,255,0.03)',
              zerolinecolor: 'rgba(255,255,255,0.05)',
              side: 'top',
              tickfont: { color: '#94a3b8' }
            },
            yaxis: {
              title: 'Depth (m)',
              autorange: 'reversed',
              gridcolor: 'rgba(255,255,255,0.03)',
              zerolinecolor: 'rgba(255,255,255,0.05)',
              tickfont: { color: '#94a3b8' }
            },
            legend: {
              orientation: 'h',
              y: -0.15,
              x: 0.5,
              xanchor: 'center',
              font: { size: 10, color: '#94a3b8' }
            },
            hovermode: 'closest'
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>
    </div>
  );
}
