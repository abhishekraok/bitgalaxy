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
    2. Use Phaser 3 framework with TypeScript
    3. Include proper physics, collisions, and scoring
    4. Use publicly available assets (provide URLs in the code)
    
    The file must follow this exact structure with these exact names:
    ```typescript
    import 'phaser';
    
    class MainScene extends Phaser.Scene {{
        // Scene implementation
    }}
    
    const config: Phaser.Types.Core.GameConfig = {{
        type: Phaser.AUTO,
        scene: MainScene,
        // Rest of configuration
    }};
    
    export {{ MainScene as default, config }};
    ```
    
    Return only the complete TypeScript code without any additional text or comments.
    """

    response = claude_client.messages.create(
        model="claude-3-5-sonnet-latest",
        max_tokens=4 * 1024,
        messages=[{"role": "user", "content": prompt}],
    )

    response_text = response.content[0].text
    game_code = response_text.split("```typescript")[1].split("```")[0]

    try:
        config = {
            "gameFiles": {
                "Scene.ts": game_code,
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
