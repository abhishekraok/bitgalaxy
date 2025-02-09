from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.services.game_service import scan_static_games
from app.db.session import SessionLocal
from app.db.base_class import Base  # Import Base
from app.db.session import engine  # Import engine

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend URL
        "https://labs.phaser.io",  # Phaser Labs URL
    ],
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS",
    ],  # Explicitly list allowed methods
    allow_headers=["*"],
    expose_headers=["*"],  # Added to expose headers to the frontend
)


@app.on_event("startup")
async def startup_event():
    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Scan for games
    db = SessionLocal()
    try:
        scan_static_games(db)
    finally:
        db.close()


app.include_router(api_router, prefix=settings.API_V1_STR)
