with open("frontend/src/components/MosdacGlobe.tsx", "r") as f:
    lines = f.readlines()

out = []
skip = False
for line in lines:
    if "const sharedUniforms = useMemo(() => ({" in line:
        skip = True
    if skip and "}), []);" in line:
        skip = False
        continue
    if skip:
        continue
    out.append(line)

with open("frontend/src/components/MosdacGlobe.tsx", "w") as f:
    f.writelines(out)
