import os
import copernicusmarine
from dotenv import load_dotenv
import time
import argparse

load_dotenv()
USERNAME = os.getenv("COPERNICUS_USERNAME", "atripathi123")
PASSWORD = os.getenv("COPERNICUS_PASSWORD", "8@.YgwF6T3.aLd4")

MIN_LON, MAX_LON = 45.0, 105.0
MIN_LAT, MAX_LAT = 5.0, 30.0

def download_data(start_year, end_year, resolution, folder):
    years = list(range(start_year, end_year + 1))
    os.makedirs(folder, exist_ok=True)
    
    # Select dataset suffix based on resolution
    # P1D-m = daily, P1M-m = monthly
    res_suffix = "P1D-m" if resolution == "daily" else "P1M-m"
    
    print(f"Starting {len(years)}-year {resolution} download ({years[0]} to {years[-1]})...")

    for year in years:
        filename = f"indian_ocean_{resolution}_{year}.nc"
        filepath = f"{folder}/{filename}"
        
        if os.path.exists(filepath):
            print(f"[{year}] Already exists. Skipping.")
            continue
            
        print(f"\n[{year}] Requesting {resolution} data...")
        
        success = False
        datasets = [
            f"cmems_mod_glo_phy_my_0.083deg_{res_suffix}",
            f"cmems_mod_glo_phy_anfc_0.083deg_{res_suffix}"
        ]
        
        for dataset_id in datasets:
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
                    output_directory=folder,
                    username=USERNAME, password=PASSWORD,
                    force_download=True
                )
                print(f"[{year}] Success with {dataset_id}!")
                success = True
            except Exception as e:
                print(f"  -> {dataset_id} failed: {str(e)[:100]}")
                time.sleep(2)
                
        if not success:
            print(f"[{year}] CRITICAL ERROR: Could not download from any dataset.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", choices=["30yr", "5yr"], required=True)
    args = parser.parse_args()
    
    if args.type == "30yr":
        # 30 years monthly (1997 - 2026)
        download_data(1997, 2026, "monthly", "data/30_years_monthly")
    elif args.type == "5yr":
        # 5 years daily (2022 - 2026)
        download_data(2022, 2026, "daily", "data/5_years_daily")
