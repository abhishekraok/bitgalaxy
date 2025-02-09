from anthropic import Anthropic
from app.core.config import settings
from typing import Dict, Any
import json

claude_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def generate_game_configuration(
    description: str, game_id: str, game_title: str
) -> Dict[str, Any]:
    """Generate game configuration using Claude"""
    prompt = f"""Create a complete Phaser 3 game implementation in a single TypeScript file.
    Title: {game_title}
    Description: {description or 'A simple game'}
    
    The file should:
    1. Include the complete game configuration and scene class
    2. Export both the config and scene
    3. Use Phaser 3 framework with TypeScript
    4. Include proper physics, collisions, and scoring
    5. Use publicly available assets (provide URLs in the code)
    
    The file structure should follow this pattern:
    ```typescript
    import 'phaser';
    
    export class GameScene extends Phaser.Scene {{
        // Scene implementation
    }}
    
    export const config: Phaser.Types.Core.GameConfig = {{
        // Game configuration
    }};
    ```
    
    Return only the complete TypeScript code without any additional text or comments.
    """

    response = claude_client.messages.create(
        model="claude-3-5-sonnet-latest",
        max_tokens=4 * 1024,
        messages=[{"role": "user", "content": prompt}],
    )

    response_text = response.content[0].text

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
