from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime


class GameBase(BaseModel):
    title: str


class GameCreate(GameBase):
    description: str
    game_type: str = "simple"  # TODO: Remove this field
    title: str


class GameResponse(GameBase):
    id: str
    configuration: Dict[str, Any]
    state: Dict[str, Any]
    created_at: datetime
    updated_at: datetime | None

    class Config:
        from_attributes = True


class GameList(GameBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
