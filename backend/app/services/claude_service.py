from anthropic import Anthropic
from app.core.config import settings
from typing import Dict, Any

claude_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def generate_game_configuration(description: str | None) -> Dict[str, Any]:
    """Generate game configuration using Claude"""
    prompt = f"""Create a Phaser 3 game implementation.
    Description: {description or 'A simple game'}
    
    Return a JSON object with the following structure:
    {{
        "gameFiles": {{
            "config.ts": "// Configuration file content",
            "Scene.ts": "// Main scene file content"
        }},
        "metadata": {{
            "id": "game-id-in-kebab-case",
            "title": "Game Title",
            "description": "Game description"
        }}
    }}
    
    The game should:
    1. Use Phaser 3 framework
    2. Include complete, working TypeScript code
    3. Follow similar patterns to existing games
    4. Include proper physics, collisions, and scoring
    5. Use publicly available assets (provide URLs in the code)
    """

    response = claude_client.messages.create(
        model="claude-3-5-sonnet-latest",
        max_tokens=4 * 1024,
        messages=[{"role": "user", "content": prompt}],
    )

    # Parse and validate the response
    return response.content[0].text
