import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from math import sqrt

PROCESSED_DATA = "ml-pipeline/data/processed/bob_3d_temperature.csv"
MODEL_DIR = "ml-pipeline/weights/"
os.makedirs(MODEL_DIR, exist_ok=True)

def create_features(df):
    print("Creating features...")
    df['time'] = pd.to_datetime(df['time'])
    df['month'] = df['time'].dt.month
    df['sin_month'] = np.sin(2 * np.pi * df['month'] / 12.0)
    df['cos_month'] = np.cos(2 * np.pi * df['month'] / 12.0)
    return df.dropna()

def train_eval():
    df = pd.read_csv(PROCESSED_DATA)
    df = create_features(df)
    
    # Train on Jan-Apr, Test on May
    train_df = df[df['time'] < '2026-05-01']
    test_df = df[df['time'] >= '2026-05-01']
    
    features = ['sst_celsius', 'latitude', 'longitude', 'sin_month', 'cos_month']
    target_depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]
    targets = [f'temp_{d}m' for d in target_depths]
    
    X_train, y_train = train_df[features], train_df[targets]
    X_test, y_test = test_df[features], test_df[targets]
    
    print("Training Multi-Output Random Forest for 3D Profiling...")
    rf = RandomForestRegressor(n_estimators=15, max_depth=12, random_state=42, n_jobs=-1)
    
    # Train on 20% sample for speed
    sample_idx = np.random.choice(len(X_train), int(len(X_train)*0.2), replace=False)
    rf.fit(X_train.iloc[sample_idx], y_train.iloc[sample_idx])
    
    preds = rf.predict(X_test)
    
    print("\nModel Performance Across Depths:")
    for i, d in enumerate(target_depths):
        rmse = sqrt(mean_squared_error(y_test.iloc[:, i], preds[:, i]))
        r2 = r2_score(y_test.iloc[:, i], preds[:, i])
        print(f"Depth {d}m - RMSE: {rmse:.4f} C | R2: {r2:.4f}")
    
    model_path = os.path.join(MODEL_DIR, "rf_3d_profile_model.pkl")
    joblib.dump(rf, model_path)
    print(f"\nModel saved to {model_path}")

if __name__ == "__main__":
    train_eval()
