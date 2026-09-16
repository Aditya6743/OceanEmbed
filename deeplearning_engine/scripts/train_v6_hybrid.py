import os
import glob
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, random_split
import xarray as xr
import numpy as np
import pandas as pd
from pathlib import Path
import logging
from scipy.ndimage import distance_transform_edt

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==========================================
# 1. THE PHYSICS-INFORMED ARCHITECTURE
# ==========================================
class SpatialAttention(nn.Module):
    def __init__(self, kernel_size=7):
        super().__init__()
        self.conv = nn.Conv2d(2, 1, kernel_size=kernel_size, padding=kernel_size//2)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        avg_out = torch.mean(x, dim=1, keepdim=True)
        max_out, _ = torch.max(x, dim=1, keepdim=True)
        y = torch.cat([avg_out, max_out], dim=1)
        y = self.conv(y)
        return x * self.sigmoid(y)

class OceanHybridTransformer(nn.Module):
    def __init__(self):
        super(OceanHybridTransformer, self).__init__()
        
        # 12 Channels: 7 core + 2 Time (Sin/Cos) + 2 Space (Lat/Lon) + 1 Bathymetry
        self.register_buffer('input_mean', torch.zeros(1, 12, 1, 1))
        self.register_buffer('input_std', torch.ones(1, 12, 1, 1))
        self.register_buffer('target_mean', torch.zeros(1, 15, 1, 1))
        self.register_buffer('target_std', torch.ones(1, 15, 1, 1))
        
        # 1. CNN LOCAL EXTRACTOR (Detects eddies, coastlines)
        self.cnn_encoder = nn.Sequential(
            nn.Conv2d(12, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2) # Reduces 32x32 to 16x16
        )
        
        # 2. VISION TRANSFORMER BLOCK (Global basin-wide currents & teleconnections)
        # Sequence length = 16x16 (256 patches), Embedding Dim = 64
        encoder_layer = nn.TransformerEncoderLayer(d_model=64, nhead=4, dim_feedforward=256, dropout=0.1, batch_first=True)
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=2)
        
        # 3. ATTENTION BOTTLENECK (Hybrid fusion)
        self.attention = SpatialAttention()
        
        # 4. DECODER
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(64, 32, kernel_size=2, stride=2),
            nn.ReLU(),
            nn.Conv2d(32, 15, kernel_size=3, padding=1)
        )

    def forward(self, x):
        # Normalize
        x_norm = (x - self.input_mean) / (self.input_std + 1e-8)
        
        # CNN Encoding
        features = self.cnn_encoder(x_norm) # Shape: [Batch, 64, 16, 16]
        b, c, h, w = features.shape
        
        # Flatten for Transformer: [Batch, Sequence=256, Embed=64]
        flat_features = features.view(b, c, h * w).permute(0, 2, 1)
        
        # ViT Global Processing
        transformer_out = self.transformer(flat_features)
        
        # Unflatten back to CNN shape
        features = transformer_out.permute(0, 2, 1).view(b, c, h, w)
        
        # Attention Fusion & Decoding
        attended_features = self.attention(features)
        out_norm = self.decoder(attended_features)
        
        return (out_norm * self.target_std) + self.target_mean

# ==========================================
# 2. PHYSICS-INFORMED LOSS FUNCTION
# ==========================================
class PhysicsInformedLoss(nn.Module):
    def __init__(self, lambda_phys=0.1):
        super().__init__()
        self.mse = nn.MSELoss(reduction='none')
        self.lambda_phys = lambda_phys
        
    def forward(self, preds, targets):
        # 1. Dynamic Land Mask: Where target is exactly 0 (from nan_to_num), it is land
        mask = (targets != 0.0).float()
        
        # 2. Base MSE Loss (only computed on ocean pixels)
        mse_loss = (self.mse(preds, targets) * mask).sum() / (mask.sum() + 1e-8)
        
        # 3. Hydrostatic Stability Penalty (preventing temperature inversions)
        # Water should get colder as depth increases. If preds[:, d] < preds[:, d+1], 
        # it means deep water is warmer than shallow water (unstable).
        # We apply ReLU to (deep_temp - shallow_temp) to penalize only inversions.
        inversions = torch.relu(preds[:, 1:, :, :] - preds[:, :-1, :, :])
        
        # Apply mask to penalize only ocean pixels
        physics_loss = (inversions * mask[:, 1:, :, :]).sum() / (mask.sum() + 1e-8)
        
        return mse_loss + (self.lambda_phys * physics_loss), mse_loss, physics_loss

