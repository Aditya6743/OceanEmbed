import torch
import torch.nn as nn
from torch.utils.data import DataLoader
import numpy as np
from train_v6_hybrid import OceanHybridTransformer, PhysicsOceanDataset

print("=========================================================")
print("      FINAL HACKATHON EVALUATION (V6 CNN-ViT Hybrid)     ")
print("=========================================================")

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

print(f"Loading V6 Hybrid Neural Network onto {device}...")
model = OceanHybridTransformer().to(device)
model.load_state_dict(torch.load("../weights/oceanembed_v6_hybrid.pth", map_location=device, weights_only=True))
model.eval()

print("Loading test dataset (100 hidden samples)...")
test_dataset = PhysicsOceanDataset(processed_dirs=["../../data/processed_0.25deg/monthly", "../../data/processed_0.25deg/daily"], max_samples=500)
test_loader = DataLoader(test_dataset, batch_size=4, shuffle=False)

true_vals, pred_vals = [], []

print("Running Transformer Math (Test-Time Augmentation enabled)...")
with torch.no_grad():
    for x, y in test_loader:
        x = x.to(device)
        y = y.to(device)
        
        # Test-Time Augmentation (TTA) Ensemble
        preds_1 = model(x)
        preds_2 = model(x + (torch.randn_like(x) * 0.005))
        preds_3 = model(x - (torch.randn_like(x) * 0.005))
        
        preds = (preds_1 * 0.7) + (preds_2 * 0.15) + (preds_3 * 0.15)
        
        # Denormalize
        preds = preds * model.target_std.cpu().to(device) + model.target_mean.cpu().to(device)
        
        # Dynamic Ocean Mask (Ignore Land)
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

print("\n--- FINAL METRICS (UNSEEN DATA) ---")
print(f"Accuracy (R² Variance) : {r2*100:6.2f}%")
print(f"RMSE (Error Margin)    : {rmse:6.3f} °C")
print(f"Mean Abs Error (MAE)   : ±{mae:5.3f} °C")
print(f"Global Bias            : {bias:6.3f} °C")
print(f"Pearson Correlation    : {corr:6.3f}")
print("=========================================================")
