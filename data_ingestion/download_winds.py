import os
import copernicusmarine
from dotenv import load_dotenv
import time
from calendar import monthrange

load_dotenv()
USERNAME = os.getenv("COPERNICUS_USERNAME", "atripathi123")
PASSWORD = os.getenv("COPERNICUS_PASSWORD", "8@.YgwF6T3.aLd4")

# Same bounding box as the main dataset
MIN_LON, MAX_LON = 45.0, 105.0
MIN_LAT, MAX_LAT = 5.0, 30.0

def download_surface_winds():
    folder = "data/surface_winds_daily"
    os.makedirs(folder, exist_ok=True)
    
    # 5 years of daily data
    years = [2022, 2023, 2024, 2025, 2026]
    dataset_id = "cmems_obs-wind_glo_phy_my_l4_P1M"
    
    print(f"Starting lightweight 2D Wind (U, V) download...")

    for year in range(2022, 2027):
        for month in range(1, 13):
            month_str = f"{month:02d}"
            
            # The exact start and end of this month
            start_date = f"{year}-{month_str}-01 00:00:00"
            end_date = f"{year}-{month_str}-28 23:59:59"
            
            out_file = f"wind_monthly_{year}_{month_str}.nc"
            out_path = os.path.join(folder, out_file)
            
            if os.path.exists(out_path):
                print(f"[{year}-{month_str}] Already exists. Skipping.")
                continue
                
            print(f"[{year}-{month_str}] Downloading...")
            
            try:
                copernicusmarine.subset(
                    dataset_id=dataset_id,
                    variables=["eastward_wind", "northward_wind"],
                    minimum_longitude=MIN_LON, maximum_longitude=MAX_LON,
                    minimum_latitude=MIN_LAT, maximum_latitude=MAX_LAT,
                    start_datetime=start_date,
                    end_datetime=end_date,
                    output_filename=out_file,
                    output_directory=folder,
                    username=USERNAME, password=PASSWORD,
                    force_download=True,
                )
                print(f"[{year}-{month_str}] Success!")
            except Exception as e:
                print(f"[{year}-{month_str}] CRITICAL ERROR: Could not download chunk.")
                print(e)
                try:
                    print("  -> Attempting fallback to NRT (Forecast) dataset...")
                    copernicusmarine.subset(
                        dataset_id="cmems_obs-wind_glo_phy_nrt_l4_0.125deg_P1D",
                        variables=["eastward_wind", "northward_wind"],
                        minimum_longitude=MIN_LON, maximum_longitude=MAX_LON,
                        minimum_latitude=MIN_LAT, maximum_latitude=MAX_LAT,
                        start_datetime=f"{year}-{month_str}-01T00:00:00",
                        end_datetime=f"{year}-{month_str}-{last_day}T23:59:59",
                        output_filename=filename,
                        output_directory=folder,
                        username=USERNAME, password=PASSWORD,
                        force_download=True,
                    )
                    print(f"[{year}-{month_str}] Fallback Success!")
                except Exception as e2:
                    print(f"[{year}-{month_str}] Fallback Failed.")

if __name__ == "__main__":
    download_surface_winds()
