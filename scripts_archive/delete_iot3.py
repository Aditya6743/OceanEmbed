with open("frontend/src/pages/Solutions.tsx", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "setActiveTab('iot')" in line:
        # We need to backtrack and remove the `<button` line that was already added
        # Actually, let's just find the index of the start of this button.
        pass

# Better approach: string manipulation
with open("frontend/src/pages/Solutions.tsx", "r") as f:
    code = f.read()

import re
code = re.sub(r"\s*<button[^>]*onClick=\{\(\) => setActiveTab\('iot'\)\}.*?</button>", "", code, flags=re.DOTALL)
with open("frontend/src/pages/Solutions.tsx", "w") as f:
    f.write(code)

