with open("backend/app/services/spatial_engine.py", "r") as f:
    code = f.read()

target = "plt.imsave(os.path.join(self.cache_dir, filename), out_data, cmap=cmap, vmin=0.0, vmax=1.0, format='png')"
replacement = "plt.imsave(os.path.join(self.cache_dir, filename), out_data, cmap=cmap, vmin=0.0, vmax=0.4, format='png')"
code = code.replace(target, replacement)

with open("backend/app/services/spatial_engine.py", "w") as f:
    f.write(code)