# ==========================================
# 3. ADVANCED DATASET LOADER
# ==========================================
class PhysicsOceanDataset(Dataset):
    def __init__(self, processed_dirs, patch_size=32, max_samples=1000):
        self.patch_size = patch_size
        self.max_samples = max_samples
        self.datasets = []
        
        for d in processed_dirs:
            files = glob.glob(os.path.join(d, "*.nc"))
            if files:
                ds = xr.open_mfdataset(files, combine='by_coords', engine='netcdf4')
                self.datasets.append(ds)
                
        wind_files = glob.glob("../../data/surface_winds_daily/*.nc")
        self.wind_ds = xr.open_mfdataset(wind_files, combine='by_coords', engine='netcdf4') if wind_files else None
        
        # Try to load Bathymetry file if it exists, otherwise we'll mock it dynamically
        bathy_files = glob.glob("../../data/static/*bathymetry*.nc")
        self.bathy_ds = xr.open_dataset(bathy_files[0]) if bathy_files else None

    def __len__(self):
        return self.max_samples if self.datasets else 100

    def __getitem__(self, idx):
        if not self.datasets:
            return torch.randn(12, self.patch_size, self.patch_size), torch.randn(15, self.patch_size, self.patch_size)
            
        ds = self.datasets[np.random.randint(len(self.datasets))]
        t_idx = np.random.randint(len(ds.time))
        time_val = ds.time[t_idx].values
        
        lat_size, lon_size = len(ds.latitude), len(ds.longitude)
        lat_start = np.random.randint(0, max(1, lat_size - self.patch_size))
        lon_start = np.random.randint(0, max(1, lon_size - self.patch_size))
        
        # Extract 5 Core Ocean Variables
        t_slice = ds['thetao'].isel(time=t_idx, depth=0, latitude=slice(lat_start, lat_start+self.patch_size), longitude=slice(lon_start, lon_start+self.patch_size))
        s_temp = t_slice.values
        s_sal = ds['so'].isel(time=t_idx, depth=0, latitude=slice(lat_start, lat_start+self.patch_size), longitude=slice(lon_start, lon_start+self.patch_size)).values
        s_ssh = ds['zos'].isel(time=t_idx, latitude=slice(lat_start, lat_start+self.patch_size), longitude=slice(lon_start, lon_start+self.patch_size)).values
        
        u = ds['uo'].isel(time=t_idx, depth=0, latitude=slice(lat_start, lat_start+self.patch_size), longitude=slice(lon_start, lon_start+self.patch_size)).values if 'uo' in ds.variables else np.zeros_like(s_temp)
        v = ds['vo'].isel(time=t_idx, depth=0, latitude=slice(lat_start, lat_start+self.patch_size), longitude=slice(lon_start, lon_start+self.patch_size)).values if 'vo' in ds.variables else np.zeros_like(s_temp)
        
        # Extract Wind Variables
        wind_u, wind_v = np.zeros_like(s_temp), np.zeros_like(s_temp)
        if self.wind_ds is not None:
            try:
                wind_patch = self.wind_ds.sel(time=time_val, method='nearest')
                wind_u = np.resize(wind_patch['eastward_wind'].values, s_temp.shape)
                wind_v = np.resize(wind_patch['northward_wind'].values, s_temp.shape)
            except: pass
            
        # --- NEW CONSTRAINTS: TIME, SPACE, AND BATHYMETRY ---
        
        # Time Encodings (Day of Year)
        day_of_year = pd.to_datetime(time_val).dayofyear
        sin_time = np.full_like(s_temp, np.sin(2 * np.pi * day_of_year / 365.25))
        cos_time = np.full_like(s_temp, np.cos(2 * np.pi * day_of_year / 365.25))
        
        # Spatial Encodings (Lat/Lon)
        lat_grid, lon_grid = np.meshgrid(t_slice.latitude.values, t_slice.longitude.values, indexing='ij')
        lat_grid = lat_grid / 90.0   # Normalize to [-1, 1]
        lon_grid = lon_grid / 180.0
        
        # Bathymetry (Depth Map)
        if self.bathy_ds is not None:
            try:
                bathy_patch = self.bathy_ds.sel(latitude=slice(t_slice.latitude.values[0], t_slice.latitude.values[-1]), 
                                                longitude=slice(t_slice.longitude.values[0], t_slice.longitude.values[-1]))
                bathy = np.resize(bathy_patch['elevation'].values, s_temp.shape) / 5000.0
            except:
                bathy = np.zeros_like(s_temp)
        else:
            # Fallback: Generate a mathematical proxy for bathymetry based on distance from land (NaNs)
            ocean_mask = ~np.isnan(s_temp)
            if np.any(ocean_mask):
                # distance_transform_edt gives distance to the nearest 0 (land). 
                bathy = distance_transform_edt(ocean_mask) / 50.0  # Normalize proxy depth
            else:
                bathy = np.zeros_like(s_temp)
                
        # Stack into 12-Channel Tensor
        x = np.stack([s_temp, s_sal, s_ssh, u, v, wind_u, wind_v, sin_time, cos_time, lat_grid, lon_grid, bathy], axis=0)
        
        # Target 15-Layer 3D Profile
        y = ds['thetao'].isel(time=t_idx, depth=slice(0, 15), latitude=slice(lat_start, lat_start+self.patch_size), longitude=slice(lon_start, lon_start+self.patch_size)).values
        
        x, y = np.nan_to_num(x), np.nan_to_num(y)
        return torch.tensor(x, dtype=torch.float32), torch.tensor(y, dtype=torch.float32)

