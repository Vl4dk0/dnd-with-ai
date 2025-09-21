"""REST API for game management."""
from fastapi import APIRouter, Depends, HTTPException
from app.services.game_manager import GameManager, game_manager

router = APIRouter()


def get_game_manager() -> GameManager:
    """Dependency injector for the GameManager."""
    return game_manager


@router.post("/games")
async def create_game(manager: GameManager = Depends(get_game_manager)):
    """Creates a new game session."""
    game_id = manager.create_game()
    return {"game_id": game_id}


@router.get("/games/{game_id}")
async def get_game(game_id: str,
                   manager: GameManager = Depends(get_game_manager)):
    """Checks if a game session exists."""
    if manager.get_game(game_id):
        return {"exists": True}
    raise HTTPException(status_code=404, detail="Game not found")
