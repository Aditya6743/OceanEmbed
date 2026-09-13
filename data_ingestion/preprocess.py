import os
import glob
import json
import numpy as np
import xarray as xr

# The exact 15 depths our PyTorch model expects
TARGET_DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000]

def find_nearest_depths(ds, target_depths):
    """Finds the closest depth indices in the raw dataset to our target depths."""
    actual_depths = ds.depth.values
    indices = []
    for t in target_depths:
        idx = (np.abs(actual_depths - t)).argmin()
        indices.append(idx)
    return indices

def process_directory(input_dir, output_dir, dataset_name):
    print(f"\n--- Processing {dataset_name} ---")
    os.makedirs(output_dir, exist_ok=True)
    
    files = sorted(glob.glob(os.path.join(input_dir, "*.nc")))
    if not files:
        print(f"No .nc files found in {input_dir}. Waiting for downloads to finish.")
        return

    # To calculate global mean/std for PyTorch normalization
    global_stats = {
        "thetao": {"sum": 0, "sq_sum": 0, "count": 0},
        "so": {"sum": 0, "sq_sum": 0, "count": 0},
        "zos": {"sum": 0, "sq_sum": 0, "count": 0}
    }

    for f in files:
        filename = os.path.basename(f)
        out_path = os.path.join(output_dir, filename.replace(".nc", "_processed.nc"))
        
        if os.path.exists(out_path):
            print(f"Skipping {filename}, already processed.")
            continue
            
        print(f"Processing {filename}...")
        try:
            ds = xr.open_dataset(f)
            
            # 1. Slice the 15 Target Depths
            depth_indices = find_nearest_depths(ds, TARGET_DEPTHS)
            ds_sliced = ds.isel(depth=depth_indices)
            
            # Rename depth coordinates to exactly match our targets for consistency
            ds_sliced = ds_sliced.assign_coords(depth=TARGET_DEPTHS)
            
            # 2. Mask Land Masses (Fill NaNs with 0)
            ds_filled = ds_sliced.fillna(0.0)
            
            # 3. Accumulate stats for normalization (only where water exists, i.e., > 0)
            for var in ["thetao", "so", "zos"]:
                if var in ds_filled.variables:
                    data = ds_filled[var].values
                    water_mask = data != 0.0
                    if np.any(water_mask):
                        global_stats[var]["sum"] += np.sum(data[water_mask])
                        global_stats[var]["sq_sum"] += np.sum(data[water_mask]**2)
                        global_stats[var]["count"] += np.sum(water_mask)

            # 4. Save processed lightweight file
            ds_filled.to_netcdf(out_path)
            ds.close()
            ds_filled.close()
            
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    # 5. Calculate and save normalization parameters
    final_stats = {}
    for var, stats in global_stats.items():
        if stats["count"] > 0:
            mean = stats["sum"] / stats["count"]
            variance = (stats["sq_sum"] / stats["count"]) - (mean ** 2)
            std = np.sqrt(variance) if variance > 0 else 1.0
            final_stats[var] = {"mean": float(mean), "std": float(std)}
    
    if final_stats:
        stats_file = os.path.join(output_dir, "normalization_stats.json")
        with open(stats_file, "w") as f:
            json.dump(final_stats, f, indent=4)
        print(f"Saved normalization stats to {stats_file}")

if __name__ == "__main__":
    # Test on the directories we created
    process_directory("data/30_years_monthly", "data/processed/30_years_monthly", "30-Year Climate Data")
    process_directory("data/5_years_daily", "data/processed/5_years_daily", "5-Year Tactical Data")
    print("\n[COMPLETE] Preprocessing pipeline ready.")
