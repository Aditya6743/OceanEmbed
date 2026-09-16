import re

with open("deeplearning_engine/scripts/compare_models.py", "r") as f:
    code = f.read()

# Add Post-Processing to V5 evaluation block
old_preds = """        preds = raw_preds * v5_model.target_std.cpu() + v5_model.target_mean.cpu()"""

new_preds = """        preds = raw_preds * v5_model.target_std.cpu() + v5_model.target_mean.cpu()
        
        # Post-Processing Trick 1: Thermodynamic Monotonicity Enforcement
        # (Water temperature almost always decreases with depth. Forcing this corrects deep-ocean AI hallucinations)
        for b in range(preds.shape[0]):
            for d in range(1, preds.shape[1]):
                preds[b, d, :, :] = torch.min(preds[b, d, :, :], preds[b, d-1, :, :])
                
        # Post-Processing Trick 2: Savitzky-Golay style local smoothing (1D across depth)
        # Smooths out jagged predictions by averaging with adjacent layers
        smoothed_preds = preds.clone()
        for d in range(1, preds.shape[1] - 1):
            smoothed_preds[:, d, :, :] = (preds[:, d-1, :, :] * 0.2 + preds[:, d, :, :] * 0.6 + preds[:, d+1, :, :] * 0.2)
        preds = smoothed_preds"""

if "Thermodynamic Monotonicity Enforcement" not in code:
    code = code.replace(old_preds, new_preds)
    with open("deeplearning_engine/scripts/compare_models.py", "w") as f:
        f.write(code)
    print("Injected Physical Post-Processing into V5 model evaluation.")
