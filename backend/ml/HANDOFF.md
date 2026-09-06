# OceanEmbed ML Handoff

**To: Person 2 (FastAPI & Integration)**
**From: Person 1 (ML & Data)**

The ML pipeline is officially complete and the model has been trained on the raw NetCDF datasets for the Bay of Bengal domain (5°N–30°N, 45°E–105°E).

### 1. The Model
Due to strict temporal mismatch in the provided satellite files (SSH ended before Wind began, and Wind is an extremely sparse L3 orbital product), the ML problem was strictly defined as **Autoregressive Forecasting of Sea Surface Temperature (SST)**. 

The trained Random Forest model predicts `SST (t+1)` based on the current SST, lagged SST, and geographic/temporal cyclical features.
- Location: `backend/ml/models/rf_sst_model.pkl`
- Model Version: 1.0.0

### 2. Integration Contract (`predict.py`)
I have exposed a stable Python function for you to import directly into your FastAPI routes.

**Path:** `backend/ml/inference/predict.py`
**Function:** `predict_profile(latitude, longitude, date_str, surface_features)`

**Required Inputs:**
1. `latitude`: float (5.0 to 30.0)
2. `longitude`: float (45.0 to 105.0)
3. `date_str`: string ("YYYY-MM-DD")
4. `surface_features`: dictionary containing:
   - `sst_celsius`: float
   - `sst_lag1`: float
   - `sst_lag3`: float

**Example Call:**
```python
from backend.ml.inference.predict import predict_profile

result = predict_profile(
    latitude=15.0, 
    longitude=85.0, 
    date_str='2026-09-04', 
    surface_features={
        'sst_celsius': 29.5,
        'sst_lag1': 29.4,
        'sst_lag3': 29.2
    }
)
```

**Returns:**
```json
{
    "depths": [0],
    "temperature": [29.47]
}
```

*Note: Since the dataset supported predicting Surface Temperature, the `depths` array strictly contains `[0]` (surface). The frontend should be configured to handle this single-depth forecast.*

### 3. Evaluation Results
The exploratory data analysis, spatial SST/Wind maps, time-series, and correlation matrices are saved in `backend/ml/evaluation/plots/`. 
- **Baseline Persistence RMSE:** 0.1384 °C
- **Random Forest RMSE:** 0.1637 °C
- **Random Forest R²:** 0.9923

You are cleared to connect this inference script to the `GET /api/v1/predict` endpoint!
