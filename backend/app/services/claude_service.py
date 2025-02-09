from anthropic import Anthropic
from app.core.config import settings
from typing import Dict, Any
import json

claude_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def generate_game_configuration(
    description: str, game_id: str, game_title: str
) -> Dict[str, Any]:
    """Generate game configuration using Claude"""
    prompt = f"""Create a Phaser 3 game implementation.
    Title: {game_title}
    Description: {description or 'A simple game'}
    
    All your code should be in a single file. Return the complete working code in typescript.
    Do not include any other text or comments.
    
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

    response_text = response.content[0].text
    print(response_text)

    try:
        config = {
            "gameFiles": {
                "Scene.ts": response_text,
            },
            "metadata": {
                "id": game_id,
                "title": game_title,
                "description": description,
            },
        }
        return config

    except json.JSONDecodeError:
        raise ValueError("Invalid JSON response from Claude. Please try again.")
    except Exception as e:
        raise ValueError(f"Error processing game configuration: {str(e)}")
