from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.services import game_service
from app.schemas.game import GameCreate, GameResponse, GameList
from app.models.game import Game
from pathlib import Path
import json

router = APIRouter()


@router.post("/generate", response_model=GameResponse)
async def generate_game(request: GameCreate, db: Session = Depends(get_db)):
    # Generate and store game in database
    return await game_service.generate_game(request, db)


@router.get("/{game_id}", response_model=GameResponse)
def get_game(game_id: str, db: Session = Depends(get_db)):
    """Get a specific game by ID"""
    game = db.query(Game).filter(Game.id == game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game


@router.get("/", response_model=List[GameList])
def list_games(db: Session = Depends(get_db)):
    """List all games"""
    return db.query(Game).all()


@router.post("/scan", response_model=List[GameList])
def scan_static_games(db: Session = Depends(get_db)):
    """Scan static games directory and add to database"""
    return game_service.scan_static_games(db)
