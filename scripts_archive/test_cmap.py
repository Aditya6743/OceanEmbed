import matplotlib.pyplot as plt
import numpy as np

cmaps = ['inferno', 'bone', 'hot', 'ocean']
for name in cmaps:
    cmap = plt.get_cmap(name)
    color = cmap(0.0) # RGBA
    print(f"{name}: R={color[0]:.3f}, G={color[1]:.3f}, B={color[2]:.3f}")
