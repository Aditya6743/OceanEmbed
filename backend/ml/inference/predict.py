import joblib
import pandas as pd
import numpy as np
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/rf_sst_model.pkl")

def predict_profile(latitude, longitude, date_str, surface_features):
    """
    Person 2 FastAPI Integration Endpoint
    Predicts the future SST at the specified coordinates based on current features.
    
    Args:
        latitude (float): Target latitude (5 to 30)
        longitude (float): Target longitude (45 to 105)
        date_str (str): Current date (YYYY-MM-DD)
        surface_features (dict): Contains 'sst_celsius', 'sst_lag1', 'sst_lag3'
        
    Returns:
        dict: Predicted future SST.
    """
    model = joblib.load(MODEL_PATH)
    
    # Extract features
    date_dt = pd.to_datetime(date_str)
    day_of_year = date_dt.dayofyear
    sin_day = np.sin(2 * np.pi * day_of_year / 365.0)
    cos_day = np.cos(2 * np.pi * day_of_year / 365.0)
    
    # Prepare input array (order must match training)
    # ['sst_celsius', 'sst_lag1', 'sst_lag3', 'latitude', 'longitude', 'sin_day', 'cos_day']
    features = np.array([[
        surface_features.get('sst_celsius', 28.0),
        surface_features.get('sst_lag1', 28.0),
        surface_features.get('sst_lag3', 28.0),
        latitude,
        longitude,
        sin_day,
        cos_day
    ]])
    
    prediction = model.predict(features)[0]
    
    # Return in standard format
    return {
        "depths": [0], # SST is surface (depth 0)
        "temperature": [float(prediction)]
    }

if __name__ == "__main__":
    # Test execution
    res = predict_profile(15.0, 85.0, '2026-09-04', {
        'sst_celsius': 29.5,
        'sst_lag1': 29.4,
        'sst_lag3': 29.2
    })
    print("Inference Test Result:", res)
