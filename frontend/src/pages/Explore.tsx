import PredictionPanel from '../components/PredictionPanel';
import SurfaceData from '../components/SurfaceData';
import ValidationPanel from '../components/ValidationPanel';
import OceanMap from '../components/OceanMap';
import Ocean3D from '../components/Ocean3D';
import TemperatureChart from '../components/TemperatureChart';

export default function Explore() {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-background pt-20">
      
      {/* Left Column - Controls & Surface Data */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <PredictionPanel />
        <SurfaceData />
      </div>
      
      {/* Middle Column - Map & 3D Ocean Block */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="h-[250px] w-full">
          <OceanMap />
        </div>
        <div className="flex-1 w-full min-h-[400px]">
          <Ocean3D />
        </div>
      </div>

      {/* Right Column - Validation Graph & Comparison */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="h-[450px] w-full">
          <TemperatureChart />
        </div>
        
        <ValidationPanel />
      </div>
      
    </div>
  );
}
