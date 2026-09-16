with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

iot_simulator_ui = """
      {activeTab === 'iot' && (
        <div className="absolute inset-0 z-0 pl-[420px] pt-24 bg-[#030712] flex items-center justify-center overflow-hidden font-mono">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f43f5e0a_1px,transparent_1px),linear-gradient(to_bottom,#f43f5e0a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          <div className="relative z-10 w-full max-w-5xl flex items-center justify-between px-12">
            
            {/* Left Column: AI Engine */}
            <div className="flex flex-col items-center relative">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Data Source</div>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-12 shadow-lg text-center">
                <Radar className="text-sky-400 mx-auto mb-2 animate-spin-slow" size={24} />
                <div className="text-white text-xs font-bold">ISRO / NASA Satellites</div>
                <div className="text-sky-500 text-[10px] mt-1">Live Ocean Surface Telemetry</div>
              </div>

              {/* Data stream dots */}
              <div className="absolute top-[80px] bottom-[80px] w-0.5 bg-slate-800">
                 <div className="w-full h-4 bg-sky-400 rounded-full animate-bounce"></div>
              </div>

              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 mt-8">Core Processor</div>
              <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-6 shadow-[0_0_40px_rgba(244,63,94,0.15)] relative">
                <div className="absolute -top-3 -right-3">
                  <span className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-rose-500 border border-black flex items-center justify-center text-[10px] font-bold text-white">!</span>
                  </span>
                </div>
                <Activity className="text-rose-500 mx-auto mb-3" size={32} />
                <div className="text-white text-sm font-black tracking-wider text-center">PYTORCH AI ENGINE</div>
                <div className="bg-black/50 rounded p-2 mt-3 border border-rose-500/20">
                  <div className="text-rose-400 text-[10px]">CRITICAL ANOMALY DETECTED</div>
                  <div className="text-slate-300 text-[10px] mt-1">TCHP Surge: {">"} 140 kJ/cm²</div>
                </div>
              </div>
            </div>

            {/* Middle: API Gateway */}
            <div className="flex-1 px-8 relative">
              {/* Animated Connecting Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-rose-900/50 -translate-y-1/2 overflow-hidden">
                <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-[pulse_1s_ease-in-out_infinite]"></div>
              </div>
              
              <div className="relative bg-black border border-rose-500/40 rounded-lg p-4 shadow-xl mx-auto w-64 text-center z-10">
                <Radio className="text-rose-400 mx-auto mb-2" size={24} />
                <div className="text-white text-xs font-bold uppercase">Alert API Gateway</div>
                <div className="text-emerald-400 text-[10px] mt-1 bg-emerald-500/10 rounded py-1 border border-emerald-500/20">STATUS: BROADCASTING</div>
              </div>
            </div>

            {/* Right Column: IoT Devices */}
            <div className="flex flex-col gap-8 relative z-10">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest text-center absolute -top-8 left-0 right-0">Hardware Endpoints</div>
              
              {/* Device 1 */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-lg flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-black p-3 rounded-full border border-rose-500/30">
                  <Activity className="text-rose-400 animate-pulse" size={20} />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">Fisherman Beacon #402</div>
                  <div className="text-rose-400 text-[10px] mt-1 animate-pulse font-bold">VIBRATING (EVACUATE)</div>
                </div>
              </div>

              {/* Device 2 */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-lg flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-black p-3 rounded-full border border-rose-500/30">
                  <AlertTriangle className="text-rose-500 animate-pulse" size={20} />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">Coastal Siren (Mumbai)</div>
                  <div className="text-rose-500 text-[10px] mt-1 font-black animate-pulse">SIREN ACTIVE</div>
                </div>
              </div>

              {/* Device 3 */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-lg flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="bg-black p-3 rounded-full border border-sky-500/30">
                  <Target className="text-sky-400" size={20} />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">Coast Guard HQ Terminal</div>
                  <div className="text-sky-400 text-[10px] mt-1">COORDINATES SYNCED</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
"""
code = code.replace("      </div>\n      )}\n    </div>", "      </div>\n      )}\n" + iot_simulator_ui + "\n    </div>")

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
