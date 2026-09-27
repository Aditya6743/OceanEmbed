import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

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
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white mb-2">Desktop Recommended</h2>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          You are viewing the basic mobile version. For the full, immersive 3D ocean reconstruction experience, please open this link on a desktop browser.
        </p>
        <button 
          onClick={() => setDismissed(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full"
        >
          Continue Anyway
        </button>
      </div>
    </div>
  );
}
