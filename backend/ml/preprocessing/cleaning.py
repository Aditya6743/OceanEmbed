import xarray as xr
import pandas as pd
import numpy as np
import os

RAW_DIR = "backend/ml/data/raw/"
PROCESSED_DIR = "backend/ml/data/processed/"

def preprocess_data():
    print("Loading datasets...")
    ds_sst = xr.open_dataset(os.path.join(RAW_DIR, "cmems_obs-sst_glo_phy-temp_nrt_P1D-m_1788702603742.nc"))
    ds_wind = xr.open_dataset(os.path.join(RAW_DIR, "cmems_obs-wind_glo_phy_nrt_l3-fy3e-windrad-asc-0.25deg_P1D-i_1788704301308.nc"))
    
    print("Aligning temporal coverage (May 9, 2026 to Sep 4, 2026)...")
    time_overlap = slice('2026-05-09', '2026-09-04')
    ds_sst = ds_sst.sel(time=time_overlap)
    ds_wind = ds_wind.sel(time=time_overlap)
    
    print("Aligning Spatial Coordinates...")
    # Force coordinate alignment to prevent floating point mismatch NaNs during merge
    ds_wind['latitude'] = ds_sst['latitude']
    ds_wind['longitude'] = ds_sst['longitude']
    
    print("Converting units and cleaning variables...")
    ds_sst['sst_celsius'] = ds_sst['analysed_sst'] - 273.15
    ds_sst = ds_sst.drop_vars('analysed_sst')
    
    print("Merging datasets...")
    ds_merged = xr.merge([ds_sst, ds_wind])
    
    print("Flattening to tabular format...")
    df = ds_merged.to_dataframe().reset_index()
    
    df = df.dropna(subset=['sst_celsius'])
    df = df.sort_values(by=['time', 'latitude', 'longitude'])
    
    output_path = os.path.join(PROCESSED_DIR, "bob_sst_wind_merged.csv")
    df.to_csv(output_path, index=False)
    print("Saved processed dataset.")

if __name__ == "__main__":
    preprocess_data()
