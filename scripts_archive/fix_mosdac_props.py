with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

import re
# Find the export default line exactly
code = re.sub(r"export default function MosdacGlobe\(\{[^}]+\}: \{[^}]+\}\) \{", 
              "export default function MosdacGlobe({ viewMode = 'climate', climateSubMode = 'cyclone', isRotationLocked = false }: { viewMode?: 'navy' | 'fishery' | 'climate' | 'cable' | 'enso', climateSubMode?: 'cyclone' | 'flood' | 'heatwave' | 'erosion', isRotationLocked?: boolean }) {", 
              code)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
