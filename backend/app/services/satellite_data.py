import random
import math
from pathlib import Path
from datetime import datetime
from app.schemas.prediction import SurfaceData

class SatelliteDataService:
    # Cache the currently loaded dataset to avoid reloading the same file
    ds = None
    current_loaded_file = None

    @classmethod
    def get_dataset(cls, year: str, month: str):
        try:
            import xarray as xr
            file_path = Path(__file__).resolve().parents[3] / "data" / "processed_0.25deg" / "daily" / f"indian_ocean_daily_{year}_{month}.nc"
            
            # If we already have this specific month loaded, return it instantly
            if cls.current_loaded_file == str(file_path) and cls.ds is not None:
                return cls.ds
                
            if file_path.exists():
                cls.ds = xr.open_dataset(file_path)
                cls.current_loaded_file = str(file_path)
                return cls.ds
        except Exception as e:
            print(f"Error loading dataset: {e}")
        return None

    @staticmethod
    def get_surface_observations(lat: float, lon: float, date_str: str) -> SurfaceData:
        # Parse the date from the frontend UI
        try:
            # Handle standard YYYY-MM-DD format
            dt = datetime.strptime(date_str, "%Y-%m-%d")
            year = dt.strftime("%Y")
            month = dt.strftime("%m")
        except:
            # Fallback if UI sends something weird
            year, month = "2026", "06"
            date_str = "2026-06-01"

        ds = SatelliteDataService.get_dataset(year, month)
        
        if ds is not None:
            try:
                # Select exact spatial coordinate
                point = ds.sel(latitude=lat, longitude=lon, method="nearest")
                
                # Select exact TIME matching the UI calendar
                if 'time' in point.dims or 'time' in point.sizes:
                    try:
                        point = point.sel(time=date_str, method="nearest")
                    except:
                        # Fallback to first index if exact date fails
                        point = point.isel(time=0)
                
                sst = round(float(point.thetao.isel(depth=0).values), 2)
                sss = round(float(point.so.isel(depth=0).values), 2)
                ssh = round(float(point.zos.values), 3)
                u = round(float(point.uo.isel(depth=0).values), 2)
                v = round(float(point.vo.isel(depth=0).values), 2)
                
                if math.isnan(sst) or math.isnan(sss):
                    raise ValueError("Satellite data returned NaN for this coordinate.")
                
                return SurfaceData(
                    sst=sst, ssh=ssh, sss=sss,
                    current_u=u, current_v=v,
                    wind_u=round(u * 15, 1), wind_v=round(v * 15, 1) # Synthesize wind
                )
            except Exception as e:
                print(f"Failed to extract real data for {date_str}: {e}. Falling back.")
        
        # Fallback to realistic dynamic simulation if the user clicks a date outside our 5-year dataset (like 2010 or 2030)
        equator_dist = abs(lat) / 30.0
        sst_base = 30.5 - (equator_dist * 4.0)
        sst = round(sst_base + random.uniform(-0.6, 0.6), 2)
        sss_base = 36.2 if lon < 77.0 else 33.5
        sss = round(sss_base + random.uniform(-0.4, 0.4), 2)
        ssh = round(random.uniform(-0.25, 0.28), 3)
        current_u = round(random.uniform(-0.65, 0.65), 2)
        current_v = round(random.uniform(-0.55, 0.55), 2)
        
        return SurfaceData(
            sst=sst, ssh=ssh, sss=sss,
            current_u=current_u, current_v=current_v,
            wind_u=round(random.uniform(-7.5, 7.5), 1),
            wind_v=round(random.uniform(-6.0, 6.0), 1)
        )
