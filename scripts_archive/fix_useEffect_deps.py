import re
with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# Remove the duplicate useEffect completely first
code = re.sub(r"  // Force WebGL uniform updates when textures finish loading.*?  useFrame\(\(state\) => \{", "  useFrame((state) => {", code, flags=re.DOTALL)

# Now fix the remaining one at the bottom to include viewMode and climateSubMode
target = "  }, [tchpMap, fisheryMap, navyMap, benthicMap, iodMap, sshMap, sstMap, currentsMap]);"
replacement = "  }, [tchpMap, fisheryMap, navyMap, benthicMap, iodMap, sshMap, sstMap, currentsMap, viewMode, climateSubMode]);"
code = code.replace(target, replacement)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
