with open("src/pages/Solutions.tsx", "r") as f:
    code = f.read()

with open("../components.ts", "r") as f:
    comps = f.read()

code = code.replace("export default function Solutions() {", comps)

with open("src/pages/Solutions.tsx", "w") as f:
    f.write(code)
