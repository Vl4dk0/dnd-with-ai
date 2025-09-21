"""Tests for the API endpoints."""
import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client() -> TestClient:
    """Returns a TestClient instance."""
    return TestClient(app)


def test_create_game(client: TestClient):
    """Tests that a game can be created."""
    response = client.post("/games")
    assert response.status_code == 200
    assert "game_id" in response.json()


def test_get_game_not_found(client: TestClient):
    """Tests that getting a non-existent game returns 404."""
    response = client.get("/games/non-existent-id")
    assert response.status_code == 404
