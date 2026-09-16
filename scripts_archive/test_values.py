import numpy as np
import xarray as xr
from app.services.satellite_data import SatelliteDataService

ds = SatelliteDataService.get_dataset("2026", "06")
target_ds = ds.sel(time="2026-09-13", method="nearest")

sst = np.nan_to_num(target_ds.thetao.isel(depth=0).values, nan=0.0)
v = np.nan_to_num(target_ds.vo.isel(depth=0).values, nan=0.0)
u = np.nan_to_num(target_ds.uo.isel(depth=0).values, nan=0.0)
ssh = np.nan_to_num(target_ds.zos.values, nan=0.0)
mask = ~np.isnan(target_ds.thetao.isel(depth=0).values)

ssh_anom = np.maximum(ssh - np.mean(ssh[mask]), 0)
hw = np.maximum(sst - 28.5, 0)
currents = np.maximum(np.sqrt(u**2 + v**2) - 0.3, 0)

print("SSH anom max:", np.max(ssh_anom[mask]))
print("HW max:", np.max(hw[mask]))
print("Currents max:", np.max(currents[mask]))
