import re
with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Make the Cyclone layer render when viewMode is 'climate' AND climateSubMode is 'cyclone', OR when viewMode is 'iot'
target = "{viewMode === 'climate' && climateSubMode === 'cyclone' && ("
replacement = "{(viewMode === 'iot' || (viewMode === 'climate' && climateSubMode === 'cyclone')) && ("
code = code.replace(target, replacement)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
