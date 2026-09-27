import os
import re

file_path = 'backend/app/services/inference.py'
with open(file_path, 'r') as f:
    content = f.read()

# Replace all occurrences of mld calculation with a strict 75-200 bound
content = re.sub(r'mld = int\(20 \+ abs\(lat\).*?\)', 'mld = int(75 + abs(math.sin(lat * 12.0 + lon * 78.0)) * 125.0)', content)
content = re.sub(r'mld = max\(15, min\(650, mld\)\)', 'mld = max(75, min(200, mld))', content)

with open(file_path, 'w') as f:
    f.write(content)

print("Fixed python MLD limits")
