with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Extract the IOT BEACONS button block
target_btn = """          <button 
            onClick={() => setActiveTab('iot')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'iot' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <Radio size={12} /> IOT BEACONS
          </button>\n"""

# Remove it from its current position
code = code.replace(target_btn, "")

# Insert it after the IOD CLIMATE button
target_insert = """          <button 
            onClick={() => setActiveTab('enso')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'enso' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <ThermometerSun size={12} /> IOD CLIMATE
          </button>"""

code = code.replace(target_insert, target_insert + "\n" + target_btn.rstrip('\n'))

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
