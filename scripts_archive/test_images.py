from PIL import Image
import numpy as np
import os

cache_dir = "backend/cache"
for img_name in ["2026-09-13_tchp.png", "2026-09-13_ssh.png", "2026-09-13_sst.png", "2026-09-13_currents.png"]:
    path = os.path.join(cache_dir, img_name)
    if os.path.exists(path):
        img = Image.open(path).convert('RGB')
        arr = np.array(img)
        mean_val = np.mean(arr)
        max_val = np.max(arr)
        print(f"{img_name}: Mean={mean_val:.2f}, Max={max_val}")
    else:
        print(f"{img_name} missing")
