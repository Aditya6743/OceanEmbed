from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes.prediction import router as prediction_router
from app.api.routes.metadata import router as metadata_router
from app.api.routes.spatial import router as spatial_router
from app.api.routes.iot import router as iot_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(iot_router, prefix="/api/iot", tags=["IoT Simulators"])


# from app.services.scheduler import start_scheduler
import logging

logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing Background Cron Jobs (Disabled missing apscheduler)...")
    pass

@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.VERSION}



from fastapi.responses import RedirectResponse

@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

app.include_router(prediction_router, prefix=settings.API_V1_STR, tags=["predict"])
app.include_router(metadata_router, prefix=settings.API_V1_STR, tags=["metadata"])
app.include_router(spatial_router, prefix=settings.API_V1_STR + "/spatial", tags=["spatial"])