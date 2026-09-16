import re
with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

target = "if (mlData.r < 0.02 && mlData.g < 0.02 && mlData.b < 0.02) discard;"
replacement = "if (mlData.a < 0.1) discard; // Perfect transparency masking"
code = code.replace(target, replacement)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
