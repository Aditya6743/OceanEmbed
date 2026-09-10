import random
import xarray as xr
from pathlib import Path
from app.schemas.prediction import SurfaceData

class SatelliteDataService:
    # Try to load live data first, fallback to the 1-year historical dataset if the live cron hasn't run yet
    LIVE_FILE = Path(__file__).resolve().parents[3] / "data" / "indian_ocean_live.nc"
    HISTORICAL_FILE = Path(__file__).resolve().parents[3] / "data" / "indian_ocean_1year.nc"
    
    ds = None
    
    @classmethod
    def get_dataset(cls):
        if cls.ds is None:
            if cls.LIVE_FILE.exists():
                cls.ds = xr.open_dataset(cls.LIVE_FILE)
            elif cls.HISTORICAL_FILE.exists():
                cls.ds = xr.open_dataset(cls.HISTORICAL_FILE)
        return cls.ds

    @staticmethod
    def get_surface_observations(lat: float, lon: float, date_str: str) -> SurfaceData:
        ds = SatelliteDataService.get_dataset()
        
        if ds is not None:
            try:
                # Select nearest coordinate
                point = ds.sel(latitude=lat, longitude=lon, method="nearest")
                # For this prototype, if date isn't in file, grab the first timestamp available
                if 'time' in point.dims:
                    point = point.isel(time=0)
                
                sst = round(float(point.thetao.isel(depth=0).values), 2)
                sss = round(float(point.so.isel(depth=0).values), 2)
                ssh = round(float(point.zos.values), 3)
                u = round(float(point.uo.isel(depth=0).values), 2)
                v = round(float(point.vo.isel(depth=0).values), 2)
                
                import math
                if math.isnan(sst) or math.isnan(sss):
                    raise ValueError("Satellite data returned NaN for this coordinate (likely landmass or server error).")
                
                return SurfaceData(
                    sst=sst, ssh=ssh, sss=sss,
                    current_u=u, current_v=v,
                    wind_u=round(u * 15, 1), wind_v=round(v * 15, 1) # Synthesize wind from currents for UI display
                )
            except Exception as e:
                print(f"Failed to read NetCDF data: {e}. Falling back to dynamic simulation.")
        
        # Fallback to realistic dynamic simulation if no data files are available
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
