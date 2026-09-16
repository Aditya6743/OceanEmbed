with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

ui_old = """          <div className="flex items-center gap-3 bg-black/80 border border-cyan-500/40 rounded-lg p-2.5 backdrop-blur-xl shadow-[0_0_25px_rgba(8,145,178,0.25)] transition-all hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(8,145,178,0.4)]">
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

ui_new = """          <div className="flex items-center gap-2 bg-black/40 border border-cyan-500/20 rounded-md p-1.5 backdrop-blur-md transition-colors hover:border-cyan-500/40">
            <span className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-mono ml-2">Forecast Date:</span>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                min={todayStr} 
                max={maxDateStr} 
                className="bg-transparent text-white text-sm font-mono focus:outline-none border-none cursor-pointer [color-scheme:dark] px-1" 
                title="Select Date (Today to +10 Days)"
            />
          </div>"""

code = code.replace(ui_old, ui_new)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
