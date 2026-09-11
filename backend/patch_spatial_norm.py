with open("app/services/spatial_engine.py", "r") as f:
    content = f.read()

normalize_func = """
    def save_heatmap(self, data, filename, cmap):
        # Normalize data to strictly 0.0 to 1.0 so the colormaps are incredibly vibrant
        valid_data = data[data != 0]
        if len(valid_data) > 0:
            d_min, d_max = np.min(valid_data), np.max(valid_data)
            if d_max > d_min:
                data = np.where(data != 0, (data - d_min) / (d_max - d_min), 0)
        plt.imsave(os.path.join(self.cache_dir, filename), data, cmap=cmap, format='png')
"""

import re
content = re.sub(r"    def save_heatmap.*", normalize_func.strip('\n'), content, flags=re.DOTALL)

with open("app/services/spatial_engine.py", "w") as f:
    f.write(content)
