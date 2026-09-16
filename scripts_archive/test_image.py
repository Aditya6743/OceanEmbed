import numpy as np
from PIL import Image

for file in ["2026-06-01_ssh.png", "2026-06-01_sst.png", "2026-06-01_currents.png", "2026-06-01_tchp.png"]:
    img = Image.open(f"backend/cache/{file}")
    data = np.array(img)
    
    # Calculate intensity
    intensity = (data[:,:,0]/255.0 + data[:,:,1]/255.0 + data[:,:,2]/255.0) / 3.0
    
    # Count pixels where alpha is > 0 and intensity > 0.5
    high_intensity_pixels = np.sum((data[:,:,3] > 0) & (intensity > 0.5))
    total_valid_pixels = np.sum(data[:,:,3] > 0)
    
    print(f"{file}: {high_intensity_pixels} high intensity pixels out of {total_valid_pixels} valid pixels")

