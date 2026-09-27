import re

file_path = 'backend/app/services/inference.py'
with open(file_path, 'r') as f:
    content = f.read()

# Fix indentation around line 229
content = content.replace(
"""        else:
            preds = self._mock_profile(sst, lat, lon, doy)
            mld_options = [75, 100, 125, 150, 175, 200]
                mld_idx = int(abs(math.sin(lat * 12.0 + lon * 78.0)) * len(mld_options)) % len(mld_options)
                mld = mld_options[mld_idx]""",
"""        else:
            preds = self._mock_profile(sst, lat, lon, doy)
            mld_options = [75, 100, 125, 150, 175, 200]
            mld_idx = int(abs(math.sin(lat * 12.0 + lon * 78.0)) * len(mld_options)) % len(mld_options)
            mld = mld_options[mld_idx]"""
)

with open(file_path, 'w') as f:
    f.write(content)
