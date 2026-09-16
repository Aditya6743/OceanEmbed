import torch
import numpy as np
from torch.utils.data import DataLoader
from train_hybrid import OceanSpatialAutoencoder, HybridOceanDataset
from train_physics import OceanPhysicsAutoencoder, PhysicsOceanDataset
from sklearn.metrics import r2_score, mean_squared_error
import warnings
warnings.filterwarnings('ignore')

device = torch.device('cuda' if torch.cuda.is_available() else 'mps' if torch.backends.mps.is_available() else 'cpu')

print("Evaluating V4 Model (Hybrid)...")
v4_model = OceanSpatialAutoencoder().to(device)
v4_model.load_state_dict(torch.load("../weights/oceanembed_hybrid_v4_full.pth", map_location=device, weights_only=True))
v4_model.eval()

v4_dataset = HybridOceanDataset(processed_dirs=["../../data/processed_0.25deg/monthly", "../../data/processed_0.25deg/daily"], max_samples=30)
v4_loader = DataLoader(v4_dataset, batch_size=4, shuffle=False)

v4_true, v4_pred = [], []
with torch.no_grad():
    for x, y in v4_loader:
        out = v4_model(x.to(device)).cpu().numpy().flatten()
        target = y.numpy().flatten()
        # V4 predicts SSH. Mask land (where target == 0)
        mask = target != 0.0
        v4_true.append(target[mask])
        v4_pred.append(out[mask])

v4_true = np.concatenate(v4_true)
v4_pred = np.concatenate(v4_pred)
v4_rmse = np.sqrt(mean_squared_error(v4_true, v4_pred))
v4_r2 = max(0, r2_score(v4_true, v4_pred) * 100)
v4_mae = np.mean(np.abs(v4_true - v4_pred))


print("Evaluating V5 Model (Ultimate PINN)...")
v5_model = OceanPhysicsAutoencoder().to(device)
v5_model.load_state_dict(torch.load("../weights/oceanembed_pinn_v5.pth", map_location=device, weights_only=True))
v5_model.eval()

v5_dataset = PhysicsOceanDataset(processed_dirs=["../../data/processed_0.25deg/monthly", "../../data/processed_0.25deg/daily"], max_samples=30)
v5_loader = DataLoader(v5_dataset, batch_size=4, shuffle=False)

v5_true, v5_pred = [], []
with torch.no_grad():
    for x, y in v5_loader:
        out = v5_model(x.to(device)).cpu().numpy().flatten()
        target = y.numpy().flatten()
        # V5 predicts Temperature. Mask land (where target == 0)
        mask = target != 0.0
        v5_true.append(target[mask])
        v5_pred.append(out[mask])

v5_true = np.concatenate(v5_true)
v5_pred = np.concatenate(v5_pred)
v5_rmse = np.sqrt(mean_squared_error(v5_true, v5_pred))
v5_r2 = max(0, r2_score(v5_true, v5_pred) * 100)
v5_mae = np.mean(np.abs(v5_true - v5_pred))

print("\n--- MODEL COMPARISON REPORT ---")
print(f"Metrics          | V4 Hybrid Model      | V5 Ultimate PINN")
print(f"-----------------|----------------------|----------------------")
print(f"Accuracy (R²)    | {v4_r2:6.2f}%              | {v5_r2:6.2f}%")
print(f"RMSE Error       | {v4_rmse:6.3f}             | {v5_rmse:6.3f} °C")
print(f"Mean Abs Error   | ±{v4_mae:5.3f}            | ±{v5_mae:5.3f} °C")
print(f"Physics Channels | 7-Channel            | 12-Channel (Physics-Informed)")

