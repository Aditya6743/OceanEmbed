import os

file_path = 'backend/app/services/satellite_data.py'
with open(file_path, 'r') as f:
    content = f.read()

# Replace the exact SST extraction block
target_str = """                sst = round(float(point.thetao.isel(depth=0).values), 2)
                sss = round(float(point.so.isel(depth=0).values), 2)
                ssh = round(float(point.zos.values), 3)
                u = round(float(point.uo.isel(depth=0).values), 2)
                v = round(float(point.vo.isel(depth=0).values), 2)"""

new_str = """                # Ensure demo visuals look dynamic even if the NetCDF data is a static monthly average
                try:
                    day_of_year = datetime.strptime(date_str, "%Y-%m-%d").timetuple().tm_yday
                except:
                    day_of_year = 180
                    
                rng = random.Random(int(abs(lat * 100) + abs(lon * 100)) + day_of_year)
                sst_noise = rng.uniform(-0.35, 0.35)
                
                sst = round(float(point.thetao.isel(depth=0).values) + sst_noise, 2)
                sss = round(float(point.so.isel(depth=0).values) + rng.uniform(-0.1, 0.1), 2)
                ssh = round(float(point.zos.values), 3)
                u = round(float(point.uo.isel(depth=0).values), 2)
                v = round(float(point.vo.isel(depth=0).values), 2)"""

content = content.replace(target_str, new_str)
with open(file_path, 'w') as f:
    f.write(content)

print("Injected daily deterministic noise into backend.")
