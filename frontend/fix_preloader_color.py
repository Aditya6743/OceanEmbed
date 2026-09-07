import re

with open("src/components/Preloader.tsx", "r") as f:
    content = f.read()

old_block = """        <div className={`text-3xl md:text-5xl font-black tracking-[0.3em] uppercase transition-all duration-700 ${isComplete ? 'text-white drop-shadow-[0_0_40px_#fff] scale-105' : 'text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]'}`}>
          OCEANEMBED
        </div>"""

new_block = """        <div className={`text-3xl md:text-5xl font-black tracking-[0.3em] uppercase transition-all duration-700 ${isComplete ? 'drop-shadow-[0_0_40px_#fff] scale-105' : 'drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]'}`}>
          <span className="text-white">OCEAN</span>
          <span className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 transition-colors duration-700 ${isComplete ? 'from-white to-white' : ''}`}>EMBED</span>
        </div>"""

content = content.replace(old_block, new_block)

with open("src/components/Preloader.tsx", "w") as f:
    f.write(content)
