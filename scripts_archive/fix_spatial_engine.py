with open("backend/app/services/spatial_engine.py", "r") as f:
    code = f.read()

target = """    def generate_heatmaps(self, date_str="2026-06-01"):
        print(f"Generating Spatial ML Heatmaps for {date_str}...")
        ds = SatelliteDataService.get_dataset(date_str)"""

replacement = """    def generate_heatmaps(self, date_str="2026-06-01"):
        print(f"Generating Spatial ML Heatmaps for {date_str}...")
        try:
            year, month, _ = date_str.split('-')
        except:
            year, month = "2026", "06"
        ds = SatelliteDataService.get_dataset(year, month)"""

code = code.replace(target, replacement)

with open("backend/app/services/spatial_engine.py", "w") as f:
    f.write(code)
