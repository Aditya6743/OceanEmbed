import torch
import numpy as np
from torch.utils.data import DataLoader
from train_hybrid import OceanSpatialAutoencoder, HybridOceanDataset
from sklearn.metrics import r2_score

print("Loading V4 7-Channel AI Brain...")
device = torch.device('cuda' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else 'cpu')
model = OceanSpatialAutoencoder().to(device)
model.load_state_dict(torch.load("../weights/oceanembed_hybrid_v4_full.pth", map_location=device, weights_only=True))
model.eval()

print("Loading Validation Data...")
dataset = HybridOceanDataset(processed_dirs=[
    "../../data/processed_0.25deg/monthly",
    "../../data/processed_0.25deg/daily"
], patch_size=32, max_samples=200)

dataloader = DataLoader(dataset, batch_size=4, shuffle=False)

true_vals = []
pred_vals = []

print("Running pure mathematical evaluation...")
with torch.no_grad():
    for inputs, targets in dataloader:
        inputs = inputs.to(device)
        targets = targets.numpy()
        
        preds = model(inputs).cpu().numpy()
        
        true_vals.append(targets.flatten())
        pred_vals.append(preds.flatten())

true_vals = np.concatenate(true_vals)
pred_vals = np.concatenate(pred_vals)

# Calculate Accuracy as Percentage (R-squared variance explained)
r2 = r2_score(true_vals, pred_vals)
accuracy_percentage = max(0.0, r2 * 100.0)

# Calculate Mean Absolute Error (MAE) for physical context
mae = np.mean(np.abs(true_vals - pred_vals))

print(f"\n--- TRUE MODEL ACCURACY ---")
print(f"Mathematical Accuracy (R² Score) : {accuracy_percentage:.2f}%")
print(f"Mean Error Rate (MAE)            : ±{mae:.2f} °C")
