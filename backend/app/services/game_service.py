from app.schemas.game import GameCreate, GameResponse
from app.services.claude_service import generate_game_configuration
from datetime import datetime


async def generate_game(game_create: GameCreate) -> GameResponse:
    """Generate a new game using Claude without database storage"""
    # Generate game configuration using Claude
    game_config = await generate_game_configuration(
        game_type=game_create.game_type, description=game_create.description
    )

    # Create new game response
    return GameResponse(
        id=1,  # Dummy ID since we're not storing
        title=game_create.title,
        configuration=game_config,
        state={},  # Initial empty state
        created_at=datetime.now(),
        updated_at=None,
    )
