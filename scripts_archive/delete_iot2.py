import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

# Remove the navbar button for iot
code = re.sub(r"\s*<button\n\s*onClick=\{.*?setActiveTab\('iot'\).*?IOT BEACONS\n\s*</button>", "", code, flags=re.DOTALL)

# Remove any remaining `{activeTab === 'iot' ...}` left panel stuff
code = re.sub(r"\s*\{activeTab === 'iot' && \(\n.*?\}\)", "", code, flags=re.DOTALL)

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
