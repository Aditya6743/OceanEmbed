with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

target = "viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso'"
replacement = "viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso' | 'iot'"
code = code.replace(target, replacement)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
