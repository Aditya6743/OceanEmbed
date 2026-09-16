import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

target_hub = re.search(r"// ----------------------------------------------------\n// IOT HUB DASHBOARD \(ARCHITECTURE FLOW & RADAR\)\n// ----------------------------------------------------\nconst IotHubDashboard = \(\) => \{\n.*?export default function Solutions\(\) \{", code, re.DOTALL).group(0)

# We grab new_hub directly from stretch_arch or fix_stretch
with open("fix_stretch.py", "r") as f:
    stretch_code = f.read()
    
# Extract the new_hub string literal from fix_stretch.py
new_hub_match = re.search(r'new_hub = """(.*?)"""\n\ncode = code.replace', stretch_code, re.DOTALL)
if new_hub_match:
    new_hub = new_hub_match.group(1)
    
    code = code.replace(target_hub, new_hub + "\n\nexport default function Solutions() {")
    with open("frontend/src/pages/Solutions.tsx", "w") as f:
        f.write(code)
    print("RESTORED SUCCESSFULLY")
else:
    print("FAILED TO EXTRACT NEW HUB")
