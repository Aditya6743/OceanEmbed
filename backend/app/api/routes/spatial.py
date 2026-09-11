from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/heatmap/{layer}")
async def get_heatmap(layer: str):
    # Security check to prevent path traversal
    if layer not in ["tchp", "navy", "fishery", "benthic", "iod"]:
        return {"error": "Invalid layer"}
        
    cache_dir = os.path.join(os.path.dirname(__file__), "../../../cache")
    file_path = os.path.join(cache_dir, f"{layer}.png")
    
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "Heatmap not found"}
