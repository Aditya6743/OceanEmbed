import re

file_path = 'backend/app/services/inference.py'
with open(file_path, 'r') as f:
    content = f.read()

# Fix the over-indented line 232
content = content.replace(
"""        else:
            preds = self._mock_profile(sst, lat, lon, doy)
            mld_options = [75, 100, 125, 150, 175, 200]
            spatial_val = (math.sin(lat * 0.2) + math.cos(lon * 0.2) + 2) / 4
                mld_idx = int(spatial_val * 0.999 * len(mld_options))
            mld = mld_options[mld_idx]""",
"""        else:
            preds = self._mock_profile(sst, lat, lon, doy)
            mld_options = [75, 100, 125, 150, 175, 200]
            spatial_val = (math.sin(lat * 0.2) + math.cos(lon * 0.2) + 2) / 4
            mld_idx = int(spatial_val * 0.999 * len(mld_options))
            mld = mld_options[mld_idx]"""
)

with open(file_path, 'w') as f:
    f.write(content)
