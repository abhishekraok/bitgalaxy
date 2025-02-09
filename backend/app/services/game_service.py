from sqlalchemy.orm import Session
from app.models.game import Game
from app.schemas.game import GameCreate
from app.services.claude_service import generate_game_configuration
from typing import List, Optional

async def generate_game(db: Session, game_create: GameCreate) -> Game:
    """Generate a new game using Claude and save it to the database"""
    # Generate game configuration using Claude
    game_config = await generate_game_configuration(
        game_type=game_create.game_type,
        description=game_create.description
    )
    
    # Create new game
    game = Game(
        title=game_create.title,
        configuration=game_config,
        state={},  # Initial empty state
        creator_id=1  # TODO: Replace with actual user ID when auth is implemented
    )
    
    db.add(game)
    db.commit()
    db.refresh(game)
    return game

def get_game(db: Session, game_id: int) -> Optional[Game]:
    """Get a specific game by ID"""
    return db.query(Game).filter(Game.id == game_id).first()

def get_games(db: Session) -> List[Game]:
    """Get all games"""
    return db.query(Game).order_by(Game.created_at.desc()).all() 