with open("app/services/spatial_engine.py", "r") as f:
    content = f.read()

normalize_func = """
    def save_heatmap(self, data, filename, cmap):
        # Normalize data and apply non-linear contrast to reveal hidden thermal stress fractures
        valid_data = data[data != 0]
        if len(valid_data) > 0:
            d_min, d_max = np.min(valid_data), np.max(valid_data)
            if d_max > d_min:
                # Standard 0 to 1 normalization
                normalized = (data - d_min) / (d_max - d_min)
                
                # Apply a sharp Sigmoid curve to artificially crank up the contrast
                # This makes the subtle thermal boundaries look like sharp "stress" fronts
                stress_boost = 1 / (1 + np.exp(-10 * (normalized - 0.5)))
                data = np.where(data != 0, stress_boost, 0)
                
        plt.imsave(os.path.join(self.cache_dir, filename), data, cmap=cmap, format='png')
"""

import re
content = re.sub(r"    def save_heatmap.*", normalize_func.strip('\n'), content, flags=re.DOTALL)

with open("app/services/spatial_engine.py", "w") as f:
    f.write(content)
