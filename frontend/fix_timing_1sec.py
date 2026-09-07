import re

with open("src/pages/HowItWorks.tsx", "r") as f:
    content = f.read()

# Update sequence timing to exactly 1.0s per card
content = content.replace("const t1 = setTimeout(() => setActiveCard(0), 800);", "const t1 = setTimeout(() => setActiveCard(0), 800);")
content = content.replace("const t2 = setTimeout(() => setActiveCard(1), 2100);", "const t2 = setTimeout(() => setActiveCard(1), 1800);")
content = content.replace("const t3 = setTimeout(() => setActiveCard(2), 3400);", "const t3 = setTimeout(() => setActiveCard(2), 2800);")
content = content.replace("}, 4700);", "}, 3800);")

with open("src/pages/HowItWorks.tsx", "w") as f:
    f.write(content)
