import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from math import sqrt

PROCESSED_DATA = "backend/ml/data/processed/bob_sst_wind_merged.csv"
MODEL_DIR = "backend/ml/models/"
os.makedirs(MODEL_DIR, exist_ok=True)

def create_features(df):
    print("Creating features...")
    df['time'] = pd.to_datetime(df['time'])
    df['day_of_year'] = df['time'].dt.dayofyear
    df['sin_day'] = np.sin(2 * np.pi * df['day_of_year'] / 365.0)
    df['cos_day'] = np.cos(2 * np.pi * df['day_of_year'] / 365.0)
    
    # Sort for lag creation
    df = df.sort_values(by=['latitude', 'longitude', 'time'])
    
    # Autoregressive Lag features (using L4 SST which is fully gap-free)
    df['sst_lag1'] = df.groupby(['latitude', 'longitude'])['sst_celsius'].shift(1)
    df['sst_lag3'] = df.groupby(['latitude', 'longitude'])['sst_celsius'].shift(3)
    
    # Target (Tomorrow's SST)
    df['target_sst_t1'] = df.groupby(['latitude', 'longitude'])['sst_celsius'].shift(-1)
    
    # Drop NaNs from the shifts ONLY
    df = df.dropna(subset=['sst_lag1', 'sst_lag3', 'target_sst_t1'])
    return df

def train_eval():
    df = pd.read_csv(PROCESSED_DATA)
    df = create_features(df)
    
    # Chronological Split (Train: May-July, Val: August, Test: September)
    train_df = df[df['time'] < '2026-08-01']
    val_df = df[(df['time'] >= '2026-08-01') & (df['time'] < '2026-09-01')]
    test_df = df[df['time'] >= '2026-09-01']
    
    # Exclude wind because it's L3 (mostly NaNs). Use fully gridded L4 SST.
    features = ['sst_celsius', 'sst_lag1', 'sst_lag3', 'latitude', 'longitude', 'sin_day', 'cos_day']
    target = 'target_sst_t1'
    
    X_train, y_train = train_df[features], train_df[target]
    X_val, y_val = val_df[features], val_df[target]
    X_test, y_test = test_df[features], test_df[target]
    
    print("Training Baseline Persistence Model...")
    persistence_preds = test_df['sst_celsius']
    print(f"Persistence RMSE: {sqrt(mean_squared_error(y_test, persistence_preds)):.4f} C")
    
    print("Training Random Forest Regressor (Baseline ML)...")
    rf = RandomForestRegressor(n_estimators=10, max_depth=10, random_state=42, n_jobs=-1)
    
    # Train on a 10% sample for speed
    sample_idx = np.random.choice(len(X_train), int(len(X_train)*0.1), replace=False)
    rf.fit(X_train.iloc[sample_idx], y_train.iloc[sample_idx])
    
    preds = rf.predict(X_test)
    rmse = sqrt(mean_squared_error(y_test, preds))
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)
    
    print(f"\nRandom Forest Test Metrics:\nRMSE: {rmse:.4f} C\nMAE: {mae:.4f} C\nR2: {r2:.4f}")
    
    model_path = os.path.join(MODEL_DIR, "rf_sst_model.pkl")
    joblib.dump(rf, model_path)
    print(f"\nModel saved to {model_path}")

    importances = pd.DataFrame({'feature': features, 'importance': rf.feature_importances_})
    importances = importances.sort_values(by='importance', ascending=False)
    print("\nFeature Importances:")
    print(importances.to_string(index=False))

if __name__ == "__main__":
    train_eval()
