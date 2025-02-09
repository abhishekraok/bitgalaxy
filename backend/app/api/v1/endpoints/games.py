from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.services import game_service
from app.schemas.game import GameCreate, GameResponse, GameList

router = APIRouter()

@router.post("/generate", response_model=GameResponse)
async def generate_game(
    request: GameCreate,
    db: Session = Depends(get_db)
):
    return await game_service.generate_game(db, request)

@router.get("/{game_id}", response_model=GameResponse)
def get_game(game_id: int, db: Session = Depends(get_db)):
    """Get a specific game by ID"""
    game = game_service.get_game(db, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game

@router.get("/", response_model=List[GameList])
def list_games(db: Session = Depends(get_db)):
    """List all games"""
    return game_service.get_games(db) 