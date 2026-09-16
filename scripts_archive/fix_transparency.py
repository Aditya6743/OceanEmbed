with open("backend/app/services/spatial_engine.py", "r") as f:
    code = f.read()

target = """        # Use vmin=0 to ensure 0 maps to the darkest color (black)
        plt.imsave(os.path.join(self.cache_dir, filename), out_data, cmap=cmap, vmin=0.0, vmax=0.4, format='png')"""

replacement = """        # Create RGBA image manually to ensure perfect transparency on masked land
        import matplotlib.cm as cm
        cmap_obj = plt.get_cmap(cmap)
        
        # Scale data according to our vmax=0.4 threshold
        scaled_data = np.clip(out_data / 0.4, 0.0, 1.0)
        rgba_img = cmap_obj(scaled_data)
        
        # Force masked areas (land/empty) to be pure transparent black
        rgba_img[~mask] = [0.0, 0.0, 0.0, 0.0]
        
        plt.imsave(os.path.join(self.cache_dir, filename), rgba_img, format='png')"""

code = code.replace(target, replacement)

with open("backend/app/services/spatial_engine.py", "w") as f:
    f.write(code)