# ==========================================
# 4. ADVANCED TRAINING LOOP
# ==========================================
def train_model():
    logger.info("Initializing Ultimate PINN Ocean Model (12-Channel)...")
    model = OceanHybridTransformer()
    device = torch.device('cuda' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else 'cpu')
    model.to(device)
    
    save_path = "../weights/oceanembed_v6_hybrid.pth"
    start_epoch = 0
    if os.path.exists(save_path):
        logger.info(f"Resuming training from {save_path}...")
        model.load_state_dict(torch.load(save_path, map_location=device))
        start_epoch = 15 # Resume from where we left off
    
    full_dataset = PhysicsOceanDataset(processed_dirs=[
        "../../data/processed_0.25deg/monthly", "../../data/processed_0.25deg/daily"
    ], max_samples=4000)
    
    # 80/20 Train/Validation Split
    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])
    
    train_loader = DataLoader(train_dataset, batch_size=4, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=4, shuffle=False)
    
    criterion = PhysicsInformedLoss(lambda_phys=0.1)
    optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=15)
    
    epochs = 30 # Increased to train further
    best_val_loss = float('inf')
    os.makedirs("../weights", exist_ok=True)
    
    logger.info(f"Starting/Resuming Training on {device} (Target: {epochs} epochs)...")
    
    for epoch in range(start_epoch, epochs):
        model.train()
        train_mse, train_phys = 0, 0
        
        for inputs, targets in train_loader:
            inputs, targets = inputs.to(device), targets.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            
            loss, mse, phys = criterion(outputs, targets)
            loss.backward()
            optimizer.step()
            
            train_mse += mse.item()
            train_phys += phys.item()
            
        scheduler.step()
        
        # Validation Loop
        model.eval()
        val_loss_total = 0
        with torch.no_grad():
            for inputs, targets in val_loader:
                inputs, targets = inputs.to(device), targets.to(device)
                outputs = model(inputs)
                v_loss, v_mse, v_phys = criterion(outputs, targets)
                val_loss_total += v_loss.item()
                
        val_loss_avg = val_loss_total / len(val_loader)
        logger.info(f"Epoch {epoch+1}/{epochs} | Train MSE: {train_mse/len(train_loader):.4f} | Train Phys Pen: {train_phys/len(train_loader):.4f} | Val Loss: {val_loss_avg:.4f}")
        
        # Best Model Checkpointing
        if val_loss_avg < best_val_loss:
            best_val_loss = val_loss_avg
            torch.save(model.state_dict(), save_path)
            logger.info(f"*** New Best Model Saved to {save_path} ***")

if __name__ == "__main__":
    train_model()
