from PIL import Image
import numpy as np

path = "backend/cache/2026-09-13_ssh.png"
img = Image.open(path).convert('RGBA')
arr = np.array(img)

# Filter for pixels where alpha > 0
ocean_pixels = arr[arr[:,:,3] > 0]
print(f"Ocean pixels count: {len(ocean_pixels)}")
print(f"Ocean R mean: {np.mean(ocean_pixels[:,0])}")
print(f"Ocean G mean: {np.mean(ocean_pixels[:,1])}")
print(f"Ocean B mean: {np.mean(ocean_pixels[:,2])}")
