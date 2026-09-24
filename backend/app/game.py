from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

Point = tuple[int, int]
Direction = Literal["up", "down", "left", "right"]
GameStatus = Literal["idle", "running", "paused", "game_over"]


@dataclass
class Game:
    board_width: int = 20
    board_height: int = 20
    snake: list[Point] = field(default_factory=lambda: [(10, 10), (9, 10), (8, 10)])
    food: Point = (15, 10)
    direction: Direction = "right"
    queued_direction: Direction = "right"
    score: int = 0
    status: GameStatus = "idle"

    def start(self) -> None:
        if self.status == "idle":
            self.status = "running"

    def pause(self) -> None:
        if self.status == "running":
            self.status = "paused"

    def resume(self) -> None:
        if self.status == "paused":
            self.status = "running"

    def restart(self) -> None:
        self.snake = [(10, 10), (9, 10), (8, 10)]
        self.food = (15, 10)
        self.direction = "right"
        self.queued_direction = "right"
        self.score = 0
        self.status = "running"

    def set_direction(self, direction: Direction) -> None:
        if self.status != "running":
            return
        if self.is_opposite(self.direction, direction):
            return
        self.queued_direction = direction

    @staticmethod
    def is_opposite(current: Direction, candidate: Direction) -> bool:
        opposites = {
            "up": "down",
            "down": "up",
            "left": "right",
            "right": "left",
        }
        return opposites[current] == candidate

    def tick(self) -> None:
        if self.status != "running":
            return

        direction = self.queued_direction
        if self.is_opposite(self.direction, direction):
            direction = self.direction

        dx, dy = self._vector_for(direction)
        head_x, head_y = self.snake[0]
        next_head = (head_x + dx, head_y + dy)

        if self._is_wall(next_head):
            self.status = "game_over"
            return

        ate_food = next_head == self.food
        body_to_check = self.snake if ate_food else self.snake[:-1]
        if any(segment == next_head for segment in body_to_check):
            self.status = "game_over"
            return

        new_snake = [next_head, *self.snake]
        if not ate_food:
            new_snake = new_snake[:-1]
        self.snake = new_snake
        self.direction = direction
        self.queued_direction = direction

        if ate_food:
            self.score += 10
            self.food = self._spawn_food()

    def _is_wall(self, point: Point) -> bool:
        x, y = point
        return x < 0 or x >= self.board_width or y < 0 or y >= self.board_height

    def _spawn_food(self) -> Point:
        occupied = set(self.snake)
        free_cells = [
            (x, y)
            for y in range(self.board_height)
            for x in range(self.board_width)
            if (x, y) not in occupied
        ]
        if not free_cells:
            return (0, 0)
        return free_cells[0]

    @staticmethod
    def _vector_for(direction: Direction) -> tuple[int, int]:
        vector_map = {
            "up": (0, -1),
            "down": (0, 1),
            "left": (-1, 0),
            "right": (1, 0),
        }
        return vector_map[direction]
