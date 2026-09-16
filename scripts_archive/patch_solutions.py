import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Add selectedDate to store destruct
old_store = "const { showGlobeArgo, setShowGlobeArgo } = useOceanStore();"
new_store = "const { showGlobeArgo, setShowGlobeArgo, selectedDate, setSelectedDate } = useOceanStore();"
code = code.replace(old_store, new_store)

# 2. Add bounds logic inside component
old_bounds = "const navigate = useNavigate();"
new_bounds = """const navigate = useNavigate();

  const today = new Date();
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
code = code.replace(old_bounds, new_bounds)

# 3. Inject the Date Picker into the left panel
old_panel = """      <div className="w-[35%] h-full bg-transparent border-r border-white/10 pt-24 px-8 pb-4 z-10 overflow-y-auto overflow-x-hidden shadow-2xl relative custom-scrollbar pointer-events-auto">
        <div className="w-[96%] mx-auto h-full flex flex-col">
          {activeTab === 'climate' && ("""

new_panel = """      <div className="w-[35%] h-full bg-transparent border-r border-white/10 pt-24 px-8 pb-4 z-10 overflow-y-auto overflow-x-hidden shadow-2xl relative custom-scrollbar pointer-events-auto">
        <div className="w-[96%] mx-auto h-full flex flex-col">
          
          {/* DATE FORECAST SELECTOR */}
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
          </div>

          {activeTab === 'climate' && ("""
code = code.replace(old_panel, new_panel)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
print("Injected Date Picker into Solutions.tsx")
