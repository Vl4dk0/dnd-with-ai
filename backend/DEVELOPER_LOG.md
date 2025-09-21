# Developer Log

## Files Created

*   `backend/requirements.txt`: Listed all project dependencies.
*   `backend/app/models/schemas.py`: Defined the Pydantic models for `Player` and `ChatMessage`.
*   `backend/app/services/game_manager.py`: Implemented the `GameManager` class for in-memory game state management.
*   `backend/app/websockets/connection.py`: Implemented the WebSocket connection logic.
*   `backend/app/api/games.py`: Created the REST API endpoints for game management.
*   `backend/main.py`: Set up the main FastAPI application and WebSocket endpoint.
*   `backend/tests/test_game_manager.py`: Wrote unit tests for the `GameManager`.

## Key Implementation Decisions

*   Followed the modular structure outlined in the project brief.
*   Used FastAPI's dependency injection to provide the `GameManager` instance to the API routes.
*   Implemented a singleton pattern for the `GameManager` to ensure a single source of truth for game state.
*   Kept the WebSocket connection logic separate from the main application file for better organization.
