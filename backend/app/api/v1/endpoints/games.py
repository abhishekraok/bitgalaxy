from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.services import game_service
from app.schemas.game import GameCreate, GameResponse, GameList

router = APIRouter()


@router.post("/generate", response_model=GameResponse)
async def generate_game(request: GameCreate):
    # Generate game without database storage
    return await game_service.generate_game(request)


@router.get("/{game_id}", response_model=GameResponse)
def get_game(game_id: int):
    """Get a specific game by ID"""
    # Return 404 since we're not implementing storage yet
    raise HTTPException(status_code=404, detail="Game not found")


@router.get("/", response_model=List[GameList])
def list_games():
    """List all games"""
    # Return empty list since we're not implementing storage yet
    return []
