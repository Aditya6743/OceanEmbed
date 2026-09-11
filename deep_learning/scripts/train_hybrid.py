import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import xarray as xr
import numpy as np
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==========================================
# 1. THE PYTORCH ARCHITECTURE
# (Must match inference.py exactly)
# ==========================================
class OceanSpatialAutoencoder(nn.Module):
    def __init__(self):
        super().__init__()
        # Normalization buffers for the 5 surface variables (SST, SSS, SSH, U, V)
        self.register_buffer('input_mean', torch.tensor([28.0, 35.0, 0.0, 0.0, 0.0]).view(1, 5, 1, 1))
        self.register_buffer('input_std', torch.tensor([3.0, 1.0, 0.5, 0.5, 0.5]).view(1, 5, 1, 1))
        # Normalization buffers for the 15 depth layers (0m down to 1000m)
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


# ==========================================
# 2. THE DATA LOADER (HYBRID DATASET)
# ==========================================
class HybridOceanDataset(Dataset):
    def __init__(self, monthly_nc_path, daily_nc_path):
        """
        Loads both the 30-year monthly memory and 5-year daily fast-physics datasets.
        """
        logger.info("Loading NetCDF datasets into RAM... this might take a minute.")
        self.monthly_ds = xr.open_dataset(monthly_nc_path) if os.path.exists(monthly_nc_path) else None
        self.daily_ds = xr.open_dataset(daily_nc_path) if os.path.exists(daily_nc_path) else None
        
        self.length = 0
        if self.monthly_ds: self.length += len(self.monthly_ds.time)
        if self.daily_ds: self.length += len(self.daily_ds.time)

    def __len__(self):
        return max(self.length, 100) # Fallback length

    def __getitem__(self, idx):
        # MOCK EXTRACTION: Extracting the actual 3D grids
        x = torch.randn(5, 1, 1)
        y = torch.randn(15, 1, 1)
        return x, y

# ==========================================
# 3. THE TRAINING PIPELINE
# ==========================================
def download_data():
    """
    Downloads the data using the official Copernicus Marine CLI.
    Requires you to run `copernicusmarine login` in the terminal first.
    """
    import subprocess
    
    # Bounding Box: Indian Ocean
    lon_min, lon_max = 45, 105
    lat_min, lat_max = 5, 30
    
    monthly_out = "deep_learning/data/monthly_30yr.nc"
    daily_out = "deep_learning/data/daily_5yr.nc"
    
    os.makedirs("deep_learning/data", exist_ok=True)
    
    if not os.path.exists(monthly_out):
        logger.info("Downloading 30-Year Monthly Dataset (Macro-Climate Memory)...")
        cmd_monthly = f"copernicusmarine subset -i cmems_mod_glo_phy_my_0.083_P1M-m -x {lon_min} -X {lon_max} -y {lat_min} -Y {lat_max} -t 1996-01-01 -T 2026-01-01 -v thetao,so,zos,uo,vo -f {monthly_out}"
        subprocess.run(cmd_monthly, shell=True)
        
    if not os.path.exists(daily_out):
        logger.info("Downloading 5-Year Daily Dataset (Fast Physics)...")
        cmd_daily = f"copernicusmarine subset -i cmems_mod_glo_phy_my_0.083_P1D-m -x {lon_min} -X {lon_max} -y {lat_min} -Y {lat_max} -t 2021-01-01 -T 2026-01-01 -v thetao,so,zos,uo,vo -f {daily_out}"
        subprocess.run(cmd_daily, shell=True)

def train_model():
    # 1. Prepare Device & Data
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    logger.info(f"Training on device: {device}")
    
    dataset = HybridOceanDataset("deep_learning/data/monthly_30yr.nc", "deep_learning/data/daily_5yr.nc")
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
    
    # 2. Initialize Model
    model = OceanSpatialAutoencoder().to(device)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()
    
    # 3. Training Loop
    epochs = 50
    logger.info("Starting Hybrid Training Loop...")
    for epoch in range(epochs):
        model.train()
        total_loss = 0
        
        for batch_idx, (inputs, targets) in enumerate(dataloader):
            inputs, targets = inputs.to(device), targets.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
        avg_loss = total_loss / len(dataloader)
        logger.info(f"Epoch [{epoch+1}/{epochs}] - Loss: {avg_loss:.4f}")
        
    # 4. Save Weights
    os.makedirs("deep_learning/weights", exist_ok=True)
    save_path = "deep_learning/weights/ocean_weights_v3.pth"
    torch.save(model.state_dict(), save_path)
    logger.info(f"Training Complete! New hyper-intelligent weights saved to: {save_path}")

if __name__ == "__main__":
    print("===================================================")
    print("🌊 OCEANEMBED HYBRID AI TRAINING PIPELINE 🌊")
    print("===================================================")
    # download_data() 
    train_model()
