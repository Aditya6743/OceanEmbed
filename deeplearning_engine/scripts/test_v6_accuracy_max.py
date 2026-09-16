import torch
import torch.nn as nn
from torch.utils.data import DataLoader
import numpy as np
from train_v6_hybrid import OceanHybridTransformer, PhysicsOceanDataset

print("=========================================================")
print("  MAXIMUM ENSEMBLE EVALUATION (V6 CNN-ViT Hybrid)        ")
print("=========================================================")

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
model = OceanHybridTransformer().to(device)
model.load_state_dict(torch.load("../weights/oceanembed_v6_hybrid.pth", map_location=device, weights_only=True))
model.eval()

print("Loading MAX test dataset (2000 spatial snapshots)...")
test_dataset = PhysicsOceanDataset(processed_dirs=["../../data/processed_0.25deg/monthly", "../../data/processed_0.25deg/daily"], max_samples=2000)
test_loader = DataLoader(test_dataset, batch_size=4, shuffle=False)

true_vals, pred_vals = [], []

print("Running 5-Pass Test-Time Augmentation Ensemble on M4 Matrix...")
with torch.no_grad():
    for x, y in test_loader:
        x = x.to(device)
        y = y.to(device)
        
        # Pass 1: Original
        preds_1 = model(x)
        
        # Pass 2 & 3: Mathematical Gaussian Noise Injection
        noise = torch.randn_like(x) * 0.005
        preds_2 = model(x + noise)
        preds_3 = model(x - noise)
        
        # Pass 4: Spatial Horizontal Flip (Forces geographic structural invariance)
        x_flip_h = torch.flip(x, dims=[3])
        preds_4 = torch.flip(model(x_flip_h), dims=[3])
        
        # Pass 5: Spatial Vertical Flip
        x_flip_v = torch.flip(x, dims=[2])
        preds_5 = torch.flip(model(x_flip_v), dims=[2])
        
        # Aggressive Ensemble Averaging
        preds = (preds_1 * 0.5) + (preds_2 * 0.1) + (preds_3 * 0.1) + (preds_4 * 0.15) + (preds_5 * 0.15)
        
        preds = preds * model.target_std.cpu().to(device) + model.target_mean.cpu().to(device)
        
        mask = (y != 0.0)
        true_vals.extend(y[mask].cpu().flatten().tolist())
        pred_vals.extend(preds[mask].cpu().flatten().tolist())

true_vals = np.array(true_vals)
pred_vals = np.array(pred_vals)

ss_res = np.sum((true_vals - pred_vals) ** 2)
ss_tot = np.sum((true_vals - np.mean(true_vals)) ** 2)
r2 = 1 - (ss_res / (ss_tot + 1e-8))

rmse = np.sqrt(np.mean((true_vals - pred_vals)**2))
mae = np.mean(np.abs(true_vals - pred_vals))
bias = np.mean(pred_vals - true_vals)
corr = np.corrcoef(true_vals, pred_vals)[0, 1]

print("\n--- MAXIMUM STRESS-TEST METRICS ---")
print(f"Accuracy (R² Variance) : {r2*100:6.2f}%")
print(f"RMSE (Error Margin)    : {rmse:6.3f} °C")
print(f"Mean Abs Error (MAE)   : ±{mae:5.3f} °C")
print(f"Global Bias            : {bias:6.3f} °C")
print(f"Pearson Correlation    : {corr:6.3f}")
print("=========================================================")
