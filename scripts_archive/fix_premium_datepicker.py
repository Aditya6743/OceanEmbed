import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# 1. Update imports
if "Calendar" not in code:
    code = code.replace("import { ChevronLeft, ChevronRight, Wind,", "import { Calendar, Wind,")

# 2. Add bounds logic and restore setSelectedDate
old_offset_logic = """  const [dayOffset, setDayOffset] = useState(0);

  // Sync the premium day slider with the global Zustand store
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    setSelectedDate(d.toISOString().split('T')[0]);
  }, [dayOffset, setSelectedDate]);"""

new_date_logic = """  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 10);
  const todayStr = today.toISOString().split('T')[0];
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  const { selectedDate, setSelectedDate } = useOceanStore();
  
  useEffect(() => {
    if (selectedDate === '2026-06-01') {
      setSelectedDate(todayStr);
    }
  }, []);"""

code = code.replace(old_offset_logic, new_date_logic)

# 3. Replace the day slider UI with the Premium Date Picker UI
old_ui = """          {/* PREMIUM DATE SELECTOR */}
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
          </div>"""

new_ui = """          {/* PREMIUM DATE PICKER */}
          <div className="ml-auto relative flex items-center bg-black/50 border border-cyan-500/40 hover:border-cyan-400/80 rounded p-0.5 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0 transition-all group overflow-hidden">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <input 
              type="date"
              min={todayStr}
              max={maxDateStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-cyan-100 font-mono text-xs py-1.5 pl-9 pr-3 outline-none focus:outline-none appearance-none cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer z-10"
            />
          </div>"""

code = code.replace(old_ui, new_ui)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
print("Implemented Premium HTML5 Date Picker.")
