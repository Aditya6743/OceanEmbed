import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import xarray as xr
import numpy as np
import time
import matplotlib.pyplot as plt
import os
import warnings
warnings.filterwarnings("ignore")

# Import the model architecture we built earlier
from train_ocean_model import OceanSpatialAutoencoder

class RamCachedOceanDataset(Dataset):
    def __init__(self, nc_file_path):
        print(f"Loading 21GB NetCDF file from disk...")
        self.ds = xr.open_dataset(nc_file_path, engine='netcdf4')
        self.time_steps = self.ds.time.size
        
        print("Extracting subset (Surface Inputs + 15 Depth Targets)...")
        # Load EVERYTHING we need directly into Mac RAM (approx 6.3 GB)
        # This prevents the hard drive from slowing down the GPU during training
        
        # 1. Surface Inputs: SST, SSS, SSH, U, V
        print("Caching Surface Inputs...")
        sst = self.ds['thetao'].isel(depth=0).values
        sss = self.ds['so'].isel(depth=0).values
        ssh = self.ds['zos'].values
        u = self.ds['uo'].isel(depth=0).values
        v = self.ds['vo'].isel(depth=0).values
        
        self.inputs = np.nan_to_num(np.stack([sst, sss, ssh, u, v], axis=1), nan=0.0)
        
        # 2. Subsurface Targets: Top 15 Depths for Temperature
        print("Caching Subsurface Targets (15 Depths)...")
        targets = self.ds['thetao'].isel(depth=slice(0, 15)).values
        self.targets = np.nan_to_num(targets, nan=0.0)
        
        print(f"Cache Complete! Inputs shape: {self.inputs.shape}, Targets shape: {self.targets.shape}")
        
    def __len__(self): 
        return self.time_steps
        
    def __getitem__(self, idx):
        return (torch.tensor(self.inputs[idx], dtype=torch.float32), 
                torch.tensor(self.targets[idx], dtype=torch.float32))

if __name__ == "__main__":
    print("\n=== OCEANEMBED FULL TRAINING RUN ===")
    
    # 1. Hardware Check
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Engine: {device.type.upper()} GPU Acceleration Active")
    
    # 2. Load Data directly into RAM
    t0 = time.time()
    dataset = RamCachedOceanDataset("data/indian_ocean_1year.nc")
    dataloader = DataLoader(dataset, batch_size=4, shuffle=True)
    print(f"Data successfully loaded into memory in {time.time()-t0:.1f} seconds!")
    
    # 3. Setup Model
    model = OceanSpatialAutoencoder().to(device)
    criterion = nn.MSELoss() 
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    
    # 4. Training Loop
    epochs = 20
    print(f"\nCommencing {epochs} Epochs of Training on 1 Full Year of Data...")
    
    history = []
    model.train()
    
    for epoch in range(epochs):
        epoch_t0 = time.time()
        total_loss = 0
        
        for batch_idx, (inputs, targets) in enumerate(dataloader):
            inputs, targets = inputs.to(device), targets.to(device)
            
            optimizer.zero_grad()
            predictions = model(inputs)
            loss = criterion(predictions, targets)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
        avg_loss = total_loss / len(dataloader)
        history.append(avg_loss)
        
        epoch_time = time.time() - epoch_t0
        print(f"Epoch [{epoch+1}/{epochs}] | Loss: {avg_loss:.4f} | Time: {epoch_time:.1f}s")
    
    # 5. Save Artifacts for Judges
    os.makedirs("weights", exist_ok=True)
    torch.save(model.state_dict(), "../weights/ocean_weights.pth")
    print("\n[SUCCESS] Model weights saved to ../weights/ocean_weights.pth")
    
    plt.figure(figsize=(10,5))
    plt.plot(history, color='#0ea5e9', linewidth=2)
    plt.title("OceanEmbed AI Training Convergence")
    plt.xlabel("Epoch")
    plt.ylabel("Mean Squared Error (MSE)")
    plt.grid(True, alpha=0.3)
    plt.savefig("../results/training_loss_curve.png", dpi=300, bbox_inches='tight')
    print("[SUCCESS] Loss curve saved to ../results/training_loss_curve.png")
