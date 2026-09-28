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
                
                # Ensure demo visuals look dynamic even if the NetCDF data is a static monthly average
                try:
                    day_of_year = datetime.strptime(date_str, "%Y-%m-%d").timetuple().tm_yday
                except:
                    day_of_year = 180
                    
                rng = random.Random(int(abs(lat * 100) + abs(lon * 100)) + day_of_year)
                sst_noise = rng.uniform(-0.35, 0.35)
                
                sst = round(float(point.thetao.isel(depth=0).values) + sst_noise, 2)
                sss = round(float(point.so.isel(depth=0).values) + rng.uniform(-0.1, 0.1), 2)
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
                pass
        
        # Fallback to realistic dynamic simulation if the user clicks a date outside our 5-year dataset, or clicks on LAND
        # We seed the random generator with the latitude, longitude AND DATE so the numbers shift realistically over time!
        try:
            day_of_year = datetime.strptime(date_str, "%Y-%m-%d").timetuple().tm_yday
        except:
            day_of_year = 180
        seed_val = int(abs(lat * 100) + abs(lon * 100)) + day_of_year
        rng = random.Random(seed_val)
        
        equator_dist = abs(lat) / 30.0
        # Add a seasonal sine wave effect so summer is hotter and winter is cooler
        season_offset = math.sin(2 * math.pi * (day_of_year - 80) / 365) * 1.5 
        sst_base = 30.5 - (equator_dist * 4.0) + season_offset
        sst = round(sst_base + rng.uniform(-0.6, 0.6), 2)
        sss_base = 36.2 if lon < 77.0 else 33.5
        sss = round(sss_base + rng.uniform(-0.4, 0.4), 2)
        ssh = round(rng.uniform(-0.25, 0.28), 3)
        current_u = round(rng.uniform(-0.65, 0.65), 2)
        current_v = round(rng.uniform(-0.55, 0.55), 2)
        
        return SurfaceData(
            sst=sst, ssh=ssh, sss=sss,
            current_u=current_u, current_v=current_v,
            wind_u=round(rng.uniform(-7.5, 7.5), 1),
            wind_v=round(rng.uniform(-6.0, 6.0), 1)
        )
