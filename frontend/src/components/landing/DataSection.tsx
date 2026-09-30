import { Grid, Calendar, MapPin } from 'lucide-react';

export default function DataSection() {
  return (
    <section id="data" className="w-full py-24 relative z-10 bg-transparent font-sans overflow-hidden">
      
      <div className="container mx-auto px-4 max-w-[1500px] relative z-10">
        
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}
        <div className="mb-24 text-center flex flex-col items-center">
          <div className="text-sm font-mono text-cyan-400 font-bold uppercase tracking-[0.25em] mb-4 flex items-center justify-center gap-4">
             <div className="w-8 h-[1px] bg-cyan-900"></div> 
             DATA INGESTION
             <div className="w-8 h-[1px] bg-cyan-900"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Every prediction starts at the surface.
          </h2>
          <p className="text-slate-400 text-lg font-light max-w-2xl">
            OceanEmbed fuses multi-source surface observations before reconstructing the<br/>hidden ocean below.
          </p>
        </div>

        {/* ================================================== */}
        {/* DESKTOP PIPELINE (STRICT FLEXBOX LAYOUT) */}
        {/* ================================================== */}
        <div className="hidden lg:flex w-full h-[450px] items-center justify-between relative z-10 pointer-events-none select-none">
           
           {/* 1. LEFT - SURFACE OBSERVATIONS (10%) */}
           <div className="w-[10%] shrink-0 h-[240px] relative z-20">
              {[
                { label: 'SST', color: '#f97316', y: '0%' },
                { label: 'SSS', color: '#3b82f6', y: '25%' },
                { label: 'SSH', color: '#22d3ee', y: '50%' },
                { label: 'CURRENTS', color: '#c084fc', y: '75%' },
                { label: 'WINDS', color: '#bae6fd', y: '100%' }
              ].map((item) => (
                <div 
                  key={item.label} 
                  className="absolute left-0 w-full flex items-center justify-between -translate-y-1/2 pr-2"
                  style={{ top: item.y }}
                >
                   <span className="text-white font-mono text-xs font-bold tracking-widest">{item.label}</span>
                   <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" style={{ backgroundColor: item.color }}></div>
                </div>
              ))}
              <div className="absolute left-0 w-full flex flex-col items-start translate-y-12" style={{ top: '100%' }}>
                 <span className="text-emerald-500/70 font-mono text-[10px] font-bold tracking-[0.15em] leading-relaxed">SOURCE:<br/>COPERNICUS<br/>MARINE DATA</span>
              </div>
           </div>

           {/* 2. CONVERGING CURVES (15%) */}
           <div className="w-[15%] shrink-0 h-[240px] relative z-0">
              <svg className="absolute pointer-events-none select-none inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M 0 0 C 50 0, 50 50, 100 50" fill="none" stroke="#f97316" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                 <path d="M 0 25 C 50 25, 50 50, 100 50" fill="none" stroke="#3b82f6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                 <path d="M 0 50 L 100 50" fill="none" stroke="#22d3ee" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                 <path d="M 0 75 C 50 75, 50 50, 100 50" fill="none" stroke="#c084fc" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                 <path d="M 0 100 C 50 100, 50 50, 100 50" fill="none" stroke="#bae6fd" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
           </div>

           {/* 3. CENTER-LEFT - SPATIAL INGESTION (27%) */}
           <div className="w-[27%] shrink-0 h-[240px] relative z-20 flex flex-col items-center justify-center translate-x-4">
              <div className="text-xs font-mono font-bold text-cyan-400 tracking-widest absolute -top-16">
                SPATIAL INGESTION
              </div>
              
              <div className="w-[130%] h-64 relative flex items-center justify-center">
                 <img draggable="false" src="/images/map-perfect.png" alt="Spatial Grid" className="w-full h-full object-contain relative z-10 pointer-events-none select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]" />
              </div>

              <div className="flex items-center justify-center gap-6 absolute -bottom-16 opacity-80 w-full">
                 <div className="flex items-center gap-2"><Grid size={14} className="text-cyan-400"/><span className="text-white font-mono text-[10px] font-bold tracking-widest whitespace-nowrap">0.25° × 0.25°</span></div>
                 <div className="flex items-center gap-2"><Calendar size={14} className="text-cyan-400"/><span className="text-white font-mono text-[10px] font-bold tracking-widest whitespace-nowrap">DAILY</span></div>
                 <div className="flex items-center gap-2"><MapPin size={14} className="text-cyan-400"/><span className="text-white font-mono text-[10px] font-bold tracking-widest whitespace-nowrap">N. INDIAN OCEAN</span></div>
              </div>
           </div>

           {/* 4. GAP (1%) */}
           <div className="w-[1%] shrink-0 h-[240px]"></div>

           {/* 5. CENTER-RIGHT - TEMPORAL HOLD-OUT (32%) */}
           <div className="w-[32%] shrink-0 h-[240px] relative z-20">
              <div className="text-xs font-mono font-bold text-cyan-400 tracking-widest absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                TEMPORAL HOLD-OUT
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full">
                 
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap">
                    <div className="border border-white/20 bg-black/40 rounded-full px-4 py-1.5">
                       <span className="text-white font-mono text-[10px] font-bold tracking-[0.2em] uppercase">STRICT HOLD-OUT</span>
                    </div>
                 </div>

                 <div className="w-full flex items-center relative">
                    <div className="w-1/2 h-[1.5px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                    <div className="w-1/2 h-[1.5px] bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]"></div>
                    
                    <div className="absolute left-0 w-2 h-2 rounded-full bg-cyan-400 -translate-x-1/2 shadow-[0_0_8px_rgba(34,211,238,1)]"></div>
                    <div className="absolute right-0 w-2 h-2 rounded-full bg-orange-400 translate-x-1/2 shadow-[0_0_8px_rgba(251,146,60,1)]"></div>

                    <div className="absolute left-1/2 -translate-x-1/2 h-8 -top-4 w-px border-l border-dashed border-white/30"></div>
                 </div>

                 <div className="w-full flex mt-4 absolute">
                    <div className="w-1/2 text-center">
                       <div className="text-cyan-400 font-mono text-[10px] font-bold tracking-widest mb-1.5">1996 - 2024</div>
                       <div className="text-white font-mono text-[11px] font-bold tracking-widest whitespace-nowrap">TRAINING DATA</div>
                    </div>
                    <div className="w-1/2 text-center relative">
                       <div className="text-orange-400 font-mono text-[10px] font-bold tracking-widest mb-1.5">JAN 2025 - MAY 2026</div>
                       <div className="text-white font-mono text-[11px] font-bold tracking-widest whitespace-nowrap">UNSEEN TEST DATA</div>
                       
                       <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap">
                          <div className="text-white/40 font-mono text-[9px] font-bold tracking-[0.1em] uppercase">NEVER SEEN DURING TRAINING</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* 6. SPLIT CURVES (5%) */}
           <div className="w-[5%] shrink-0 h-[240px] relative z-0">
              <svg className="absolute pointer-events-none select-none inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M 0 50 C 40 50, 60 20, 100 20" fill="none" stroke="#f97316" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                 <path d="M 0 50 C 40 50, 60 80, 100 80" fill="none" stroke="#3b82f6" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
           </div>

           {/* 7. FAR RIGHT - VALIDATION (10%) */}
           <div className="w-[10%] shrink-0 h-[240px] relative z-20">
              <div className="text-xs font-mono font-bold text-cyan-400 tracking-widest absolute -top-16 left-0 whitespace-nowrap">VALIDATION</div>
              <div className="text-[9px] font-mono font-bold text-white/50 tracking-widest absolute -top-10 left-0 whitespace-nowrap">VALIDATED AGAINST</div>

              {/* INCOIS */}
              <div className="absolute left-0 w-max flex items-center gap-4 -translate-y-1/2" style={{ top: '20%' }}>
                 <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)] bg-cyan-400 shrink-0"></div>
                 <div className="flex flex-col">
                    <span className="text-white font-mono text-[11px] font-bold tracking-widest mb-1.5">INCOIS ARGO</span>
                    <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest w-fit">IN-SITU</span>
                 </div>
              </div>

              {/* ARMOR3D */}
              <div className="absolute left-0 w-max flex items-center gap-4 -translate-y-1/2" style={{ top: '80%' }}>
                 <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,1)] bg-blue-400 shrink-0"></div>
                 <div className="flex flex-col">
                    <span className="text-white font-mono text-[11px] font-bold tracking-widest mb-1.5">ARMOR3D</span>
                    <span className="text-white/70 bg-white/10 border border-white/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest w-fit">REFERENCE</span>
                 </div>
              </div>
           </div>

        </div>

        {/* ================================================== */}
        {/* MOBILE PIPELINE (VERTICAL STACK) */}
        {/* ================================================== */}
        <div className="flex lg:hidden flex-col items-center gap-16 relative mt-16 pointer-events-none select-none">
           <div className="flex flex-col items-center gap-6 w-full max-w-sm">
             <div className="flex flex-wrap justify-center gap-4 w-full">
               {['SST', 'SSS', 'SSH', 'CURRENTS', 'WINDS'].map(v => (
                 <div key={v} className="px-4 py-2 bg-black/40 border border-white/10 rounded-full"><span className="text-white font-bold font-mono text-xs tracking-widest">{v}</span></div>
               ))}
             </div>
             <div className="text-emerald-500/70 font-mono text-[10px] font-bold tracking-[0.15em] uppercase text-center border border-emerald-500/20 bg-emerald-950/30 px-4 py-2 rounded-full">
                SOURCE: COPERNICUS MARINE DATA
             </div>
           </div>
           
           <div className="flex flex-col items-center w-full">
             <div className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest mb-8">SPATIAL INGESTION</div>
             <div className="w-full h-56 relative mb-8 mx-auto flex items-center justify-center scale-110">
                 <img draggable="false" src="/images/map-perfect.png" alt="Spatial Grid" className="w-full h-full object-contain relative z-10 pointer-events-none select-none" />
             </div>
             <div className="flex flex-wrap items-center justify-center gap-4 opacity-80 w-full">
                 <span className="text-white font-mono text-[10px] font-bold tracking-widest">0.25° × 0.25°</span>
                 <span className="text-white font-mono text-[10px] font-bold tracking-widest">DAILY</span>
                 <span className="text-white font-mono text-[10px] font-bold tracking-widest">NORTH INDIAN OCEAN</span>
             </div>
           </div>

           <div className="flex flex-col items-center w-full border-t border-b border-white/5 py-8">
             <div className="text-xs font-bold font-mono text-cyan-400 tracking-widest mb-6">TEMPORAL HOLD-OUT</div>
             <div className="border border-white/20 bg-black/40 rounded-full px-4 py-1.5 mb-6">
                <span className="text-white font-bold font-mono text-[10px] tracking-[0.2em] uppercase">STRICT HOLD-OUT</span>
             </div>
             <div className="flex flex-col gap-4 text-center w-full">
                <div className="border border-cyan-500/30 p-4 rounded-xl"><div className="text-cyan-400 font-mono text-[11px] font-bold mb-1.5">1996 - 2024</div><div className="text-white font-bold font-mono text-xs">TRAINING DATA</div></div>
                <div className="border border-orange-500/30 p-4 rounded-xl"><div className="text-orange-400 font-mono text-[11px] font-bold mb-1.5">JAN 2025 - MAY 2026</div><div className="text-white font-bold font-mono text-xs">UNSEEN TEST DATA</div></div>
             </div>
             <div className="text-white/40 font-mono text-[9px] font-bold tracking-[0.1em] uppercase mt-6">NEVER SEEN DURING TRAINING</div>
           </div>

           <div className="flex flex-col items-center w-full">
             <div className="text-xs font-bold font-mono text-cyan-400 tracking-widest mb-2">VALIDATION</div>
             <div className="text-[9px] font-bold font-mono text-white/50 tracking-widest mb-6">VALIDATED AGAINST</div>
             <div className="flex flex-col gap-4 w-full max-w-xs">
                <div className="flex items-center gap-4 bg-black/40 p-4 border border-white/10 rounded-xl">
                   <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)] bg-cyan-400 shrink-0"></div>
                   <div><div className="text-white font-bold font-mono text-xs tracking-widest mb-1.5">INCOIS ARGO</div><div className="text-emerald-400 text-[10px] font-bold bg-emerald-900/30 px-2 py-0.5 rounded w-fit">IN-SITU</div></div>
                </div>
                <div className="flex items-center gap-4 bg-black/40 p-4 border border-white/10 rounded-xl">
                   <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(59,130,246,1)] bg-blue-400 shrink-0"></div>
                   <div><div className="text-white font-bold font-mono text-xs tracking-widest mb-1.5">ARMOR3D</div><div className="text-white/70 text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded w-fit">REFERENCE</div></div>
                </div>
             </div>
           </div>
        </div>

        {/* ================================================== */}
        {/* FOOTER TAGLINE */}
        {/* ================================================== */}
        <div className="mt-24 text-center flex flex-col items-center">
           <div className="text-cyan-400/80 font-mono text-[11px] tracking-[0.2em] mb-4">
              Train on the past. Test on an unseen future.
           </div>
           <div className="w-8 h-[1px] bg-cyan-900"></div>
        </div>

      </div>
    </section>
  );
}
