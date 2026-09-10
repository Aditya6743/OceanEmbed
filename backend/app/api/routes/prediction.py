from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings
from app.schemas.prediction import (
    PredictionResponse,
    OceanLocation,
    OceanProfile,
    PredictionMetrics,
)
from app.services.satellite_data import SatelliteDataService
from app.services.inference import infer_service

router = APIRouter()


@router.get("/predict", response_model=PredictionResponse)
async def predict_profile(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    date: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$"),
):
    if not (settings.LAT_MIN <= lat <= settings.LAT_MAX and settings.LON_MIN <= lon <= settings.LON_MAX):
        raise HTTPException(
            status_code=400,
            detail=f"Target ({lat}, {lon}) out of bounds. Must be within [{settings.LAT_MIN}, {settings.LAT_MAX}]N, [{settings.LON_MIN}, {settings.LON_MAX}]E."
        )

    surface = SatelliteDataService.get_surface_observations(lat, lon, date)
    depths, temps, refs, mld, version, metrics = infer_service.predict(
        surface.sst, surface.ssh, surface.sss, lat, lon, date
    )

    return PredictionResponse(
        location=OceanLocation(latitude=lat, longitude=lon, date=date, region="NORTH INDIAN OCEAN"),
        surface_data=surface,
        profile=OceanProfile(depth=depths, temperature=temps, reference_temperature=refs),
        model_version=version,
        estimated_thermocline=mld,
        metrics=PredictionMetrics(**metrics),
    )

from app.schemas.history import HistoryResponse
from app.services.history_service import history_service

@router.get("/history", response_model=HistoryResponse)
async def get_history(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    if not (settings.LAT_MIN <= lat <= settings.LAT_MAX and settings.LON_MIN <= lon <= settings.LON_MAX):
        raise HTTPException(
            status_code=400,
            detail=f"Target ({lat}, {lon}) out of bounds. Must be within [{settings.LAT_MIN}, {settings.LAT_MAX}]N, [{settings.LON_MIN}, {settings.LON_MAX}]E."
        )
        
    data = history_service.get_history(lat, lon)
    return HistoryResponse(history=data)