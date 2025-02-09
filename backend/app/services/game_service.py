from app.schemas.game import GameCreate, GameResponse
from app.services.claude_service import generate_game_configuration
from datetime import datetime
import json
import os
from pathlib import Path


def get_standard_config(scene_name: str) -> str:
    """Return the standard game configuration template"""
    return f"""import {{ GameConfig }} from 'phaser'
import {scene_name} from './{scene_name}'

const config: GameConfig = {{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#4488aa',
    parent: 'game-container',
    scene: {scene_name},
    physics: {{
        default: 'arcade',
        arcade: {{
            gravity: {{ y: 300 }},
            debug: false
        }}
    }}
}}

export {{ config as default }}
"""


async def generate_game(game_create: GameCreate) -> GameResponse:
    """Generate a new game using Claude and save it to disk"""
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

        # Save standard config.ts
        scene_name = f"{game_id.title().replace('-', '')}Scene"
        with open(game_path / "config.ts", "w") as f:
            f.write(get_standard_config(scene_name))

        # Update registry.ts
        await update_game_registry(config_data["metadata"])

        return GameResponse(
            id=game_id,
            title=config_data["metadata"]["title"],
            configuration=config_data,
            state={},
            created_at=datetime.now(),
            updated_at=None,
        )

    except ValueError as e:
        # Re-raise the error with a more specific message
        raise ValueError(f"Failed to generate game: {str(e)}")
    except Exception as e:
        raise ValueError(f"Unexpected error while generating game: {str(e)}")


async def update_game_registry(metadata: dict):
    """Update the static games registry with the new game"""
    registry_path = Path("../frontend/src/games/static/registry.ts")

    # Read existing registry
    with open(registry_path, "r") as f:
        content = f.read()

    # Find the position before the closing array bracket
    insert_pos = content.rindex("];")

    # Create new game entry
    new_game = f"""    {{
        id: '{metadata["id"]}',
        title: '{metadata["title"]}',
        description: '{metadata["description"]}',
        getConfig: () => import('./{metadata["id"]}/config')
    }},\n"""

    # Insert the new game entry
    updated_content = content[:insert_pos] + new_game + content[insert_pos:]

    # Save updated registry
    with open(registry_path, "w") as f:
        f.write(updated_content)
