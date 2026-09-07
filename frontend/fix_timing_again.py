import re

with open("src/pages/HowItWorks.tsx", "r") as f:
    content = f.read()

# Update sequence timing to 1.3s per card
content = content.replace("const t1 = setTimeout(() => setActiveCard(0), 800);", "const t1 = setTimeout(() => setActiveCard(0), 800);")
content = content.replace("const t2 = setTimeout(() => setActiveCard(1), 2500);", "const t2 = setTimeout(() => setActiveCard(1), 2100);")
content = content.replace("const t3 = setTimeout(() => setActiveCard(2), 4200);", "const t3 = setTimeout(() => setActiveCard(2), 3400);")
content = content.replace("}, 5900);", "}, 4700);")

with open("src/pages/HowItWorks.tsx", "w") as f:
    f.write(content)
