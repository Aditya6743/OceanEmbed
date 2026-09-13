import os
import datetime
import time
import copernicusmarine
from dotenv import load_dotenv

load_dotenv()
USERNAME = os.getenv("COPERNICUS_USERNAME")
PASSWORD = os.getenv("COPERNICUS_PASSWORD")

def fetch_live_data():
    # Get today's date
    today = datetime.datetime.utcnow()
    # NRT data is usually available for the previous day or current day. We use today.
    start_date = today.strftime('%Y-%m-%dT00:00:00')
    end_date = today.strftime('%Y-%m-%dT23:59:59')
    
    print(f"[{datetime.datetime.now()}] Initiating Hourly NRT Sync for {start_date}...")
    
    # We use the NRT Forecast API which updates hourly
    try:
        copernicusmarine.subset(
            dataset_id="cmems_mod_glo_phy_anfc_0.083deg_PT1H-m",
            variables=["thetao", "so", "zos", "uo", "vo"],
            minimum_longitude=45.0,
            maximum_longitude=105.0,
            minimum_latitude=5.0,
            maximum_latitude=30.0,
            start_datetime=start_date,
            end_datetime=end_date,
            minimum_depth=0.0,
            maximum_depth=1.0, # We only need surface data! The AI predicts the depths!
            output_filename="indian_ocean_live.nc",
            output_directory="../data",
            username=USERNAME,
            password=PASSWORD,
            overwrite=True
        )
        print(f"[{datetime.datetime.now()}] SUCCESS: Live Telemetry Updated.")
    except Exception as e:
        print(f"[{datetime.datetime.now()}] ERROR fetching live data: {e}")

if __name__ == "__main__":
    print("Starting OceanEmbed Live Hourly Pipeline (Daemon Mode)...")
    while True:
        try:
            fetch_live_data()
        except Exception as e:
            print(f"Error in hourly loop: {e}")
        print(f"[{datetime.datetime.now()}] Sleeping for 60 minutes...")
        time.sleep(3600)
