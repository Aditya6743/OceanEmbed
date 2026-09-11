from fastapi import APIRouter
from fastapi.responses import FileResponse
import os
from app.services.spatial_engine import SpatialEngine

router = APIRouter()
spatial_engine = SpatialEngine()

@router.get("/heatmap/{layer}")
async def get_heatmap(layer: str):
    # Security check to prevent path traversal
    if layer not in ["tchp", "navy", "fishery", "benthic", "iod"]:
        return {"error": "Invalid layer"}
        
    cache_dir = os.path.join(os.path.dirname(__file__), "../../../cache")
    file_path = os.path.join(cache_dir, f"{layer}.png")
    
    if not os.path.exists(file_path):
        print(f"Heatmap {layer}.png missing. Generating all spatial heatmaps now...")
        spatial_engine.generate_heatmaps()
        
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "Heatmap generation failed"}
