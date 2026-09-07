import re

with open("src/pages/HowItWorks.tsx", "r") as f:
    content = f.read()

# Replace the overly transparent bg with a rich, dark frosted glass
old_class = "bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(8,145,178,0.15)]"
new_class = "bg-black/40 backdrop-blur-2xl border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.5)] hover:border-cyan-500/40 hover:bg-cyan-950/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_0_20px_40px_rgba(8,145,178,0.2)]"

content = content.replace(old_class, new_class)

with open("src/pages/HowItWorks.tsx", "w") as f:
    f.write(content)
