"""Tests for the GameManager."""
import pytest
from fastapi import WebSocket

from app.models.schemas import Player
from app.services.game_manager import Game
from app.services.game_manager import GameManager


class MockWebSocket(WebSocket):

    def __init__(self):
        scope = {"type": "websocket"}
        super().__init__(scope=scope, receive=None, send=None)

    async def accept(self):
        pass

    async def send_json(self, data):
        pass

    async def close(self, code=1000, reason=None):
        pass


@pytest.fixture
def manager() -> GameManager:
    """Returns a GameManager instance."""
    return GameManager()


@pytest.fixture
def game(manager: GameManager) -> Game:
    """Returns a Game instance."""
    game_id = manager.create_game()
    return manager.get_game(game_id)


def test_create_game(manager: GameManager):
    """Tests that a game can be created."""
    game_id = manager.create_game()
    assert manager.get_game(game_id) is not None


def test_get_game_not_found(manager: GameManager):
    """Tests that getting a non-existent game returns None."""
    assert manager.get_game("non-existent-id") is None


@pytest.mark.asyncio
async def test_add_player(game: Game):
    """Tests that a player can be added to a game."""
    player = Player(player_id="test_player", player_name="Test Player")
    websocket = MockWebSocket()
    await game.add_player(player, websocket)
    assert player.player_id in game.players
    assert game.players[player.player_id] == player


@pytest.mark.asyncio
async def test_remove_player(game: Game):
    """Tests that a player can be removed from a game."""
    player = Player(player_id="test_player", player_name="Test Player")
    websocket = MockWebSocket()
    await game.add_player(player, websocket)
    await game.remove_player(player.player_id)
    assert player.player_id not in game.players
