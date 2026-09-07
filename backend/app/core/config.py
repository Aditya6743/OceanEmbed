from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OceanEmbed Backend API"
    VERSION: str = "v1.0.0-rc2"
    API_V1_STR: str = "/api/v1"
    
    # Allowed origins for Vite frontend - Allow all in prod or add Vercel domains
    CORS_ORIGINS: List[str] = ["*"]
    
    # Domain bounds: North Indian Ocean
    LAT_MIN: float = 5.0
    LAT_MAX: float = 30.0
    LON_MIN: float = 45.0
    LON_MAX: float = 105.0

    class Config:
        case_sensitive = True

settings = Settings()
