from fastapi.testclient import TestClient

from app.main import app


def test_application_creates_sqlite_tables() -> None:
    with TestClient(app) as client:
        response = client.get("/leaderboard")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
