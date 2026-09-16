with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

target = "if (intensity < 0.05) discard;"
replacement = "if (mlData.r < 0.02 && mlData.g < 0.02 && mlData.b < 0.02) discard;"
code = code.replace(target, replacement)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
