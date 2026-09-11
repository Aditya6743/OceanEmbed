from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes.prediction import router as prediction_router
from app.api.routes.metadata import router as metadata_router
from app.api.routes.spatial import router as spatial_router

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


@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.VERSION}


app.include_router(prediction_router, prefix=settings.API_V1_STR, tags=["predict"])
app.include_router(metadata_router, prefix=settings.API_V1_STR, tags=["metadata"])
app.include_router(spatial_router, prefix=settings.API_V1_STR + "/spatial", tags=["spatial"])