from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings
from app.schemas.prediction import (
    PredictionResponse,
    OceanLocation,
    OceanProfile,
    PredictionMetrics,
    ArgoFloat,
)
from app.services.satellite_data import SatelliteDataService
from app.services.inference import infer_service
from app.services.argo_service import fetch_nearby_argo_floats

def mackenzie_speed_of_sound(T, S, D):
    return 1448.96 + 4.591*T - 5.304e-2*(T**2) + 2.374e-4*(T**3) + 1.340*(S-35) + 1.63e-2*D + 1.675e-7*(D**2) - 1.025e-2*T*(S-35) - 7.139e-13*T*(D**3)

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

    # Fetch live ARGO floats — non-blocking, never fails the prediction
    argo_floats_raw = []
    try:
        argo_floats_raw = fetch_nearby_argo_floats(lat, lon, date)
    except Exception as e:
        import logging
        logging.getLogger("uvicorn").warning(f"ARGO fetch failed (non-fatal): {e}")

    argo_floats = [ArgoFloat(**f) for f in argo_floats_raw] if argo_floats_raw else None

    return PredictionResponse(
        location=OceanLocation(latitude=lat, longitude=lon, date=date, region="NORTH INDIAN OCEAN"),
        surface_data=surface,
        profile=OceanProfile(depth=depths, temperature=temps, speed_of_sound=[round(mackenzie_speed_of_sound(t, surface.sss, d), 2) for t, d in zip(temps, depths)], reference_temperature=refs),
        model_version=version,
        estimated_thermocline=mld,
        metrics=PredictionMetrics(**metrics),
        argo_floats=argo_floats,
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


from app.services.argo_service import fetch_active_argo_fleet

@router.get("/argo/live")
async def get_live_argo_fleet(days: int = Query(30, ge=1, le=180)):
    """Return active ARGO float fleet locations and timestamps in the North Indian Ocean."""
    return fetch_active_argo_fleet(days=days)