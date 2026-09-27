import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';

export default function MobileWarningOverlay() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if the screen is mobile-sized
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl max-w-sm text-center shadow-2xl relative">
        <Layers className="w-12 h-12 text-cyan-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white mb-2">OceanEmbed Mobile</h2>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          Welcome to the mobile interface. Heavy background rendering has been disabled for performance, but full 3D prediction models remain fully functional. Use a desktop browser for the complete immersive experience.
        </p>
        <button 
          onClick={() => setDismissed(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full"
        >
          Initialize Mobile View
        </button>
      </div>
    </div>
  );
}
