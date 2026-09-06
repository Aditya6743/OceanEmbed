import xarray as xr
import pandas as pd
import numpy as np
import os

RAW_DIR = "ml-pipeline/data/raw/"
PROCESSED_DIR = "ml-pipeline/data/processed/"

def preprocess_data():
    print("Loading datasets...")
    ds_sst = xr.open_dataset(os.path.join(RAW_DIR, "cmems_obs-sst_glo_phy-temp_nrt_P1D-m_1788709912921.nc"))
    ds_glorys = xr.open_dataset(os.path.join(RAW_DIR, "cmems_mod_glo_phy_my_0.083deg_P1M-m_1788712221077.nc"))
    
    print("Aligning temporal coverage (Jan 2026 to May 2026)...")
    time_overlap = slice('2026-01-01', '2026-05-31')
    ds_sst = ds_sst.sel(time=time_overlap)
    ds_glorys = ds_glorys.sel(time=time_overlap)
    
    print("Resampling Daily SST to Monthly...")
    ds_sst_monthly = ds_sst.resample(time='1MS').mean()
    
    print("Interpolating GLORYS depths to the 15 standard levels...")
    target_depths = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]
    # Use extrapolation for depth=0 since smallest depth is 0.49m
    ds_glorys_interp = ds_glorys.interp(depth=target_depths, method='linear', kwargs={"fill_value": "extrapolate"})
    
    print("Regridding GLORYS (0.083 deg) to SST (0.25 deg) spatial resolution...")
    ds_glorys_regridded = ds_glorys_interp.interp(
        latitude=ds_sst_monthly['latitude'], 
        longitude=ds_sst_monthly['longitude'], 
        method='linear'
    )
    
    print("Extracting targets and features...")
    ds_sst_monthly['sst_celsius'] = ds_sst_monthly['analysed_sst'] - 273.15
    
    ds_final = xr.Dataset({
        'sst_celsius': ds_sst_monthly['sst_celsius']
    })
    
    for d in target_depths:
        ds_final[f'temp_{d}m'] = ds_glorys_regridded['thetao'].sel(depth=d)
        
    print("Flattening to tabular format...")
    df = ds_final.to_dataframe().reset_index()
    
    initial_len = len(df)
    df = df.dropna(subset=['sst_celsius', 'temp_0m'])
    final_len = len(df)
    print(f"Dropped {initial_len - final_len} land/missing points.")
    
    df = df.sort_values(by=['time', 'latitude', 'longitude'])
    
    output_path = os.path.join(PROCESSED_DIR, "bob_3d_temperature.csv")
    df.to_csv(output_path, index=False)
    print(f"Saved processed 3D dataset to {output_path} with {final_len} records.")

if __name__ == "__main__":
    preprocess_data()
