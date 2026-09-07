import re

with open("src/components/Preloader.tsx", "r") as f:
    content = f.read()

# Add the prominent message above the block
message_block = """      {/* PROMINENT TITLE ABOVE BLOCK */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center z-[150] pointer-events-none">
        <div className="text-cyan-400 font-mono text-[10px] tracking-[0.5em] mb-2 animate-pulse opacity-80">
          NEURAL INFERENCE ENGINE
        </div>
        <div className={`text-3xl md:text-5xl font-black tracking-[0.3em] uppercase transition-all duration-700 ${isComplete ? 'text-white drop-shadow-[0_0_40px_#fff] scale-105' : 'text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]'}`}>
          OCEANEMBED
        </div>
      </div>

      {/* Cinematic HUD Overlay */}"""

content = content.replace("{/* Cinematic HUD Overlay */}", message_block)

with open("src/components/Preloader.tsx", "w") as f:
    f.write(content)
