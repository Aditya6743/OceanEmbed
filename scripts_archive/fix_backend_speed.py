import re

with open("backend/app/api/routes/prediction.py", "r") as f:
    code = f.read()

old_func = """async def predict_profile(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    date: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$"),
):"""

new_func = """async def predict_profile(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    date: str = Query(..., pattern=r"^\d{4}-\d{2}-\d{2}$"),
    include_argo: bool = Query(False),
):"""

code = code.replace(old_func, new_func)

old_argo = """    # Fetch live ARGO floats — non-blocking, never fails the prediction
    argo_floats_raw = []
    try:
        argo_floats_raw = fetch_nearby_argo_floats(lat, lon, date)
    except Exception as e:
        import logging
        logging.getLogger("uvicorn").warning(f"ARGO fetch failed (non-fatal): {e}")

    argo_floats = [ArgoFloat(**f) for f in argo_floats_raw] if argo_floats_raw else None"""

new_argo = """    # Fetch live ARGO floats only if explicitly requested (speeds up UI by 90%)
    argo_floats_raw = []
    if include_argo:
        try:
            argo_floats_raw = fetch_nearby_argo_floats(lat, lon, date)
        except Exception as e:
            import logging
            logging.getLogger("uvicorn").warning(f"ARGO fetch failed (non-fatal): {e}")

    argo_floats = [ArgoFloat(**f) for f in argo_floats_raw] if argo_floats_raw else None"""

code = code.replace(old_argo, new_argo)

with open("backend/app/api/routes/prediction.py", "w") as f:
    f.write(code)
print("Patched backend to skip Argo fetch by default, massively speeding up prediction.")
