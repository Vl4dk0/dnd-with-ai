"""Pydantic models for the application."""
from datetime import datetime
from pydantic import BaseModel, Field


class Player(BaseModel):
    """Represents a player in the game."""
    player_id: str
    player_name: str


class ChatMessage(BaseModel):
    """Represents a chat message in the game."""
    message_id: str = Field(..., default_factory=str)
    player_id: str
    player_name: str
    text: str
    timestamp: datetime = Field(..., default_factory=datetime.utcnow)
