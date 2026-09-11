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

# Architecture with built-in Normalization
class OceanSpatialAutoencoder(nn.Module):
    def __init__(self):
        super().__init__()
        # Normalization constants (SST, SSS, SSH, U, V)
        self.register_buffer('input_mean', torch.tensor([28.0, 35.0, 0.0, 0.0, 0.0]).view(1, 5, 1, 1))
        self.register_buffer('input_std', torch.tensor([3.0, 1.0, 0.5, 0.5, 0.5]).view(1, 5, 1, 1))
        self.register_buffer('target_mean', torch.tensor([15.0]).view(1, 1, 1, 1))
        self.register_buffer('target_std', torch.tensor([10.0]).view(1, 1, 1, 1))

        self.encoder = nn.Sequential(
            nn.Conv2d(5, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU()
        )
        self.embedding_layer = nn.Conv2d(32, 8, kernel_size=1) 
        self.decoder = nn.Sequential(
            nn.Conv2d(8, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 15, kernel_size=3, padding=1)
        )
    def forward(self, x):
        x_norm = (x - self.input_mean) / self.input_std
        features = self.encoder(x_norm)
        embedding = self.embedding_layer(features)
        out_norm = self.decoder(embedding)
        return (out_norm * self.target_std) + self.target_mean

class RamCachedOceanDataset(Dataset):
    def __init__(self, nc_file_path):
        print(f"Loading Valid NetCDF dataset from disk...")
        self.ds = xr.open_dataset(nc_file_path, engine='netcdf4')
        self.time_steps = self.ds.time.size
        
        print("Caching Surface Inputs...")
        sst = self.ds['thetao'].isel(depth=0).values
        sss = self.ds['so'].isel(depth=0).values
        ssh = self.ds['zos'].values
        u = self.ds['uo'].isel(depth=0).values
        v = self.ds['vo'].isel(depth=0).values
        
        # We DO NOT convert NaNs to 0 here. We keep them as NaN to use as a land mask.
        self.inputs = np.stack([sst, sss, ssh, u, v], axis=1)
        
        print("Caching Subsurface Targets (15 Depths)...")
        self.targets = self.ds['thetao'].isel(depth=slice(0, 15)).values
        print(f"Cache Complete! Inputs: {self.inputs.shape}, Targets: {self.targets.shape}")
        
    def __len__(self): 
        return self.time_steps
        
    def __getitem__(self, idx):
        # We replace NaNs with 0 strictly for the tensor structure, but we will ignore them in the loss function
        inp = np.nan_to_num(self.inputs[idx], nan=0.0)
        tgt = self.targets[idx]
        mask = ~np.isnan(tgt) # True where ocean exists
        tgt_clean = np.nan_to_num(tgt, nan=0.0)
        
        return (torch.tensor(inp, dtype=torch.float32), 
                torch.tensor(tgt_clean, dtype=torch.float32),
                torch.tensor(mask, dtype=torch.float32))

if __name__ == "__main__":
    print("\n=== OCEANEMBED TRAINING RUN (WITH NORMALIZATION) ===")
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Engine: {device.type.upper()} GPU Acceleration Active")
    
    dataset = RamCachedOceanDataset("../../data/indian_ocean_1year_(1).nc")
    dataloader = DataLoader(dataset, batch_size=2, shuffle=True)
    
    model = OceanSpatialAutoencoder().to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=0.003)
    
    epochs = 5
    print(f"\nCommencing {epochs} Epochs of Training...")
    
    history = []
    model.train()
    
    for epoch in range(epochs):
        epoch_t0 = time.time()
        total_loss = 0
        
        for batch_idx, (inputs, targets, mask) in enumerate(dataloader):
            inputs, targets, mask = inputs.to(device), targets.to(device), mask.to(device)
            
            optimizer.zero_grad()
            predictions = model(inputs)
            
            # Masked MSE Loss: Only penalize predictions on actual ocean coordinates!
            # We multiply by the mask to zero out land loss
            loss = (((predictions - targets) * mask) ** 2).sum() / mask.sum().clamp(min=1)
            
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
            
        avg_loss = total_loss / len(dataloader)
        history.append(avg_loss)
        
        print(f"Epoch [{epoch+1}/{epochs}] | Loss: {avg_loss:.4f} | Time: {time.time() - epoch_t0:.1f}s")
    
    os.makedirs("../weights", exist_ok=True)
    torch.save(model.state_dict(), "../weights/ocean_weights.pth")
    print("\n[SUCCESS] Model weights saved!")
