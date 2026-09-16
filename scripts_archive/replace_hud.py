with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

bad_hud = """          {/* PHYSICS-INFORMED ML DIAGNOSTICS HUD */}
          <div className="mt-auto pt-4 border-t border-slate-800 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Cpu size={12} className="text-slate-400" />
                PINN Diagnostics
              </span>
              <span className="text-[9px] font-bold tracking-widest text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                v5 ACTIVE
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-black/60 border border-sky-500/20 rounded p-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-[8px] text-sky-500/80 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Layers size={10} /> Architecture
                </div>
                <div className="text-xs text-sky-100 font-mono font-bold tracking-tight">12-Ch Spatial</div>
              </div>
              <div className="bg-black/60 border border-emerald-500/20 rounded p-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-[8px] text-emerald-500/80 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <ShieldCheck size={10} /> Hydrostatic
                </div>
                <div className="text-xs text-emerald-400 font-mono font-bold tracking-tight flex items-center gap-1">
                  STABLE <CheckCircle2 size={10} />
                </div>
              </div>
              <div className="bg-black/60 border border-indigo-500/20 rounded p-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-[8px] text-indigo-400/80 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <MapIcon size={10} /> Bathymetry
                </div>
                <div className="text-xs text-indigo-200 font-mono font-bold tracking-tight">GEBCO Grid</div>
              </div>
              <div className="bg-black/60 border border-rose-500/20 rounded p-2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-[8px] text-rose-500/80 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                  <EyeOff size={10} /> Land Mask
                </div>
                <div className="text-xs text-rose-300 font-mono font-bold tracking-tight">DYNAMIC</div>
              </div>
            </div>"""

new_hud = """          {/* SATELLITE STREAMS BLOCK */}
          <div className="mt-auto pt-4 border-t border-slate-800 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Radio size={12} className="text-sky-500" />
                Active Data Streams
              </span>
              <span className="text-[9px] font-bold tracking-widest text-slate-400">
                12 CHANNELS
              </span>
            </div>
            
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded px-3 py-2">
                <span className="text-[10px] text-slate-400 font-mono">Surface Weather & SST</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> SYNCED</span>
              </div>
              <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded px-3 py-2">
                <span className="text-[10px] text-slate-400 font-mono">GEBCO Ocean Topography</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div> SYNCED</span>
              </div>
            </div>"""

if bad_hud in code:
    code = code.replace(bad_hud, new_hud)
    with open("frontend/src/pages/Solutions.tsx", "w") as f:
        f.write(code)
    print("Replaced bad HUD")
else:
    print("Could not find bad HUD")
