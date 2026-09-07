import pandas as pd
from pathlib import Path
from typing import List, Dict, Any

class HistoryService:
    def __init__(self):
        base_dir = Path(__file__).resolve().parent.parent.parent.parent
        self.csv_path = base_dir / "ml-pipeline" / "data" / "processed" / "bob_3d_temperature.csv"
        self._df = None
        
    def _load_data(self):
        if self._df is None:
            if not self.csv_path.exists():
                return pd.DataFrame()
            self._df = pd.read_csv(self.csv_path, usecols=['latitude', 'longitude', 'time', 'sst_celsius'])
            self._df['time'] = pd.to_datetime(self._df['time'])
        return self._df
        
    def get_history(self, lat: float, lon: float) -> List[Dict[str, Any]]:
        df = self._load_data()
        if df.empty:
            return []
            
        df['dist'] = (df['latitude'] - lat)**2 + (df['longitude'] - lon)**2
        min_dist = df['dist'].min()
        
        if min_dist > 1.0:
            return []
            
        location_df = df[df['dist'] == min_dist].sort_values('time')
        
        results = []
        for _, row in location_df.iterrows():
            results.append({
                "date": row['time'].strftime('%Y-%m-%d'),
                "sst": float(row['sst_celsius'])
            })
            
        return results

history_service = HistoryService()
