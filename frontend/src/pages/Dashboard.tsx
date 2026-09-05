import Navbar from '../components/Navbar';
import OceanMap from '../components/OceanMap';
import Ocean3D from '../components/Ocean3D';
import PredictionPanel from '../components/PredictionPanel';
import SurfaceData from '../components/SurfaceData';
import ValidationPanel from '../components/ValidationPanel';

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex-1 overflow-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Controls & Data */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <PredictionPanel />
          <SurfaceData />
          <ValidationPanel />
        </div>
        
        {/* Right Column - Visualizations */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="h-[400px] w-full bg-card rounded-lg border shadow-sm overflow-hidden">
            <OceanMap />
          </div>
          <div className="h-[400px] w-full bg-card rounded-lg border shadow-sm overflow-hidden flex-1">
            <Ocean3D />
          </div>
        </div>
      </div>
    </div>
  );
}
