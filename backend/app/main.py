from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers.game import router as game_router
from app.routers.health import router as health_router
from app.routers.leaderboard import router as leaderboard_router

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Snake Arena API for the single-player Snake game MVP.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(game_router)
app.include_router(leaderboard_router)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Snake Arena API"}
