"""Main FastAPI application."""
from fastapi import FastAPI, WebSocket
from app.api import games
from app.services.game_manager import game_manager
from app.websockets.connection import ConnectionManager

app = FastAPI()

app.include_router(games.router)


@app.websocket("/ws/games/{game_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    game_id: str,
    player_id: str,
    player_name: str,
):
    """WebSocket endpoint for game sessions."""
    manager = ConnectionManager(game_manager)
    await manager.connect(websocket, game_id, player_id, player_name)
