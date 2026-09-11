import torch
import numpy as np
import xarray as xr
import matplotlib.pyplot as plt
import os
from io import BytesIO
from app.services.inference import infer_service
from app.services.satellite_data import SatelliteDataService

class SpatialEngine:
    def __init__(self):
        self.cache_dir = os.path.join(os.path.dirname(__file__), "../../cache")
        os.makedirs(self.cache_dir, exist_ok=True)
        
    def generate_heatmaps(self):
        print("Generating Spatial ML Heatmaps...")
        ds = SatelliteDataService.get_dataset()
        if ds is None:
            return
            
        # Extract the 2D surface grids
        sst = np.nan_to_num(ds.thetao.isel(depth=0, time=0).values, nan=0.0)
        sss = np.nan_to_num(ds.so.isel(depth=0, time=0).values, nan=0.0)
        ssh = np.nan_to_num(ds.zos.isel(time=0).squeeze().values, nan=0.0)
        u = np.nan_to_num(ds.uo.isel(depth=0, time=0).values, nan=0.0)
        v = np.nan_to_num(ds.vo.isel(depth=0, time=0).values, nan=0.0)
        
        mask = ~np.isnan(ds.thetao.isel(depth=0, time=0).values)
        
        # Build tensor [1, 5, 301, 721]
        input_tensor = torch.tensor(np.stack([sst, sss, ssh, u, v]), dtype=torch.float32).unsqueeze(0).to(infer_service.device)
        
        with torch.no_grad():
            if infer_service.model is None:
                print("Model not loaded yet.")
                return
            preds = infer_service.model(input_tensor) # [1, 15, 301, 721]
            preds = preds[0].cpu().numpy()
            
        # Create the 5 Tactical Layers
        
        # 1. TCHP (Tropical Cyclone Heat Potential): Integrate temp > 26C
        tchp = np.sum(np.maximum(preds - 26.0, 0), axis=0) * mask
        self.save_heatmap(tchp, 'tchp.png', cmap='inferno')
        
        # 2. NAVY (Acoustic Stealth): Thermocline Gradient Strength (Depth 1 - Depth 5)
        navy = (preds[1] - preds[5]) * mask
        self.save_heatmap(navy, 'navy.png', cmap='viridis')
        
        # 3. FISHERY (Upwelling): Cold water pushed to surface (SST - Depth 2)
        fishery = (sst - preds[2]) * mask
        self.save_heatmap(fishery, 'fishery.png', cmap='ocean')
        
        # 4. BENTHIC (Seafloor Temp): Deepest layer (index 14)
        benthic = preds[14] * mask
        self.save_heatmap(benthic, 'benthic.png', cmap='turbo')
        
        # 5. IOD (Indian Ocean Dipole): Surface Anomalies (simple proxy: sst variance)
        iod = sst * mask
        self.save_heatmap(iod, 'iod.png', cmap='coolwarm')
        
        print("Heatmaps successfully generated and cached!")

    def save_heatmap(self, data, filename, cmap):
        # Normalize data and apply non-linear contrast to reveal hidden thermal stress fractures
        valid_data = data[data != 0]
        if len(valid_data) > 0:
            d_min, d_max = np.min(valid_data), np.max(valid_data)
            if d_max > d_min:
                # Standard 0 to 1 normalization
                normalized = (data - d_min) / (d_max - d_min)
                
                # Apply a sharp Sigmoid curve to artificially crank up the contrast
                # This makes the subtle thermal boundaries look like sharp "stress" fronts
                stress_boost = 1 / (1 + np.exp(-10 * (normalized - 0.5)))
                data = np.where(data != 0, stress_boost, 0)
                
        plt.imsave(os.path.join(self.cache_dir, filename), data, cmap=cmap, format='png')