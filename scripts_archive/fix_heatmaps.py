with open("backend/app/services/spatial_engine.py", "r") as f:
    code = f.read()

# Replace the math formulas to ensure the data spans the whole ocean
old_math = """        # 2. SSH (Smart City Flood Defense)
        # Isolate extreme positive height anomalies to create distinct, vivid hotspots like Cyclone
        ssh_anom = np.maximum(ssh - np.mean(ssh[mask]), 0)
        self.save_heatmap(ssh_anom, mask, f'{date_str}_ssh.png', cmap='magma')

        # 3. SST (Marine Heatwaves)
        # Base temp in Indian Ocean is high, so threshold at 28.5 to isolate vivid heatwave patches
        hw = np.maximum(sst - 28.5, 0)
        self.save_heatmap(hw, mask, f'{date_str}_sst.png', cmap='plasma')

        # 4. Currents (Regional Coastal Erosion)
        # Isolate only high-velocity currents to create swirling, distinct boundary layer patterns
        currents = np.maximum(np.sqrt(u**2 + v**2) - 0.3, 0)
        self.save_heatmap(currents, mask, f'{date_str}_currents.png', cmap='viridis')"""

new_math = """        # 2. SSH (Smart City Flood Defense)
        # Full ocean spread to create beautiful swirling patterns
        ssh_anom = ssh - np.min(ssh[mask])
        self.save_heatmap(ssh_anom, mask, f'{date_str}_ssh.png', cmap='magma')

        # 3. SST (Marine Heatwaves)
        # Full ocean spread
        hw = sst - np.min(sst[mask])
        self.save_heatmap(hw, mask, f'{date_str}_sst.png', cmap='plasma')

        # 4. Currents (Regional Coastal Erosion)
        # Full ocean spread
        currents = np.sqrt(u**2 + v**2)
        self.save_heatmap(currents, mask, f'{date_str}_currents.png', cmap='viridis')"""

code = code.replace(old_math, new_math)

# Replace the stress_boost mapping to be purely linear so we don't suppress the mid-tones
old_save = """            if d_max > d_min:
                normalized = (data - d_min) / (d_max - d_min)
                # Use a milder curve (power function) to preserve sweeping, vivid gradient patterns
                # rather than crushing them into solid blocks with a steep sigmoid
                stress_boost = np.power(normalized, 1.5)
                out_data = np.where(mask, stress_boost, 0)"""

new_save = """            if d_max > d_min:
                normalized = (data - d_min) / (d_max - d_min)
                # Pure linear mapping to ensure the colormap spans the entire ocean beautifully
                stress_boost = normalized
                out_data = np.where(mask, stress_boost, 0)"""

code = code.replace(old_save, new_save)

with open("backend/app/services/spatial_engine.py", "w") as f:
    f.write(code)
