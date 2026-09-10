"""
Live ARGO Float Service — Fetches real profiles from the Argovis REST API
(https://argovis-api.colorado.edu) and interpolates them to standard depths.
"""

import logging
import json
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timedelta
from typing import List, Optional

import numpy as np

logger = logging.getLogger("uvicorn")

ARGOVIS_BASE = "https://argovis-api.colorado.edu"
STANDARD_DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]

# Search radius in degrees around the queried point
SEARCH_RADIUS = 3.0
# How far back in time (days) to search for nearby floats
SEARCH_DAYS = 90
# Maximum number of floats to return
MAX_FLOATS = 3
# Timeout for Argovis HTTP calls (seconds)
HTTP_TIMEOUT = 8


def _fetch_json(url: str) -> Optional[list]:
    """Fetch JSON from Argovis, returning None on any failure."""
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
            return json.loads(resp.read().decode())
    except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, Exception) as e:
        logger.warning(f"Argovis fetch failed: {e}")
        return None


def _extract_pressure_temp(profile: dict) -> tuple[list[float], list[float]]:
    """
    Extract paired (pressure, temperature) from an Argovis profile.
    
    Argovis returns `data` as a 2D array: [[pressure_values...], [temperature_values...]]
    Many entries are null — we filter to only non-null paired values.
    Pressure in decibar ≈ depth in meters for practical purposes.
    """
    data = profile.get("data")
    if not data or len(data) < 2:
        return [], []

    pressures_raw = data[0]
    temps_raw = data[1]

    pressures = []
    temps = []
    for p, t in zip(pressures_raw, temps_raw):
        if p is not None and t is not None:
            pressures.append(float(p))
            temps.append(float(t))

    return pressures, temps


def _interpolate_to_standard_depths(
    pressures: list[float], temps: list[float]
) -> Optional[tuple[list[int], list[float]]]:
    """
    Interpolate measured (pressure, temp) pairs to the 15 standard depths.
    Returns None if there isn't enough data to interpolate.
    """
    if len(pressures) < 3:
        return None

    pressures_arr = np.array(pressures)
    temps_arr = np.array(temps)

    # Sort by pressure (should already be, but just in case)
    sort_idx = np.argsort(pressures_arr)
    pressures_arr = pressures_arr[sort_idx]
    temps_arr = temps_arr[sort_idx]

    max_depth_available = pressures_arr[-1]
    
    # Only interpolate for depths within the measured range
    valid_depths = [d for d in STANDARD_DEPTHS if d <= max_depth_available + 50]
    if len(valid_depths) < 3:
        return None

    interpolated_temps = np.interp(
        valid_depths, pressures_arr, temps_arr
    ).tolist()

    return (
        valid_depths,
        [round(t, 3) for t in interpolated_temps],
    )


def fetch_nearby_argo_floats(
    lat: float, lon: float, date_str: str
) -> List[dict]:
    """
    Query Argovis for real ARGO profiles near (lat, lon) and return
    up to MAX_FLOATS profiles interpolated to standard depths.
    
    Returns a list of dicts matching the ArgoFloat schema:
      { id, lat, lon, depths, temperatures }
    """
    try:
        end_date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        end_date = datetime.utcnow()

    start_date = end_date - timedelta(days=SEARCH_DAYS)

    # Argovis box format: [[lon_min, lat_min], [lon_max, lat_max]]
    lon_min = lon - SEARCH_RADIUS
    lon_max = lon + SEARCH_RADIUS
    lat_min = lat - SEARCH_RADIUS
    lat_max = lat + SEARCH_RADIUS

    # Step 1: Search for profiles in the bounding box (minimal compression for listing)
    box_param = f"[[{lon_min},{lat_min}],[{lon_max},{lat_max}]]"
    search_url = (
        f"{ARGOVIS_BASE}/argo"
        f"?box={urllib.parse.quote(box_param, safe='')}"
        f"&startDate={start_date.strftime('%Y-%m-%dT00:00:00Z')}"
        f"&endDate={end_date.strftime('%Y-%m-%dT23:59:59Z')}"
        f"&compression=minimal"
    )

    listing = _fetch_json(search_url)
    if not listing or not isinstance(listing, list) or len(listing) == 0:
        logger.info(f"No ARGO floats found near ({lat}, {lon}) within ±{SEARCH_RADIUS}° / {SEARCH_DAYS} days")
        return []

    # Each item in minimal listing: [id, lat, lon, timestamp, sources, metadata]
    # Sort by distance to the query point, take closest MAX_FLOATS
    def distance_sq(item):
        try:
            ilat, ilon = float(item[1]), float(item[2])
            return (ilat - lat) ** 2 + (ilon - lon) ** 2
        except (IndexError, TypeError, ValueError):
            return float("inf")

    listing.sort(key=distance_sq)
    candidates = listing[:MAX_FLOATS]

    # Step 2: Fetch full profiles with pressure + temperature data
    results = []
    for item in candidates:
        try:
            profile_id = item[0]
            plat = float(item[1])
            plon = float(item[2])
        except (IndexError, TypeError, ValueError):
            continue

        profile_url = f"{ARGOVIS_BASE}/argo?id={profile_id}&data=pressure,temperature"
        profiles = _fetch_json(profile_url)
        if not profiles or len(profiles) == 0:
            continue

        profile = profiles[0]
        pressures, temps = _extract_pressure_temp(profile)

        interp = _interpolate_to_standard_depths(pressures, temps)
        if interp is None:
            continue

        depths, temperatures = interp
        results.append({
            "id": str(profile_id),
            "lat": round(plat, 4),
            "lon": round(plon, 4),
            "depths": depths,
            "temperatures": temperatures,
        })

    logger.info(f"Fetched {len(results)} live ARGO profiles near ({lat}, {lon})")
    return results


def fetch_active_argo_fleet(days: int = 30) -> List[dict]:
    """
    Fetch all active ARGO floats in the North Indian Ocean basin with their
    latest coordinates and measurement timestamps.
    """
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)

    box_param = "[[45,5],[105,30]]"
    search_url = (
        f"{ARGOVIS_BASE}/argo"
        f"?box={urllib.parse.quote(box_param, safe='')}"
        f"&startDate={start_date.strftime('%Y-%m-%dT00:00:00Z')}"
        f"&endDate={end_date.strftime('%Y-%m-%dT23:59:59Z')}"
        f"&compression=minimal"
    )

    listing = _fetch_json(search_url)
    if not listing or not isinstance(listing, list):
        return []

    markers = []
    for item in listing[:50]:
        try:
            full_id = str(item[0])
            wmo = full_id.split('_')[0]
            cycle = int(full_id.split('_')[1]) if '_' in full_id else None
            plon = float(item[1])
            plat = float(item[2])
            timestamp = str(item[3])
            data_types = item[4] if len(item) > 4 and isinstance(item[4], list) else ["argo_core"]

            markers.append({
                "id": wmo,
                "cycle_number": cycle,
                "lat": round(plat, 4),
                "lon": round(plon, 4),
                "timestamp": timestamp,
                "data_types": data_types
            })
        except (IndexError, TypeError, ValueError):
            continue

    return markers
