import re

file_path = 'backend/app/services/inference.py'
with open(file_path, 'r') as f:
    content = f.read()

# Fix the mocked MLD inside _mock_profile
content = re.sub(
    r'base_mld = 75 \+ \(r1 \* 125\)\n\s*if r2 > 0\.90:\n\s*base_mld = 220 \+ \(r1 \* 80\)\n\s*mld = int\(base_mld\)',
    'mld_options = [75, 100, 125, 150, 175, 200]\n        mld = mld_options[int(r1 * len(mld_options)) % len(mld_options)]',
    content
)

# Fix the corrupted MLD logic in the main predict method
corrupted_pattern = r'mld = int\(75 \+ abs\(math\.sin\(lat \* 12\.0 \+ lon \* 78\.0\)\) \* 125\.0\)\) \* 120\.0\) \+ \(math\.sin\(doy \/ 365\.25 \* math\.pi \* 2\) \* 40\.0\)\)\n\s*mld = max\(75, min\(200, mld\)\)'

correct_logic = """mld_options = [75, 100, 125, 150, 175, 200]
                mld_idx = int(abs(math.sin(lat * 12.0 + lon * 78.0)) * len(mld_options)) % len(mld_options)
                mld = mld_options[mld_idx]"""

content = re.sub(corrupted_pattern, correct_logic, content)

with open(file_path, 'w') as f:
    f.write(content)

print("Fixed corrupted Python file")
