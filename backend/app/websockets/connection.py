"""WebSocket connection management."""
import uuid
from fastapi import WebSocket, WebSocketDisconnect

from app.models.schemas import ChatMessage, Player
from app.services.game_manager import GameManager


class ConnectionManager:
    """Manages WebSocket connections for a single game session."""

    def __init__(self, game_manager: GameManager):
        self.game_manager = game_manager

    async def connect(
        self,
        websocket: WebSocket,
        game_id: str,
        player_id: str,
        player_name: str,
    ):
        """Handles a new WebSocket connection."""
        await websocket.accept()
        game = self.game_manager.get_game(game_id)
        if not game:
            await websocket.close(code=4000, reason="Game not found")
            return

        player = Player(player_id=player_id, player_name=player_name)
        await game.add_player(player, websocket)

        try:
            while True:
                data = await websocket.receive_json()
                if data["event_type"] == "new_message":
                    message = ChatMessage(
                        message_id=str(uuid.uuid4()),
                        player_id=player_id,
                        player_name=player_name,
                        text=data["payload"]["text"],
                    )
                    game.messages.append(message)
                    await game.broadcast({
                        "event_type": "new_message",
                        "payload": message.dict(),
                    })
        except WebSocketDisconnect:
            await game.remove_player(player_id)
