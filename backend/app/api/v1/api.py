from fastapi import APIRouter
from .endpoints import users, games

api_router = APIRouter()

# Add your route includes here, for example:
# from .endpoints import users, auth
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(games.router, prefix="/games", tags=["games"])
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"]) 