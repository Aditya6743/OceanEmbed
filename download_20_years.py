import os
import copernicusmarine
from dotenv import load_dotenv
import time

load_dotenv()
USERNAME = os.getenv("atripathi123")
PASSWORD = os.getenv("8@.YgwF6T3.aLd4")

# 20 years ending in 2026 (2006 through 2026)
years = list(range(2006, 2027))

MIN_LON, MAX_LON = 45.0, 105.0
MIN_LAT, MAX_LAT = 5.0, 30.0

os.makedirs("data/15_years", exist_ok=True)
print(f"Starting Smart 20-year download ({years[0]} to {years[-1]})...")

for year in years:
    filename = f"indian_ocean_{year}.nc"
    filepath = f"data/15_years/{filename}"
    
    if os.path.exists(filepath):
        print(f"[{year}] Already exists. Skipping.")
        continue
        
    print(f"\n[{year}] Requesting data...")
    
    # We first try the highly-accurate Multi-Year (MY) historical reanalysis dataset.
    # MY datasets usually have a 1-2 year latency. If we hit a recent year (like 2025/2026)
    # where MY is not yet published, we catch the error and seamlessly fallback to the
    # Near-Real-Time (ANFC) live dataset!
    
    success = False
    for dataset_id in ["cmems_mod_glo_phy_my_0.083deg_P1D-m", "cmems_mod_glo_phy_anfc_0.083deg_P1D-m"]:
        if success: break
        
        try:
            print(f"  -> Trying dataset: {dataset_id}")
            copernicusmarine.subset(
                dataset_id=dataset_id,
                variables=["thetao", "so", "zos", "uo", "vo"],
                minimum_longitude=MIN_LON, maximum_longitude=MAX_LON,
                minimum_latitude=MIN_LAT, maximum_latitude=MAX_LAT,
                start_datetime=f"{year}-01-01T00:00:00",
                end_datetime=f"{year}-12-31T23:59:59",
                minimum_depth=0.0, maximum_depth=1000.0,
                output_filename=filename,
                output_directory="data/15_years",
                username=USERNAME, password=PASSWORD,
                force_download=True
            )
            print(f"[{year}] Success with {dataset_id}!")
            success = True
        except Exception as e:
            print(f"  -> {dataset_id} failed or not available for {year}.")
            time.sleep(2)
            
    if not success:
        print(f"[{year}] CRITICAL ERROR: Could not download from any dataset.")

print("\n[COMPLETE] 20-year dataset download script finished!")
