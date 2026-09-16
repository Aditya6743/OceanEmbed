import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Add ChevronLeft and ChevronRight imports
if "ChevronLeft" not in code:
    code = code.replace("import { Wind,", "import { ChevronLeft, ChevronRight, Wind,")

# 2. Add dayOffset state
old_bounds = """  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 10);
  const todayStr = today.toISOString().split('T')[0];
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  // Ensure selectedDate defaults to today if it's the old 2026-06-01 mock
  useEffect(() => {
    if (selectedDate === '2026-06-01') {
      setSelectedDate(todayStr);
    }
  }, []);"""

new_bounds = """  const [dayOffset, setDayOffset] = useState(0);

  // Sync the premium day slider with the global Zustand store
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    setSelectedDate(d.toISOString().split('T')[0]);
  }, [dayOffset, setSelectedDate]);"""

code = code.replace(old_bounds, new_bounds)

# 3. Remove the old Date Picker from the left panel
old_panel = """          {/* DATE FORECAST SELECTOR */}
          <div className="mb-6 flex flex-col gap-2 shrink-0 animate-in fade-in slide-in-from-left-2 duration-500">
            <label className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase flex items-center justify-between">
              <span>Forecast Date</span>
              <span className="text-cyan-400/50 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">Up to +10 Days</span>
            </label>
            <input 
              type="date" 
              min={todayStr} 
              max={maxDateStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-black/40 border border-cyan-500/30 text-cyan-100 text-sm rounded-lg p-2.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-inner font-mono [color-scheme:dark]"
            />
          </div>"""

code = code.replace(old_panel, "")

# 4. Inject the Premium Date Picker into the Top Navbar right next to Advanced Analysis
old_nav = """        <div className="w-[35%] px-8 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900/50 border border-white/10 hover:bg-slate-800 hover:text-white transition-all text-slate-400 mr-2 shrink-0">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-widest uppercase text-white whitespace-nowrap">Advanced <span className="text-sky-300">Analysis</span></h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">AI Tactical Hub</p>
          </div>
        </div>"""

new_nav = """        <div className="w-[35%] px-8 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900/50 border border-white/10 hover:bg-slate-800 hover:text-white transition-all text-slate-400 shrink-0">
            <ArrowLeft size={18} />
          </button>
          <div className="shrink-0">
            <h1 className="text-xl font-black tracking-widest uppercase text-white whitespace-nowrap">Advanced <span className="text-sky-300">Analysis</span></h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">AI Tactical Hub</p>
          </div>
          
          {/* PREMIUM DATE SELECTOR */}
          <div className="ml-auto flex items-center bg-black/40 border border-cyan-500/30 rounded-full p-1 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0">
            <button 
                onClick={() => setDayOffset(prev => Math.max(0, prev - 1))}
                disabled={dayOffset === 0}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-cyan-500/20 disabled:opacity-20 disabled:hover:bg-transparent text-cyan-400 transition-all cursor-pointer"
            >
                <ChevronLeft size={16} />
            </button>
            <div className="px-2 flex flex-col items-center justify-center min-w-[90px]">
                <div className={`text-[9px] font-black tracking-widest uppercase ${dayOffset === 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {dayOffset === 0 ? 'LIVE (TODAY)' : `T+${dayOffset} FORECAST`}
                </div>
                <div className="text-[10px] text-slate-300 font-mono tracking-wider">
                    {(() => {
                        const d = new Date();
                        d.setDate(d.getDate() + dayOffset);
                        return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
                    })()}
                </div>
            </div>
            <button 
                onClick={() => setDayOffset(prev => Math.min(10, prev + 1))}
                disabled={dayOffset === 10}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-cyan-500/20 disabled:opacity-20 disabled:hover:bg-transparent text-cyan-400 transition-all cursor-pointer"
            >
                <ChevronRight size={16} />
            </button>
          </div>
        </div>"""

code = code.replace(old_nav, new_nav)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
print("Injected Premium Date Picker.")
