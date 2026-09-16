with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

target = """<span className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-mono ml-2">Forecast Date:</span>"""
replacement = """<span className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-mono ml-2">Date:</span>"""
code = code.replace(target, replacement)

target2 = """<div className="flex items-center gap-2 bg-black/40 border border-cyan-500/20 rounded-md p-1.5 backdrop-blur-md transition-colors hover:border-cyan-500/40">"""
replacement2 = """<div className="flex items-center gap-2 bg-black/40 border border-cyan-500/20 rounded-md p-1.5 backdrop-blur-md transition-colors hover:border-cyan-500/40 ml-12">"""
code = code.replace(target2, replacement2)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
