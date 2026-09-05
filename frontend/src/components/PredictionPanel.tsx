import { useState } from 'react';
import { useOceanStore } from '../store/oceanStore';
import { getPrediction } from '../api/oceanembed';
import { Loader2, Play, Crosshair, Calendar } from 'lucide-react';

export default function PredictionPanel() {
  const { selectedLocation, setLocation, setPrediction, setIsLoading, isLoading } = useOceanStore();
  const [loadingStage, setLoadingStage] = useState('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedLocation) {
      setLocation({ ...selectedLocation, date: e.target.value });
    }
  };

  const handleReconstruct = async () => {
    if (!selectedLocation) return;
    
    setIsLoading(true);
    
    const stages = [
      'Reading satellite observations...',
      'Preparing surface features...',
      'Running OceanEmbed...',
      'Generating depth profile...'
    ];
    
    for (let i = 0; i < stages.length; i++) {
      setLoadingStage(stages[i]);
      await new Promise(r => setTimeout(r, 600));
    }
    
    try {
      const data = await getPrediction(
        selectedLocation.latitude, 
        selectedLocation.longitude, 
        selectedLocation.date
      );
      setPrediction(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="bg-card border border-white/5 rounded-xl overflow-hidden relative">
      <div className="p-4 border-b border-white/5 bg-white/[0.01]">
        <h2 className="text-[10px] font-mono font-bold text-white tracking-widest uppercase flex items-center gap-2">
          <Crosshair className="w-3 h-3" />
          Target Location
        </h2>
      </div>
      
      <div className="p-5">
        {selectedLocation ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-1">LATITUDE</div>
                <div className="text-white font-mono text-sm">{selectedLocation.latitude.toFixed(2)}° N</div>
              </div>
              <div>
                <div className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-1">LONGITUDE</div>
                <div className="text-white font-mono text-sm">{selectedLocation.longitude.toFixed(2)}° E</div>
              </div>
            </div>
            
            <div>
              <label className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-1 block flex items-center gap-1">
                <Calendar className="w-3 h-3" /> DATE
              </label>
              <input 
                type="date" 
                value={selectedLocation.date}
                onChange={handleDateChange}
                className="w-full bg-white/[0.02] border border-white/10 rounded px-3 py-2 text-white/80 focus:outline-none focus:border-cyan-500/50 font-mono text-xs transition-colors"
              />
            </div>
            
            <button 
              onClick={handleReconstruct}
              disabled={isLoading}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs tracking-wider rounded flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(8,145,178,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{loadingStage}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  RECONSTRUCT SUBSURFACE
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-4">No location selected.</p>
            <button 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] tracking-widest font-mono rounded border border-white/10 transition-colors"
              onClick={() => window.location.href = '/'}
            >
              RETURN TO GLOBE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
