            {/* PREDICTION RESULTS */}
            {prediction && !isLoading && !error && (
              <div className="flex-1 flex flex-col gap-3 min-h-0 animate-in fade-in duration-1000 zoom-in-95">
                
                {/* ROW 1: SURFACE OBSERVATIONS + PERFORMANCE */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 shrink-0">
                  
                  {/* SURFACE OBSERVATIONS */}
                  <div className="xl:col-span-2 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                    <div className="text-[9px] text-white/50 font-mono tracking-[0.2em] uppercase mb-2">SURFACE OBSERVATIONS</div>
                    <div className="grid grid-cols-7 gap-2">
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">SST</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.sst.toFixed(1)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">SSS</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.sss.toFixed(1)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">SSH</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.ssh > 0 ? '+' : ''}{prediction.surface_data.ssh.toFixed(2)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">U CUR</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.current_u.toFixed(2)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">V CUR</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.current_v.toFixed(2)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">U WND</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.wind_u.toFixed(1)}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[8px] font-mono tracking-widest mb-1">V WND</div>
                        <div className="text-white font-mono text-xs">{prediction.surface_data.wind_v.toFixed(1)}</div>
                      </div>
                    </div>
                  </div>

                  {/* MODEL PERFORMANCE */}
                  <div className="xl:col-span-1 bg-white/[0.02] border border-white/5 rounded-lg p-2.5 flex flex-col justify-between">
                    <div className="text-[9px] text-white/50 font-mono tracking-[0.2em] uppercase mb-2">MODEL PERFORMANCE</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-purple-950/20 border border-purple-500/20 rounded p-1.5 text-center">
                        <div className="text-purple-400 text-[8px] font-mono tracking-widest mb-1 font-bold">RMSE</div>
                        <div className="text-white font-mono text-xs">{prediction.metrics?.rmse.toFixed(3)}</div>
                      </div>
                      <div className="bg-fuchsia-950/20 border border-fuchsia-500/20 rounded p-1.5 text-center">
                        <div className="text-fuchsia-400 text-[8px] font-mono tracking-widest mb-1 font-bold">BIAS</div>
                        <div className="text-white font-mono text-xs">{prediction.metrics?.bias.toFixed(3)}</div>
                      </div>
                      <div className="bg-indigo-950/20 border border-indigo-500/20 rounded p-1.5 text-center">
                        <div className="text-indigo-400 text-[8px] font-mono tracking-widest mb-1 font-bold">CORR</div>
                        <div className="text-white font-mono text-xs">{prediction.metrics?.correlation.toFixed(3)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 2: VISUALIZATIONS */}
                <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-0">
                  <div className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col min-h-0 relative shadow-2xl">
                    <div className="text-[9px] text-white/40 font-mono tracking-[0.2em] mb-2 shrink-0 flex justify-between">
                      <span>3D THERMODYNAMIC VOLUME</span>
                      <span>0 — 1000m</span>
                    </div>
                    <div className="flex-1 min-h-0 relative rounded-lg overflow-hidden bg-black shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
                      <Ocean3D prediction={prediction} />
                    </div>
                  </div>

                  <div className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 flex flex-col min-h-0 relative shadow-2xl">
                    <div className="flex justify-between items-center mb-2 shrink-0">
                      <div className="text-[9px] text-white/40 font-mono tracking-[0.2em]">TEMPERATURE vs DEPTH</div>
                      <div className="text-[8px] text-lime-400/80 font-mono tracking-widest border border-lime-500/30 px-1.5 py-0.5 rounded-sm bg-lime-950/30">ARGO VALIDATION</div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <TemperatureChart profile={prediction.profile} thermoclineDepth={prediction.estimated_thermocline} />
                    </div>
                  </div>
                </div>

                {/* ROW 3: SCIENTIFIC CONTEXT */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 flex items-center justify-between shrink-0 text-[8px] font-mono">
                  <div className="flex items-center gap-6">
                    <div><span className="text-cyan-400 font-bold mr-2">1. SATELLITE</span><span className="text-white/40">Surface telemetry</span></div>
                    <div><span className="text-cyan-400 font-bold mr-2">2. OCEANEMBED</span><span className="text-white/40">Deep learning inference</span></div>
                    <div><span className="text-cyan-400 font-bold mr-2">3. ARGO</span><span className="text-white/40">Independent validation</span></div>
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 px-2 py-0.5 rounded border border-white/5 text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> PREDICTION READY
                  </div>
                </div>

              </div>
            )}
