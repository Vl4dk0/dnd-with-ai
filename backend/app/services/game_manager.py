"""Manages the state of all active game sessions."""
from typing import Dict, List, Optional
from fastapi import WebSocket

from app.models.schemas import ChatMessage, Player


class Game:
    """Represents a single game session."""

    def __init__(self, game_id: str):
        self.game_id = game_id
        self.players: Dict[str, Player] = {}
        self.messages: List[ChatMessage] = []
        self.active_connections: Dict[str, WebSocket] = {}

    async def add_player(self, player: Player, websocket: WebSocket):
        """Adds a player to the game and notifies others."""
        self.players[player.player_id] = player
        self.active_connections[player.player_id] = websocket
        await self.broadcast({
            "event_type": "user_joins",
            "payload": player.dict()
        })

    async def remove_player(self, player_id: str):
        """Removes a player from the game and notifies others."""
        player = self.players.pop(player_id, None)
        self.active_connections.pop(player_id, None)
        if player:
            await self.broadcast({
                "event_type": "user_leaves",
                "payload": player.dict()
            })

    async def broadcast(self, message: dict):
        """Broadcasts a message to all connected players."""
        for websocket in self.active_connections.values():
            await websocket.send_json(message)


class GameManager:
    """Singleton class to manage all game sessions."""

    def __init__(self):
        self.games: Dict[str, Game] = {}

    def create_game(self) -> str:
        """Creates a new game session and returns the game ID."""
        import uuid
        game_id = str(uuid.uuid4().hex)[:6].upper()
        self.games[game_id] = Game(game_id)
        return game_id

    def get_game(self, game_id: str) -> Optional[Game]:
        """Retrieves a game session by its ID."""
        return self.games.get(game_id)


game_manager = GameManager()
