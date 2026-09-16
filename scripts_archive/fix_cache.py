import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

target = "const query = `?date=${selectedDate}`;"
replacement = "const query = `?date=${selectedDate}&t=${Date.now()}`;"
code = code.replace(target, replacement)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
