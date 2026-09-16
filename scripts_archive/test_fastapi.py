from fastapi import FastAPI, Query
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/api/v1/spatial/heatmap/{layer}")
async def get_heatmap(layer: str, date: str = Query("2026-06-01")):
    return {"layer": layer, "date": date}

client = TestClient(app)
response = client.get("/api/v1/spatial/heatmap/tchp?date=2026-09-13&t=12345")
print(response.status_code)
print(response.json())
