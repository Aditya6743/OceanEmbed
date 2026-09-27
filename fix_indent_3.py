import re

file_path = 'backend/app/services/inference.py'
with open(file_path, 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "lon_chunk = round(lon)" in line or "chunk_hash = abs" in line or "mld_idx = int" in line:
        # Check context above it to determine correct indentation
        if i > 0:
            match = re.match(r'^(\s+)', lines[i-1])
            if match:
                indent = match.group(1)
                lines[i] = indent + line.lstrip()

with open(file_path, 'w') as f:
    f.writelines(lines)
