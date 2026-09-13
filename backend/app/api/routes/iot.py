from fastapi import APIRouter, Query
from pydantic import BaseModel
import random

router = APIRouter()

# In a real production app, this would query the trained PyTorch model for the specific lat/lon.
# For the hackathon API simulator, we calculate logic based on mocked AI output to trigger the UI.

@router.get("/pager/{device_id}")
async def check_fisherman_pager(device_id: str, lat: float = Query(...), lon: float = Query(...)):
    """
    IoT Endpoint for Fisherman Pagers (Dynamic GPS).
    If the AI predicts high Ocean Heat Content (Cyclone Fuel) at this GPS coordinate, 
    trigger a BEEP command to the physical pager.
    """
    # Simulate the AI reading the OHC at this lat/lon
    # If they click the "Cyclone" area in the UI, we simulate a storm
    ai_predicted_ohc = random.uniform(80.0, 160.0) # kJ/cm^2
    
    if ai_predicted_ohc > 120.0:
        return {
            "device_id": device_id,
            "status": "ALERT",
            "trigger": "CYCLONE_DETECTED",
            "ohc_level": f"{ai_predicted_ohc:.1f} kJ/cm²",
            "action": "BEEP_PAGER_AND_FLASH_RED"
        }
    return {
        "device_id": device_id,
        "status": "SAFE",
        "trigger": "NONE",
        "ohc_level": f"{ai_predicted_ohc:.1f} kJ/cm²",
        "action": "NONE"
    }

@router.get("/city-gates/{city}")
async def check_smart_city_gates(city: str):
    """
    IoT Endpoint for Smart City Flood Gates (Fixed Location).
    If the AI predicts an extreme SSH anomaly (Storm Surge), 
    trigger the physical motors to lock the gates.
    """
    # Simulate the AI reading the Sea Surface Height anomaly at this city coast
    ai_predicted_ssh_anomaly = random.uniform(0.1, 3.5) # meters
    
    if ai_predicted_ssh_anomaly > 2.0:
        return {
            "city": city.upper(),
            "status": "LOCKED",
            "trigger": "STORM_SURGE",
            "ssh_anomaly": f"+{ai_predicted_ssh_anomaly:.1f}m",
            "action": "ACTIVATE_MOTORS_CLOSE_GATES"
        }
    return {
        "city": city.upper(),
        "status": "OPEN",
        "trigger": "NONE",
        "ssh_anomaly": f"+{ai_predicted_ssh_anomaly:.1f}m",
        "action": "NONE"
    }
