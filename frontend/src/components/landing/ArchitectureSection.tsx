import { Link } from 'react-router-dom';

const IsoPlane = ({ cx, cy, w, h, fill = "none", stroke = "rgba(255,255,255,0.3)", strokeWidth = 1, opacity = 1, filter }: any) => {
  return (
    <polygon 
      points={`${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`} 
      fill={fill} 
      stroke={stroke} 
      strokeWidth={strokeWidth}
      opacity={opacity}
      filter={filter}
    />
  );
};

export default function ArchitectureSection() {
  const w = 110;
  const h = 55;

  const cx1 = 250;
  const cy1 = 300;
  
  const cx2 = 600;
  const cy2 = 300;
  
  const cx3 = 950;
  const cy3 = 300;

  const leftPaths = [
    `M ${cx1 + w},${cy1 - 40} C ${cx1 + 180},${cy1 - 40} ${cx2 - 180},${cy2} ${cx2 - w},${cy2}`,
    `M ${cx1 + w},${cy1 - 20} C ${cx1 + 180},${cy1 - 20} ${cx2 - 180},${cy2} ${cx2 - w},${cy2}`,
    `M ${cx1 + w},${cy1} C ${cx1 + 180},${cy1} ${cx2 - 180},${cy2} ${cx2 - w},${cy2}`,
    `M ${cx1 + w},${cy1 + 20} C ${cx1 + 180},${cy1 + 20} ${cx2 - 180},${cy2} ${cx2 - w},${cy2}`,
    `M ${cx1 + w},${cy1 + 40} C ${cx1 + 180},${cy1 + 40} ${cx2 - 180},${cy2} ${cx2 - w},${cy2}`,
  ];

  const rightPaths = [
    `M ${cx2 + w},${cy2} C ${cx2 + 180},${cy2} ${cx3 - 180},${cy3 - 70} ${cx3 - w},${cy3 - 70}`,
    `M ${cx2 + w},${cy2} C ${cx2 + 180},${cy2} ${cx3 - 180},${cy3 - 35} ${cx3 - w},${cy3 - 35}`,
    `M ${cx2 + w},${cy2} C ${cx2 + 180},${cy2} ${cx3 - 180},${cy3} ${cx3 - w},${cy3}`,
    `M ${cx2 + w},${cy2} C ${cx2 + 180},${cy2} ${cx3 - 180},${cy3 + 35} ${cx3 - w},${cy3 + 35}`,
    `M ${cx2 + w},${cy2} C ${cx2 + 180},${cy2} ${cx3 - 180},${cy3 + 70} ${cx3 - w},${cy3 + 70}`,
  ];

  return (
    <section id="architecture" className="w-full relative min-h-[900px] h-[100vh] bg-transparent border-t border-white/10 flex flex-col justify-center items-center overflow-hidden">
      
      <style>
        {`
          @keyframes flowPulse {
            to { stroke-dashoffset: -400; }
          }
          .data-pulse {
            stroke-dasharray: 40 160;
            animation: flowPulse 2s linear infinite;
          }
        `}
      </style>

      {/* Subtle depth-of-field background blur revealing the waves beneath */}
      <div className="absolute inset-0 z-0 bg-transparent backdrop-blur-[12px] pointer-events-none" />

      {/* Header Text */}
      <div className="absolute top-24 left-10 md:left-24 z-20 pointer-events-none">
        <h2 className="text-5xl md:text-7xl font-light tracking-tight leading-[1.05]">
          <span className="text-white">Observe the surface.</span><br />
          <span className="text-cyan-400/80">Predict the deep.</span>
        </h2>
        <div className="w-16 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent mt-8" />
      </div>

      <div className="absolute top-24 right-10 md:right-24 z-20 flex flex-col items-end text-right">
        <p className="text-white/60 text-sm mb-6 max-w-[300px] leading-relaxed font-sans">
          From multi-source satellite observations to volumetric subsurface profiles.<br />
          One connected learning framework.
        </p>
        <Link 
          to="/architecture" 
          className="group flex items-center gap-3 px-7 py-3.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-400 hover:text-black transition-all text-xs font-mono font-bold tracking-widest text-cyan-400   shadow-[0_0_20px_rgba(34,211,238,0.15)]"
        >
          EXPLORE ARCHITECTURE
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        </Link>
      </div>

      {/* SVG Diagram Area */}
      <div className="relative w-full max-w-[1400px] mt-20 z-10">
        <svg viewBox="0 0 1200 600" className="w-full h-auto drop-shadow-2xl">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient id="flowLineDim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* CONNECTION PATHS (Left to Center) */}
          <g>
            {leftPaths.map((d, i) => (
              <g key={`l-${i}`}>
                {/* Static dim background track */}
                <path d={d} stroke="url(#flowLineDim)" fill="none" strokeWidth="1.5" />
                {/* Animated glowing pulses */}
                <path 
                  d={d} 
                  stroke="url(#flowLine)" 
                  fill="none" 
                  strokeWidth={i === 2 ? 3 : 1.5} 
                  className="data-pulse" 
                  style={{ animationDelay: `${i * 0.2}s` }} 
                />
              </g>
            ))}
          </g>

          {/* CONNECTION PATHS (Center to Right) */}
          <g>
            {rightPaths.map((d, i) => (
              <g key={`r-${i}`}>
                <path d={d} stroke="url(#flowLineDim)" fill="none" strokeWidth="1.5" />
                <path 
                  d={d} 
                  stroke="url(#flowLine)" 
                  fill="none" 
                  strokeWidth={i === 2 ? 3 : 1.5} 
                  className="data-pulse" 
                  style={{ animationDelay: `${i * 0.3}s` }} 
                />
              </g>
            ))}
          </g>

          {/* 1. OBSERVE (Left Stack) - 5 features */}
          <g>
            {Array.from({ length: 5 }).map((_, i) => (
              <IsoPlane 
                key={i} 
                cx={cx1} 
                cy={cy1 + 40 - (i * 20)} 
                w={w} 
                h={h} 
                stroke={i === 2 ? "#22d3ee" : "rgba(255,255,255,0.3)"} 
                fill="rgba(2, 6, 23, 0.7)" 
                strokeWidth={i === 2 ? 2 : 1}
              />
            ))}
            
            {/* Shifted text downwards by 30px to guarantee no collisions */}
            <text x={cx1} y={cy1 + 160} textAnchor="middle" fill="white" fontSize="18" fontWeight="500" letterSpacing="1">OBSERVE</text>
            <text x={cx1} y={cy1 + 185} textAnchor="middle" fill="#22d3ee" fontSize="12" fontFamily="monospace" letterSpacing="0.5">5 SURFACE INPUTS</text>
            <text x={cx1} y={cy1 + 205} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">SST · SSS · SSH · U · V</text>
          </g>

          {/* 2. UNDERSTAND (Center Concentric Core) */}
          <g>
            {/* Branding Text above the diamond */}
            <g transform={`translate(${cx2}, ${cy2 - 120})`}>
              <text x="0" y="0" textAnchor="middle" fill="#22d3ee" fontSize="12" fontFamily="monospace" fontWeight="bold" letterSpacing="1">OCEANEMBED V6 HYBRID ENGINE</text>
            </g>

            {/* Outer rings */}
            <IsoPlane cx={cx2} cy={cy2} w={w * 1.2} h={h * 1.2} stroke="rgba(34,211,238,0.15)" fill="rgba(2, 6, 23, 0.4)" />
            <IsoPlane cx={cx2} cy={cy2} w={w * 0.9} h={h * 0.9} stroke="rgba(34,211,238,0.3)" fill="rgba(2, 6, 23, 0.6)" />
            <IsoPlane cx={cx2} cy={cy2} w={w * 0.6} h={h * 0.6} stroke="rgba(34,211,238,0.6)" fill="rgba(2, 6, 23, 0.8)" />
            
            {/* Glowing Inner Core */}
            <IsoPlane cx={cx2} cy={cy2} w={w * 0.3} h={h * 0.3} stroke="#ffffff" fill="#22d3ee" strokeWidth="2" filter="url(#glow)" />
            
            <text x={cx2} y={cy2 + 160} textAnchor="middle" fill="white" fontSize="18" fontWeight="500" letterSpacing="1">UNDERSTAND</text>
            <text x={cx2} y={cy2 + 185} textAnchor="middle" fill="#22d3ee" fontSize="12" fontFamily="monospace" letterSpacing="0.5">SATELLITE EMBEDDINGS</text>
            <text x={cx2} y={cy2 + 205} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">CNN + ViT + ATTENTION + PINN</text>
          </g>

          {/* 3. RECONSTRUCT (Right Stack) - 15 Depths */}
          <g>
            {Array.from({ length: 15 }).map((_, i) => {
              const depthOpacity = 1 - (i * 0.05);
              const color = `rgba(34,211,238, ${depthOpacity})`;
              return (
                <IsoPlane 
                  key={i} 
                  cx={cx3} 
                  cy={cy3 + 70 - (i * 10)} 
                  w={w} 
                  h={h} 
                  stroke={color} 
                  fill={`rgba(2, 6, 23, ${0.4 + i*0.02})`}
                  strokeWidth={1}
                />
              )
            })}
            
            <text x={cx3} y={cy3 + 160} textAnchor="middle" fill="white" fontSize="18" fontWeight="500" letterSpacing="1">RECONSTRUCT</text>
            <text x={cx3} y={cy3 + 185} textAnchor="middle" fill="#22d3ee" fontSize="12" fontFamily="monospace" letterSpacing="0.5">15 DEPTH LEVELS</text>
            <text x={cx3} y={cy3 + 205} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">0M — 1000M VOLUME</text>
          </g>
        </svg>
      </div>

    </section>
  );
}
