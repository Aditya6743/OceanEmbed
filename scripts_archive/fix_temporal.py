with open("backend/app/services/spatial_engine.py", "r") as f:
    code = f.read()

target = """        # Extract the 2D surface grids
        sst = np.nan_to_num(target_ds.thetao.isel(depth=0).values, nan=0.0)
        v = np.nan_to_num(target_ds.vo.isel(depth=0).values, nan=0.0)
        u = np.nan_to_num(target_ds.uo.isel(depth=0).values, nan=0.0)
        ssh = np.nan_to_num(target_ds.zos.values, nan=0.0)
        
        mask = ~np.isnan(target_ds.thetao.isel(depth=0).values)"""

replacement = """        # Extract the 2D surface grids
        sst = np.nan_to_num(target_ds.thetao.isel(depth=0).values, nan=0.0)
        v = np.nan_to_num(target_ds.vo.isel(depth=0).values, nan=0.0)
        u = np.nan_to_num(target_ds.uo.isel(depth=0).values, nan=0.0)
        ssh = np.nan_to_num(target_ds.zos.values, nan=0.0)
        
        mask = ~np.isnan(target_ds.thetao.isel(depth=0).values)

        # ==========================================
        # AI TEMPORAL DRIFT SIMULATION (FORECASTING)
        # ==========================================
        from datetime import datetime
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d")
            base_date = datetime.strptime("2026-06-01", "%Y-%m-%d")
            days_ahead = (target_date - base_date).days
            
            if days_ahead > 0:
                print(f"Simulating temporal forecast {days_ahead} days into the future...")
                # 1. Simulate Seasonal SST Heating (+0.015 degrees per day in Summer)
                sst = np.where(mask, sst + (days_ahead * 0.015), 0)
                
                # 2. Simulate Ocean Current Momentum Drift (Rotating Vectors)
                drift_angle = np.radians(days_ahead * 0.2)
                u_new = u * np.cos(drift_angle) - v * np.sin(drift_angle)
                v_new = u * np.sin(drift_angle) + v * np.cos(drift_angle)
                u, v = u_new, v_new
                
                # 3. Simulate SSH Swell Propagation (Wave phase shift)
                shift_pixels = int(days_ahead * 0.5)
                if shift_pixels > 0:
                    ssh = np.roll(ssh, shift_pixels, axis=1) # Propagate waves Eastward
        except Exception as e:
            print(f"Temporal drift skipped: {e}")
        # =========================================="""
code = code.replace(target, replacement)

with open("backend/app/services/spatial_engine.py", "w") as f:
    f.write(code)
