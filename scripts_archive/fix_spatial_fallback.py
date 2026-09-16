with open("backend/app/services/spatial_engine.py", "r") as f:
    code = f.read()

target = """        ds = SatelliteDataService.get_dataset(year, month)
        if ds is None:
            print(f"Failed to load dataset for {date_str}")
            return"""

replacement = """        ds = SatelliteDataService.get_dataset(year, month)
        if ds is None:
            print(f"Failed to load dataset for {year}-{month}, falling back to 2026-06")
            ds = SatelliteDataService.get_dataset("2026", "06")
            if ds is None:
                print("Critical: 2026-06 dataset also missing!")
                return"""

code = code.replace(target, replacement)

with open("backend/app/services/spatial_engine.py", "w") as f:
    f.write(code)
