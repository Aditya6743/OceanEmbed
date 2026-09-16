from app.services.satellite_data import SatelliteDataService

ds = SatelliteDataService.get_dataset("2026", "06")
print(ds.thetao.isel(depth=0, time=0).shape)
