import os
import copernicusmarine
from dotenv import load_dotenv

load_dotenv()
USERNAME = os.getenv("COPERNICUS_USERNAME")
PASSWORD = os.getenv("COPERNICUS_PASSWORD")

if not USERNAME or USERNAME == "your_username_here":
    print("[ERROR] Missing Copernicus credentials in .env")
    exit(1)

print("Starting Copernicus API Download for 1 FULL YEAR (North Indian Ocean)...")
print("This is a massive dataset. It will take several minutes to process and download...")

try:
    copernicusmarine.subset(
        dataset_id="cmems_mod_glo_phy_my_0.083deg_P1D-m",
        variables=["thetao", "so", "zos", "uo", "vo"],
        minimum_longitude=45.0,
        maximum_longitude=105.0,
        minimum_latitude=5.0,
        maximum_latitude=30.0,
        start_datetime="2020-01-01T00:00:00",
        end_datetime="2020-12-31T23:59:59",
        minimum_depth=0.0,
        maximum_depth=1000.0,
        output_filename="indian_ocean_1year.nc",
        output_directory="./data",
        username=USERNAME,
        password=PASSWORD,
        force_download=True
    )
    print("\n[SUCCESS] 1-Year dataset downloaded successfully to data/indian_ocean_1year.nc!")
except Exception as e:
    print(f"\n[ERROR] Download failed: {e}")
