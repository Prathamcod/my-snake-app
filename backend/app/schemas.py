from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field

Direction = Literal["up", "down", "left", "right"]
GameStatus = Literal["idle", "running", "paused", "game_over"]


class SnakeSegment(BaseModel):
    x: int
    y: int


class Food(BaseModel):
    x: int
    y: int


class GameState(BaseModel):
    snake: list[SnakeSegment]
    food: Food
    direction: Direction
    queued_direction: Direction
    score: int = 0
    status: GameStatus = "idle"
    board_width: int = 20
    board_height: int = 20


class StartGameRequest(BaseModel):
    player_name: Optional[str] = Field(default=None, max_length=80)


class MoveRequest(BaseModel):
    direction: Direction


class GameResult(BaseModel):
    final_score: int
    status: GameStatus = "game_over"
    message: Optional[str] = None


class LeaderboardEntry(BaseModel):
    rank: int
    player_name: Optional[str] = None
    score: int


class ErrorResponse(BaseModel):
    detail: str


class HealthResponse(BaseModel):
    status: str = "ok"
