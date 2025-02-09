from anthropic import Anthropic
from app.core.config import settings
from typing import Dict, Any

anthropic = Anthropic(api_key=settings.ANTHROPIC_API_KEY)

async def generate_game_configuration(
    game_type: str,
    description: str | None
) -> Dict[str, Any]:
    """Generate game configuration using Claude"""
    prompt = f"""Create a simple Phaser game configuration.
    Game type: {game_type}
    Description: {description or 'A simple game'}
    
    Return only valid JSON that includes:
    - Game title
    - Basic game mechanics
    - Initial game state
    - Scoring rules
    - Win/lose conditions
    """
    
    response = await anthropic.messages.create(
        model="claude-3-5-sonnet-latest",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": prompt
        }]
    )
    
    # Parse and validate the response
    game_config = response.content[0].text
    return game_config 