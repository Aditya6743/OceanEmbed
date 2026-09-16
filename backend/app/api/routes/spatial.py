from fastapi import APIRouter, Query
from fastapi.responses import FileResponse
import os
from app.services.spatial_engine import SpatialEngine

router = APIRouter()
spatial_engine = SpatialEngine()

@router.get("/heatmap/{layer}")
async def get_heatmap(layer: str, date: str = Query("2026-06-01")):
    if layer not in ["tchp", "navy", "fishery", "benthic", "iod", "ssh", "sst", "currents"]:
        return {"error": "Invalid layer"}
        
    cache_dir = os.path.join(os.path.dirname(__file__), "../../../cache")
    file_path = os.path.join(cache_dir, f"{date}_{layer}.png")
    
    if not os.path.exists(file_path):
        print(f"Heatmap {date}_{layer}.png missing. Generating spatial heatmaps for {date}...")
        spatial_engine.generate_heatmaps(date)
        
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "Heatmap generation failed"}
