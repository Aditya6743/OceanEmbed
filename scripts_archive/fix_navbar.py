import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

enso_btn = """          <button 
            onClick={() => setActiveTab('enso')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'enso' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <ThermometerSun size={12} /> IOD CLIMATE
          </button>"""

iot_btn = """
          <button 
            onClick={() => setActiveTab('iot')}
            className={`flex items-center whitespace-nowrap gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${
              activeTab === 'iot' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.1)]' : 'bg-slate-900/50 text-slate-500 border border-slate-800 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <Radio size={12} className={activeTab === 'iot' ? 'animate-pulse' : ''} /> IOT BEACONS
          </button>"""

code = code.replace(enso_btn, enso_btn + iot_btn)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
