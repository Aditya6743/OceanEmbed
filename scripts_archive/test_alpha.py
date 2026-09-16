from PIL import Image
import numpy as np
import os

path = "backend/cache/2026-09-13_ssh.png"
if os.path.exists(path):
    img = Image.open(path).convert('RGBA')
    arr = np.array(img)
    print(f"Shape: {arr.shape}")
    print(f"Alpha mean: {np.mean(arr[:,:,3])}")
    print(f"Alpha max: {np.max(arr[:,:,3])}")
    print(f"Alpha min: {np.min(arr[:,:,3])}")
else:
    print("File missing")
