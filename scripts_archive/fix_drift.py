with open("backend/app/services/spatial_engine.py", "r") as f:
    code = f.read()

target = """                # 1. Simulate Seasonal SST Heating (+0.015 degrees per day in Summer)
                sst = np.where(mask, sst + (days_ahead * 0.015), 0)
                
                # 2. Simulate Ocean Current Momentum Drift (Rotating Vectors)
                drift_angle = np.radians(days_ahead * 0.2)
                u_new = u * np.cos(drift_angle) - v * np.sin(drift_angle)
                v_new = u * np.sin(drift_angle) + v * np.cos(drift_angle)
                u, v = u_new, v_new
                
                # 3. Simulate SSH Swell Propagation (Wave phase shift)
                shift_pixels = int(days_ahead * 0.5)
                if shift_pixels > 0:
                    ssh = np.roll(ssh, shift_pixels, axis=1) # Propagate waves Eastward"""

replacement = """                # 1. Simulate Highly Visible SST Heating (Non-uniform expanding hotspots)
                # We apply a massive multiplier based on days_ahead so it visually morphs!
                heat_multiplier = 1.0 + (days_ahead * 0.01)
                sst = np.where(mask, sst * heat_multiplier, 0)
                
                # 2. Simulate Aggressive Ocean Current Momentum Drift
                drift_angle = np.radians(days_ahead * 2.5) # Cranked up to 2.5 degrees per day!
                u_new = u * np.cos(drift_angle) - v * np.sin(drift_angle)
                v_new = u * np.sin(drift_angle) + v * np.cos(drift_angle)
                u, v = u_new, v_new
                
                # 3. Simulate High-Speed SSH Swell Propagation
                shift_pixels = int(days_ahead * 8.0) # 8 pixels per day!
                if shift_pixels > 0:
                    ssh = np.roll(ssh, shift_pixels, axis=1)"""

code = code.replace(target, replacement)

with open("backend/app/services/spatial_engine.py", "w") as f:
    f.write(code)
