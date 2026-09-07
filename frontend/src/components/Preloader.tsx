import { useEffect, useState } from 'react';

const STATUS_STAGES = [
  { threshold: 95, text: "SYSTEM READY" },
  { threshold: 75, text: "RECONSTRUCTING 3D OCEAN" },
  { threshold: 55, text: "RUNNING SUBSURFACE INFERENCE" },
  { threshold: 35, text: "HARMONIZING SURFACE DATA" },
  { threshold: 15, text: "INGESTING SATELLITE TELEMETRY" },
  { threshold: 0, text: "INITIALIZING NEURAL NETWORK" },
];

const DEPTH_MARKERS = [
  { depth: '0m', p: 0 },
  { depth: '100m', p: 15 },
  { depth: '250m', p: 35 },
  { depth: '500m', p: 55 },
  { depth: '750m', p: 75 },
  { depth: '1000m', p: 95 },
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [dataStream, setDataStream] = useState('00000000');

  useEffect(() => {
    // Generate rapid changing hex data
    const dataTimer = setInterval(() => {
      setDataStream(Math.random().toString(16).substring(2, 10).toUpperCase());
    }, 40);

    const DURATION = 1200; // slightly longer to appreciate the smooth curve
    let startTime: number | null = null;
    let rAF: number;

    // Premium Ease-Out Quart function for buttery smooth deceleration
    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      
      const rawLinear = Math.min(elapsed / DURATION, 1);
      const easedProgress = easeOutQuart(rawLinear) * 100;
      
      setProgress(easedProgress);

      if (rawLinear < 1) {
        rAF = requestAnimationFrame(animate);
      } else {
        clearInterval(dataTimer);
        setDataStream('FF-READY');
        
        // Beautiful glowing pause at 100% before smoothly fading out
        setTimeout(() => setIsFadingOut(true), 300);
        setTimeout(() => onComplete(), 1100); // 800ms fade transition
      }
    };

    rAF = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rAF);
      clearInterval(dataTimer);
    };
  }, [onComplete]);

  const currentStatus = STATUS_STAGES.find(s => progress >= s.threshold)?.text || STATUS_STAGES[5].text;
  const isComplete = progress >= 100;

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden transition-all duration-[800ms] ease-in-out ${
        isFadingOut ? 'opacity-0 scale-[1.05] pointer-events-none blur-lg' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 40%, #082f49 0%, #020617 65%, #000000 100%)'
      }}
    >
      <style>{`
        .scene {
          perspective: 1200px;
          transform-style: preserve-3d;
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(-12vh); }
          50% { transform: translateY(calc(-12vh - 12px)); }
          100% { transform: translateY(-12vh); }
        }
        .block-wrapper {
          position: relative;
          width: 180px;
          height: 180px;
          transform-style: preserve-3d;
          transform: rotateX(65deg) rotateZ(45deg);
          /* NO transition on height/translate to prevent jitter against rAF */
        }
        .face-top {
          position: absolute;
          width: 180px;
          height: 180px;
          border: 1px solid rgba(34, 211, 238, 0.8);
          background: rgba(6, 182, 212, 0.15);
          background-image: 
            linear-gradient(rgba(34, 211, 238, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.6) 1px, transparent 1px);
          background-size: 20px 20px;
          box-shadow: inset 0 0 40px rgba(6, 182, 212, 0.5);
          transition: background 0.5s ease, border 0.5s ease, box-shadow 0.5s ease;
        }
        .face-bottom {
          position: absolute;
          width: 180px;
          height: 180px;
          background: rgba(6, 182, 212, 0.2);
          border: 1px solid #06b6d4;
          box-shadow: 0 0 50px rgba(34, 211, 238, 0.5);
          transition: background 0.5s ease, border 0.5s ease, box-shadow 0.5s ease;
        }
        .face-wall {
          position: absolute;
          background: linear-gradient(to bottom, rgba(6, 182, 212, 0.15), rgba(6, 182, 212, 0.4));
          border: 1px solid rgba(34, 211, 238, 0.5);
          overflow: hidden;
          backdrop-filter: blur(4px);
          transition: background 0.5s ease, border 0.5s ease;
        }
        .face-wall-x {
          width: 180px;
          top: 180px; left: 0;
          transform-origin: top;
          transform: rotateX(-90deg);
        }
        .face-wall-y {
          height: 180px;
          top: 0; left: 180px;
          transform-origin: left;
          transform: rotateY(90deg);
        }
        .scan-line {
          position: absolute;
          inset: 0;
          border-bottom: 2px solid rgba(255, 255, 255, 0.9);
          background: linear-gradient(to top, rgba(255, 255, 255, 0.3) 0%, transparent 40px);
          animation: scan 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .bg-pattern {
          background-image: 
            radial-gradient(rgba(34, 211, 238, 0.15) 1px, transparent 1px),
            radial-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px);
          background-size: 24px 24px, 96px 96px;
          background-position: 0 0, 12px 12px;
          mask-image: radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%);
        }
        .bg-grid-lines {
          background-image: 
            linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px);
          background-size: 100px 100px;
          mask-image: radial-gradient(circle at 50% 40%, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at 50% 40%, black 30%, transparent 80%);
        }
        .core-beam {
          position: absolute;
          width: 4px;
          height: var(--depth);
          background: #fff;
          top: 90px;
          left: 90px;
          transform-origin: top;
          transform: rotateX(-90deg) translateX(-50%);
          box-shadow: 0 0 30px 10px #22d3ee;
          opacity: 0.8;
          transition: opacity 0.5s ease;
        }
      `}</style>

      {/* Subtle CRT Scanlines Overlay */}
      <div className="absolute inset-0 z-[100] pointer-events-none mix-blend-overlay opacity-20"
           style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}>
      </div>

      {/* Textured Backgrounds */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-lines"></div>
        <div className="absolute inset-0 bg-pattern animate-[pulse_3s_ease-in-out_infinite]"></div>
      </div>

            {/* PROMINENT TITLE ABOVE BLOCK */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center z-[150] pointer-events-none">
        <div className="text-cyan-400 font-mono text-[10px] tracking-[0.5em] mb-2 animate-pulse opacity-80">
          NEURAL INFERENCE ENGINE
        </div>
        <div className={`text-3xl md:text-5xl font-black tracking-[0.3em] uppercase transition-all duration-700 ${isComplete ? 'drop-shadow-[0_0_40px_#fff] scale-105' : 'drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]'}`}>
          <span className="text-white">OCEAN</span>
          <span className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 transition-colors duration-700 ${isComplete ? 'from-white to-white' : ''}`}>EMBED</span>
        </div>
      </div>

      {/* Cinematic HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-20">
        <div className="flex justify-between items-start w-full">
          <div className="text-[10px] font-mono text-cyan-200/50 tracking-widest">
            <div className={`transition-colors duration-500 ${isComplete ? 'text-white font-bold' : ''}`}>SYS.INIT // v2.4.0</div>
            <div className={`mt-1 transition-colors duration-500 text-cyan-400 ${isComplete ? 'animate-none' : 'animate-pulse'}`}>
              {isComplete ? 'UPLINK ESTABLISHED' : 'UPLINK ACTIVE'}
            </div>
            <div className="mt-2 text-cyan-500/80 font-bold opacity-80">
              <span className="text-cyan-600 mr-2">HEX:</span>{dataStream}
            </div>
          </div>
          <div className="text-[10px] font-mono text-cyan-200/50 tracking-widest text-right">
            <div>LAT: 15.2001° N</div>
            <div>LON: 65.1220° E</div>
            <div className="mt-2 text-cyan-500/80">
              <span className="text-cyan-600 mr-2">OP:</span>{Math.floor(progress * 42.7)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end w-full">
          <div className={`text-[11px] font-mono tracking-[0.2em] font-medium transition-colors duration-500 ${
            isComplete ? 'text-white drop-shadow-[0_0_15px_#fff]' : 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'
          }`}>
            [ {currentStatus} ]
          </div>
          <div className={`text-2xl font-mono tracking-wider font-light transition-all duration-500 ${
            isComplete ? 'text-white scale-110 drop-shadow-[0_0_20px_#fff]' : 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]'
          }`}>
            {progress.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="scene absolute flex items-center justify-center z-10 w-full h-full">
        {/* We use Math.max to avoid negative rendering artifacts */}
        <div className="block-wrapper" style={{ '--depth': `${Math.max(progress * 3.5, 0)}px` } as any}>
          
          <div className={`face-top ${isComplete ? 'bg-cyan-200/30 border-white shadow-[0_0_80px_#22d3ee_inset]' : ''}`} style={{ transform: 'translateZ(0)' }}></div>

          {progress > 5 && (
            <div className="core-beam" style={{ height: 'calc(var(--depth) - 5px)' }}></div>
          )}

          <div className={`face-bottom ${isComplete ? 'border-white bg-cyan-300/40 shadow-[0_0_100px_#22d3ee]' : ''}`} style={{ transform: 'translateZ(calc(var(--depth) * -1))' }}></div>

          <div className={`face-wall face-wall-x ${isComplete ? 'border-white/50 bg-cyan-400/30' : ''}`} style={{ height: 'var(--depth)' }}>
            <div className="scan-line" style={{ display: isComplete ? 'none' : 'block' }}></div>
          </div>
          <div className={`face-wall face-wall-y ${isComplete ? 'border-white/50 bg-cyan-400/30' : ''}`} style={{ width: 'var(--depth)' }}>
            <div className="scan-line" style={{ display: isComplete ? 'none' : 'block' }}></div>
          </div>

        </div>
      </div>

      {/* 2D Overlay Depth Ruler */}
      <div className="absolute z-20 flex flex-col justify-between pointer-events-none" 
           style={{ height: '315px', left: 'calc(50% + 140px)', top: 'calc(50% - 12vh)', transform: 'translateY(-20px)' }}>
        
        <div className="absolute left-0 top-0 w-[1px] bg-cyan-950 h-full">
          {/* Removed height transition to perfectly track requestAnimationFrame */}
          <div className={`w-full ${
            isComplete ? 'bg-white shadow-[0_0_20px_#fff]' : 'bg-cyan-400 shadow-[0_0_12px_#22d3ee]'
          } transition-colors duration-500`} style={{ height: `${progress}%` }}></div>
        </div>

        {DEPTH_MARKERS.map((marker) => (
          <div 
            key={marker.depth}
            className={`flex items-center gap-3 transition-all duration-500 absolute left-0 ${
              progress >= marker.p ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}
            style={{ top: `${marker.p}%`, transform: 'translateY(-50%)' }}
          >
            <div className={`w-3 h-[1px] transition-colors duration-500 ${
              isComplete ? 'bg-white shadow-[0_0_10px_#fff]' : 'bg-cyan-100 shadow-[0_0_8px_#fff]'
            }`}></div>
            <span className={`text-[10px] font-mono tracking-widest font-semibold transition-colors duration-500 ${
              isComplete ? 'text-white drop-shadow-[0_0_10px_#fff]' : 'text-cyan-50 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'
            }`}>
              {marker.depth}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
