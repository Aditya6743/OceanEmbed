from fastapi import APIRouter
from app.schemas.prediction import SatelliteMetadata

router = APIRouter()

@router.get("/metadata/satellites", response_model=SatelliteMetadata)
def get_satellite_metadata():
    return SatelliteMetadata(
        sources=[
            {"parameter": "Sea Surface Temperature (SST)", "sensor": "Sentinel-3 SLSTR / NOAA AVHRR", "status": "NOMINAL"},
            {"parameter": "Sea Surface Height (SSH)", "sensor": "Sentinel-6 Michael Freilich / Jason-3", "status": "NOMINAL"},
            {"parameter": "Sea Surface Salinity (SSS)", "sensor": "SMAP / SMOS", "status": "NOMINAL"},
            {"parameter": "Surface Winds & Currents", "sensor": "Copernicus Marine In-Situ", "status": "NOMINAL"}
        ],
        resolution="0.25 deg Gridded",
        update_cadence="Daily assimilation"
    )