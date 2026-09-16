with open("backend/app/services/spatial_engine.py", "r") as f:
    code = f.read()

# Fix heatmaps logic
target = """        # 1. TCHP (Cyclone Intensification)
        tchp = np.maximum(sst - 26.0, 0) * mask
        self.save_heatmap(tchp, f'{date_str}_tchp.png', cmap='inferno')

        # 2. SSH (Smart City Flood Defense)
        self.save_heatmap(ssh * mask, f'{date_str}_ssh.png', cmap='viridis')

        # 3. SST (Marine Heatwaves)
        self.save_heatmap(sst * mask, f'{date_str}_sst.png', cmap='hot')

        # 4. Currents (Regional Coastal Erosion)
        currents = np.sqrt(u**2 + v**2) * mask
        self.save_heatmap(currents, f'{date_str}_currents.png', cmap='YlGnBu')"""

replacement = """        # 1. TCHP (Cyclone Intensification)
        tchp = np.maximum(sst - 26.0, 0)
        self.save_heatmap(tchp, mask, f'{date_str}_tchp.png', cmap='inferno')

        # 2. SSH (Smart City Flood Defense)
        self.save_heatmap(ssh, mask, f'{date_str}_ssh.png', cmap='bone')

        # 3. SST (Marine Heatwaves)
        # For heatwaves, we only care about high temps, subtract base
        hw = np.maximum(sst - 25.0, 0)
        self.save_heatmap(hw, mask, f'{date_str}_sst.png', cmap='hot')

        # 4. Currents (Regional Coastal Erosion)
        currents = np.sqrt(u**2 + v**2)
        self.save_heatmap(currents, mask, f'{date_str}_currents.png', cmap='ocean')"""
code = code.replace(target, replacement)

target2 = """        # 5. NAVY (Acoustic Stealth)
        navy = np.abs(sst - 15.0) * mask
        self.save_heatmap(navy, f'{date_str}_navy.png', cmap='viridis')
        
        # 6. FISHERY (Upwelling)
        fishery = (30.0 - sst) * np.abs(v) * mask
        self.save_heatmap(fishery, f'{date_str}_fishery.png', cmap='ocean')
        
        # 7. BENTHIC (Seafloor Temp Proxy)
        benthic = np.maximum(sst - 12.0, 0) * mask
        self.save_heatmap(benthic, f'{date_str}_benthic.png', cmap='turbo')
        
        # 8. IOD (Indian Ocean Dipole)
        iod = sst * mask
        self.save_heatmap(iod, f'{date_str}_iod.png', cmap='coolwarm')
        
        print(f"Heatmaps successfully generated and cached for {date_str}!")

    def save_heatmap(self, data, filename, cmap):
        valid_data = data[data != 0]
        if len(valid_data) > 0:
            d_min, d_max = np.min(valid_data), np.max(valid_data)
            if d_max > d_min:
                normalized = (data - d_min) / (d_max - d_min)
                stress_boost = 1 / (1 + np.exp(-10 * (normalized - 0.5)))
                data = np.where(data != 0, stress_boost, 0)
                
        plt.imsave(os.path.join(self.cache_dir, filename), data, cmap=cmap, format='png')"""

replacement2 = """        # 5. NAVY (Acoustic Stealth)
        navy = np.abs(sst - 15.0)
        self.save_heatmap(navy, mask, f'{date_str}_navy.png', cmap='inferno')
        
        # 6. FISHERY (Upwelling)
        fishery = (30.0 - sst) * np.abs(v)
        self.save_heatmap(fishery, mask, f'{date_str}_fishery.png', cmap='ocean')
        
        # 7. BENTHIC (Seafloor Temp Proxy)
        benthic = np.maximum(sst - 12.0, 0)
        self.save_heatmap(benthic, mask, f'{date_str}_benthic.png', cmap='hot')
        
        # 8. IOD (Indian Ocean Dipole)
        self.save_heatmap(sst, mask, f'{date_str}_iod.png', cmap='bone')
        
        print(f"Heatmaps successfully generated and cached for {date_str}!")

    def save_heatmap(self, data, mask, filename, cmap):
        valid_data = data[mask]
        out_data = np.zeros_like(data)
        if len(valid_data) > 0:
            d_min, d_max = np.min(valid_data), np.max(valid_data)
            if d_max > d_min:
                normalized = (data - d_min) / (d_max - d_min)
                stress_boost = 1 / (1 + np.exp(-10 * (normalized - 0.5)))
                out_data = np.where(mask, stress_boost, 0)
            else:
                out_data = np.where(mask, 1.0, 0)
                
        # Use vmin=0 to ensure 0 maps to the darkest color (black)
        plt.imsave(os.path.join(self.cache_dir, filename), out_data, cmap=cmap, vmin=0.0, vmax=1.0, format='png')"""
code = code.replace(target2, replacement2)

with open("backend/app/services/spatial_engine.py", "w") as f:
    f.write(code)
