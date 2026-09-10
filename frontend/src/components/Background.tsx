import { useEffect, useRef } from 'react';
import LiquidEther from './LiquidEther';

export default function Background() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none" 
      ref={containerRef}
      style={{ backgroundColor: '#020202' }}
    >
      
      {/* LiquidEther without ANY extra wrappers or opacities */}
      <LiquidEther
        colors={['#00E5FF', '#0077FF', '#00FFAA']}
        mouseForce={20}
        cursorSize={100}
        isViscous={false}
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={2.2}
      />

      {/* Static Fallback Grid */}
      <div 
        className="absolute inset-0 opacity-[0.1] mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00E5FF 1px, transparent 1px),
            linear-gradient(to bottom, #00E5FF 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          WebkitMaskImage: `radial-gradient(circle 300px at var(--mouse-x, -100px) var(--mouse-y, -100px), black, transparent 100%)`,
          maskImage: `radial-gradient(circle 300px at var(--mouse-x, -100px) var(--mouse-y, -100px), black, transparent 100%)`
        }}
      />
    </div>
  );
}
