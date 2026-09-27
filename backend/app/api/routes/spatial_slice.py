from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings
from pydantic import BaseModel
from typing import List, Optional
import math
import numpy as np
from datetime import datetime
from app.services.satellite_data import SatelliteDataService

router = APIRouter()

class DepthSliceResponse(BaseModel):
    depth: float
    variable: str
    units: str
    lats: List[float]
    lons: List[float]
    values: List[List[Optional[float]]]
    model_version: str

@router.get("/depth-slice", response_model=DepthSliceResponse)
async def get_depth_slice(
    depth: float = Query(..., description="Target depth in meters"),
    date: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
):
    try:
        dt = datetime.strptime(date, "%Y-%m-%d")
        year = dt.strftime("%Y")
        month = dt.strftime("%m")
    except:
        year, month = "2026", "06"

    # Actual dimensions configured in settings
    lat_min, lat_max = settings.LAT_MIN, settings.LAT_MAX
    lon_min, lon_max = settings.LON_MIN, settings.LON_MAX

    ds = SatelliteDataService.get_dataset(year, month)
    
    lats = []
    lons = []
    values = []
    
    if ds is not None:
        try:
            ds_subset = ds.sel(
                latitude=slice(lat_min, lat_max),
                longitude=slice(lon_min, lon_max)
            )
            
            if 'time' in ds_subset.dims:
                try:
                    ds_subset = ds_subset.sel(time=date, method="nearest")
                except:
                    ds_subset = ds_subset.isel(time=0)
                    
            if 'depth' in ds_subset.dims:
                ds_subset = ds_subset.sel(depth=depth, method="nearest")
                
            temp_grid = ds_subset.thetao.values
            lat_grid = ds_subset.latitude.values.tolist()
            lon_grid = ds_subset.longitude.values.tolist()
            
            # None mapping for missing data (Land)
            values = np.where(np.isnan(temp_grid), None, temp_grid).tolist()
            
            return DepthSliceResponse(
                depth=depth,
                variable="temperature",
                units="°C",
                lats=lat_grid,
                lons=lon_grid,
                values=values,
                model_version="OceanEmbed V6 (Xarray backend)"
            )
        except Exception as e:
            print(f"Dataset extraction failed: {e}")
            pass
            
    # Fallback to simulated data matching the EXACT full bounds
    lats = list(np.arange(lat_min, lat_max + 0.25, 0.25))
    lons = list(np.arange(lon_min, lon_max + 0.25, 0.25))
    
    def is_land(lat, lon):
        # Expanded landmask for 45E-105E and 5N-30N
        # Arabian Peninsula / Africa
        if lat > 12 and lon < 60: return True
        if lat > 22 and lon < 68: return True
        # India
        if lat >= 8 and lat <= 26:
            w = 77.5 - (lat - 8) * 0.42
            e = 77.5 + (lat - 8) * 0.65
            if lon >= w and lon <= e: return True
        # Northern boundary (Himalayas / China)
        if lat > 26 and lon > 68: return True
        # Sri Lanka
        if 6 < lat < 9.5 and 79.5 < lon < 81.8: return True
        # SE Asia
        if lat > 15 and lon > 93.5: return True
        if lat > 10 and lon > 97: return True
        if lat > 5 and lon > 99: return True
        return False

    day_of_year = dt.timetuple().tm_yday
    season_offset = math.sin(2 * math.pi * (day_of_year - 80) / 365) * 1.5
    
    for lat in lats:
        row = []
        for lon in lons:
            if is_land(lat, lon):
                row.append(None)
            else:
                equator_dist = abs(lat) / 30.0
                sst_base = 30.5 - (equator_dist * 4.0) + season_offset
                
                mld = 40 + abs(lat) * 1.2
                deep_ocean_floor = 2.0 + (math.sin(lat) * 0.4) + (math.cos(sst_base) * 0.3)
                
                if depth <= mld:
                    temp = sst_base - (depth / mld) * 0.5 
                else:
                    decay = math.exp(-(depth - mld) / 300.0)
                    temp = deep_ocean_floor + (sst_base - deep_ocean_floor - 0.5) * decay
                
                eddy = math.sin(lat * 0.8 + lon * 0.5) * math.cos(lon * 0.7)
                temp += eddy * (1.0 - min(depth/1000, 1.0))
                
                row.append(round(temp, 2))
        values.append(row)
        
    return DepthSliceResponse(
        depth=depth,
        variable="temperature",
        units="°C",
        lats=lats,
        lons=lons,
        values=values,
        model_version="OceanEmbed V6 (Physics Fallback)"
    )
