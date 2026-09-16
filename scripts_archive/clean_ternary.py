import re

with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

code = code.replace(" || activeTab === 'iot'", "")

with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)
