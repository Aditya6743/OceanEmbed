import re

with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    code = f.read()

# 1. Remove dateOffset from its current wrong location
bad_block = """  // Hash the selected date into a unique float to completely shift the fluid simulation patterns (Domain Warping)
  const dateOffset = useMemo(() => {
    if (!selectedDate) return 0;
    let hash = 0;
    for (let i = 0; i < selectedDate.length; i++) {
      hash = ((hash << 5) - hash) + selectedDate.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) / 1000.0;
  }, [selectedDate]);"""

code = code.replace(bad_block, "")

# 2. Insert it right after the second useOceanStore call
anchor = "const { selectedDate } = useOceanStore();"
good_block = """const { selectedDate } = useOceanStore();

  // Hash the selected date into a unique float to completely shift the fluid simulation patterns (Domain Warping)
  const dateOffset = useMemo(() => {
    if (!selectedDate) return 0;
    let hash = 0;
    for (let i = 0; i < selectedDate.length; i++) {
      hash = ((hash << 5) - hash) + selectedDate.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) / 1000.0;
  }, [selectedDate]);"""

code = code.replace(anchor, good_block)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.write(code)
print("Fixed dateOffset declaration order.")
