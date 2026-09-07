from pydantic import BaseModel
from typing import List

class HistoryDataPoint(BaseModel):
    date: str
    sst: float

class HistoryResponse(BaseModel):
    history: List[HistoryDataPoint]
