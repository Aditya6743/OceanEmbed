import joblib
import pandas as pd
import numpy as np
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../weights/rf_3d_profile_model.pkl")

def predict_profile(latitude, longitude, date_str, surface_features):
    """
    Person 2 FastAPI Integration Endpoint
    Predicts the 15-layer subsurface temperature profile based on surface features.
    
    Args:
        latitude (float): Target latitude (5 to 30)
        longitude (float): Target longitude (45 to 105)
        date_str (str): Current date (YYYY-MM-DD)
        surface_features (dict): Contains 'sst_celsius'
        
    Returns:
        dict: Predicted temperature profile.
    """
    model = joblib.load(MODEL_PATH)
    
    # Extract features
    date_dt = pd.to_datetime(date_str)
    month = date_dt.month
    sin_month = np.sin(2 * np.pi * month / 12.0)
    cos_month = np.cos(2 * np.pi * month / 12.0)
    
    # Prepare input array: ['sst_celsius', 'latitude', 'longitude', 'sin_month', 'cos_month']
    features = np.array([[
        surface_features.get('sst_celsius', 28.0),
        latitude,
        longitude,
        sin_month,
        cos_month
    ]])
    
    predictions = model.predict(features)[0]
    target_depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]
    
    # Return in standard format
    return {
        "depths": target_depths,
        "temperature": [float(p) for p in predictions]
    }

if __name__ == "__main__":
    # Test execution
    res = predict_profile(15.0, 85.0, '2026-05-15', {
        'sst_celsius': 29.5
    })
    print("Inference Test Result:", res)
