from app.schemas.game import GameCreate, GameResponse
from app.services.claude_service import generate_game_configuration
from app.models.game import Game
from sqlalchemy.orm import Session
from datetime import datetime
import os
from pathlib import Path
import json


def scan_static_games(db: Session) -> list[Game]:
    """Scan the static games directory and add any new games to the database"""
    base_path = Path("../frontend/src/games/static")

    # Get all subdirectories in the static games folder
    game_dirs = [d for d in base_path.iterdir() if d.is_dir()]

    games_added = []
    for game_dir in game_dirs:
        game_id = game_dir.name

        # Check if game already exists in database
        existing_game = db.query(Game).filter(Game.id == game_id).first()
        if existing_game:
            games_added.append(existing_game)
            continue

        # Try to read Scene.ts to get game metadata
        scene_file = game_dir / "Scene.ts"
        if scene_file.exists():
            try:
                # Create a new game entry
                game = Game(
                    id=game_id,
                    title=f"Game {game_id}",  # Default title if not found
                    creator_id=1,  # Default creator ID
                    configuration={"gameFiles": {"Scene.ts": scene_file.read_text()}},
                    state={},
                )
                db.add(game)
                db.commit()
                db.refresh(game)
                games_added.append(game)
            except Exception as e:
                print(f"Error adding game {game_id}: {str(e)}")

    return games_added


async def generate_game(game_create: GameCreate, db: Session) -> GameResponse:
    """Generate a new game using Claude and save it to disk and database"""
    try:
        # Generate unique game ID using title and timestamp
        game_id = datetime.now().strftime("%Y%m%d-%H%M%S")

        # Generate game configuration using Claude
        config_data = generate_game_configuration(
            description=game_create.description,
            game_id=game_id,
            game_title=game_create.title,
        )

        # Define the base path for static games
        base_path = Path("../frontend/src/games/static")
        game_path = base_path / game_id

        # Create game directory
        os.makedirs(game_path, exist_ok=True)

        # Save Scene.ts
        with open(game_path / "Scene.ts", "w") as f:
            f.write(config_data["gameFiles"]["Scene.ts"])

        # Create database entry
        game = Game(
            id=game_id,
            title=game_create.title,
            creator_id=1,  # Default creator ID
            configuration=config_data,
            state={},
        )

        db.add(game)
        db.commit()
        db.refresh(game)

        return GameResponse(
            id=game_id,
            title=config_data["metadata"]["title"],
            configuration=config_data,
            state={},
            created_at=game.created_at,
            updated_at=game.updated_at,
        )

    except ValueError as e:
        raise ValueError(f"Failed to generate game: {str(e)}")
    except Exception as e:
        raise ValueError(f"Unexpected error while generating game: {str(e)}")
