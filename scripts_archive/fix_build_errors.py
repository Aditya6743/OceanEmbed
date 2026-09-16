import re

# 1. Update MosdacGlobe.tsx type ViewMode
with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    globe_code = f.read()

globe_code = globe_code.replace(
    "interface MosdacGlobeProps {\n  viewMode: 'climate' | 'navy' | 'fishery' | 'cable' | 'enso';",
    "interface MosdacGlobeProps {\n  viewMode: 'climate' | 'navy' | 'fishery' | 'cable' | 'enso' | 'iot';"
)
globe_code = globe_code.replace(
    "interface MosdacGlobeProps {\n  viewMode?: 'climate' | 'navy' | 'fishery' | 'cable' | 'enso';",
    "interface MosdacGlobeProps {\n  viewMode?: 'climate' | 'navy' | 'fishery' | 'cable' | 'enso' | 'iot';"
)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(globe_code)

# 2. Add Radio to Solutions.tsx imports
with open("frontend/src/pages/Solutions.tsx", "r") as f:
    sol_code = f.read()

if "Radio" not in sol_code.split("lucide-react")[0]:
    sol_code = sol_code.replace("import { Wind, Anchor, Fish, ArrowLeft, Radar, Target, AlertTriangle, ThermometerSun, Lock, Unlock , Activity} from 'lucide-react';", 
                                "import { Wind, Anchor, Fish, ArrowLeft, Radar, Target, AlertTriangle, ThermometerSun, Lock, Unlock , Activity, Radio} from 'lucide-react';")

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(sol_code)

