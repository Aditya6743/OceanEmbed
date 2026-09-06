import random
from app.schemas.prediction import SurfaceData

class SatelliteDataService:
    @staticmethod
    def get_surface_observations(lat: float, lon: float, date_str: str) -> SurfaceData:
        # Latitudinal temperature variation: warmer towards equator (5°N)
        equator_dist = abs(lat) / 30.0
        sst_base = 30.5 - (equator_dist * 4.0)
        sst = round(sst_base + random.uniform(-0.6, 0.6), 2)
        
        # Arabian Sea (west) has higher salinity than Bay of Bengal (east)
        sss_base = 36.2 if lon < 77.0 else 33.5
        sss = round(sss_base + random.uniform(-0.4, 0.4), 2)

        # Realistic surface anomalies, currents, and winds
        ssh = round(random.uniform(-0.25, 0.28), 3)
        current_u = round(random.uniform(-0.65, 0.65), 2)
        current_v = round(random.uniform(-0.55, 0.55), 2)
        wind_u = round(random.uniform(-7.5, 7.5), 1)
        wind_v = round(random.uniform(-6.0, 6.0), 1)

        return SurfaceData(
            sst=sst,
            ssh=ssh,
            sss=sss,
            current_u=current_u,
            current_v=current_v,
            wind_u=wind_u,
            wind_v=wind_v
        )