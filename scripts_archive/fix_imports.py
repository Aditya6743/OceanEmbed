with open("frontend/src/pages/Solutions.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith("import { Cpu, Layers, ShieldCheck, CheckCircle2, Map as MapIcon, EyeOff, "):
        if "lucide-react" in line:
            new_lines.append(line)
        else:
            new_lines.append(line.replace("Cpu, Layers, ShieldCheck, CheckCircle2, Map as MapIcon, EyeOff, ", ""))
    else:
        new_lines.append(line)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.writelines(new_lines)
