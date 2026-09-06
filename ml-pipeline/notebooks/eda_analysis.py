import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os

PROCESSED_DATA = "ml-pipeline/data/processed/bob_sst_wind_merged.csv"
OUT_DIR = "ml-pipeline/notebooks/plots/"
os.makedirs(OUT_DIR, exist_ok=True)

def run_eda():
    print("Loading processed data...")
    df = pd.read_csv(PROCESSED_DATA, parse_dates=['time'])
    
    print("Generating Correlation Matrix...")
    plt.figure(figsize=(10, 8))
    corr = df[['sst_celsius', 'eastward_wind', 'northward_wind', 'wind_speed']].corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title("Correlation Matrix: SST and Wind Variables")
    plt.savefig(os.path.join(OUT_DIR, "correlation_matrix.png"), dpi=300, bbox_inches='tight')
    plt.close()

    print("Generating SST Time Series (Regional Mean)...")
    ts_df = df.groupby('time')['sst_celsius'].mean().reset_index()
    plt.figure(figsize=(12, 5))
    plt.plot(ts_df['time'], ts_df['sst_celsius'], marker='o', linestyle='-', color='firebrick')
    plt.title("Mean Sea Surface Temperature in North Indian Ocean (May - Sep 2026)")
    plt.xlabel("Date")
    plt.ylabel("SST (°C)")
    plt.grid(True, alpha=0.3)
    plt.savefig(os.path.join(OUT_DIR, "sst_timeseries.png"), dpi=300, bbox_inches='tight')
    plt.close()
    
    print("Generating Spatial Map of Mean SST...")
    spatial_df = df.groupby(['latitude', 'longitude'])['sst_celsius'].mean().reset_index()
    plt.figure(figsize=(10, 8))
    # We use a simple scatter plot since cartopy isn't installed by default
    scatter = plt.scatter(spatial_df['longitude'], spatial_df['latitude'], 
                          c=spatial_df['sst_celsius'], cmap='viridis', s=15, marker='s')
    plt.colorbar(scatter, label='Mean SST (°C)')
    plt.title("Mean Spatial SST Distribution (North Indian Ocean)")
    plt.xlabel("Longitude (°E)")
    plt.ylabel("Latitude (°N)")
    plt.savefig(os.path.join(OUT_DIR, "sst_spatial_map.png"), dpi=300, bbox_inches='tight')
    plt.close()
    
    print("Generating Wind Vector Spatial Map (Mean)...")
    wind_df = df.groupby(['latitude', 'longitude'])[['eastward_wind', 'northward_wind']].mean().reset_index()
    plt.figure(figsize=(10, 8))
    # Subsample for quiver plot clarity
    wind_sub = wind_df.iloc[::4] 
    plt.quiver(wind_sub['longitude'], wind_sub['latitude'], 
               wind_sub['eastward_wind'], wind_sub['northward_wind'], 
               color='dodgerblue', scale=50)
    plt.title("Mean Wind Vector Map (North Indian Ocean)")
    plt.xlabel("Longitude (°E)")
    plt.ylabel("Latitude (°N)")
    plt.savefig(os.path.join(OUT_DIR, "wind_vector_map.png"), dpi=300, bbox_inches='tight')
    plt.close()
    
    print("EDA Complete. Plots saved to", OUT_DIR)

if __name__ == "__main__":
    run_eda()
