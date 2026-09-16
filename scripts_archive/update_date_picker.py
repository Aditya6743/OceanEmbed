with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Add date computations
hook_old = """  const [liveData, setLiveData] = useState({ tchp: 85.4, depth: 75.2, gradient: -0.15, lat: 15.3, lon: 65.2, dmi: 1.4, sst: 29.5, ssh: 0.5, u: 0.1, v: -0.2 });"""
hook_new = """  const [liveData, setLiveData] = useState({ tchp: 85.4, depth: 75.2, gradient: -0.15, lat: 15.3, lon: 65.2, dmi: 1.4, sst: 29.5, ssh: 0.5, u: 0.1, v: -0.2 });

  const todayStr = new Date().toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 10);
  const maxDateStr = maxDateObj.toISOString().split('T')[0];"""
code = code.replace(hook_old, hook_new)

# Update UI
ui_old = """          <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-md p-1 backdrop-blur-md">
            <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono ml-2">Date:</span>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min="1997-01-01" max="2026-12-31" className="bg-transparent text-cyan-400 text-xs font-mono focus:outline-none border-none p-1 cursor-pointer" />
          </div>"""
ui_new = """          <div className="flex items-center gap-3 bg-black/80 border border-cyan-500/40 rounded-lg p-2.5 backdrop-blur-xl shadow-[0_0_25px_rgba(8,145,178,0.25)] transition-all hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(8,145,178,0.4)]">
            <div className="flex flex-col text-right">
                <span className="text-[9px] text-cyan-400 uppercase tracking-[0.2em] font-mono font-bold leading-none mb-1">PREDICTIVE FORECAST</span>
                <span className="text-[8px] text-white/50 uppercase tracking-widest font-light leading-none">Today → +10 Days</span>
            </div>
            <div className="h-7 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent mx-1"></div>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                min={todayStr} 
                max={maxDateStr} 
                className="bg-transparent text-white text-sm font-mono focus:outline-none border-none cursor-pointer [color-scheme:dark] px-2 py-1 hover:bg-white/5 rounded transition-colors" 
                title="Select Forecast Date"
            />
          </div>"""
code = code.replace(ui_old, ui_new)

# Force selectedDate to be at least today if it's strictly initialized to 2026-06-01.
# Wait, if selectedDate from store is 2026-06-01, the input min=today (2026-09-13) will show a validation warning, but it still works.
# Let's add an effect to reset it to today if it's before today.
effect_old = """  useEffect(() => {
    // Connect Solutions dashboard to the LIVE PyTorch AI Model"""
effect_new = """  useEffect(() => {
    if (selectedDate < todayStr) {
      setSelectedDate(todayStr);
    }
  }, [selectedDate, todayStr, setSelectedDate]);

  useEffect(() => {
    // Connect Solutions dashboard to the LIVE PyTorch AI Model"""
code = code.replace(effect_old, effect_new)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
