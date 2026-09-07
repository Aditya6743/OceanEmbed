import re

with open("src/pages/HowItWorks.tsx", "r") as f:
    content = f.read()

# Replace pure black with a premium deep ocean/slate blue
content = content.replace("bg-black/40", "bg-slate-900/40")

with open("src/pages/HowItWorks.tsx", "w") as f:
    f.write(content)
