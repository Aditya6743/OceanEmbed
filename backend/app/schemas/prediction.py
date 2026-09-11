from pydantic import BaseModel, Field
from typing import List, Optional

class OceanLocation(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    date: str
    region: Optional[str] = "NORTH INDIAN OCEAN"

class SurfaceData(BaseModel):
    sst: float          # Sea Surface Temperature (°C)
    ssh: float          # Sea Surface Height anomaly (m)
    sss: float          # Sea Surface Salinity (PSU)
    current_u: float    # Surface current U (m/s)
    current_v: float    # Surface current V (m/s)
    wind_u: float       # Wind U (m/s)
    wind_v: float       # Wind V (m/s)

class OceanProfile(BaseModel):
    depth: List[int]
    temperature: List[float]
    speed_of_sound: Optional[List[float]] = None
    reference_temperature: Optional[List[float]] = None

class PredictionMetrics(BaseModel):
    rmse: float
    mae: float
    bias: float
    correlation: float

class ArgoFloat(BaseModel):
    id: str
    lat: float
    lon: float
    depths: List[int]
    temperatures: List[float]

class PredictionResponse(BaseModel):
    location: OceanLocation
    surface_data: SurfaceData
    profile: OceanProfile
    model_version: str
    estimated_thermocline: Optional[int] = None
    metrics: Optional[PredictionMetrics] = None
    argo_floats: Optional[List[ArgoFloat]] = None

class SatelliteMetadata(BaseModel):
    sources: List[dict]
    resolution: str
    update_cadence: str