import { useEffect, useState } from 'react';
import { Crosshair } from 'lucide-react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      
      if (document.body.dataset.cursorOverride === 'crosshair') {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  if (!isActive) return null;

  return (
    <div 
      className="fixed pointer-events-none z-[9999] flex items-center justify-center transition-transform duration-75 ease-out"
      style={{ 
        left: pos.x, 
        top: pos.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute animate-ping h-8 w-8 rounded-full border border-cyan-400 opacity-50" />
        <Crosshair className="text-cyan-400 w-6 h-6 animate-pulse" strokeWidth={1.5} />
      </div>
    </div>
  );
}
