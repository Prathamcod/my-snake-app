from __future__ import annotations

from typing import Optional

from app.game import Direction, Game


class GameService:
    def __init__(self) -> None:
        self.game = Game()
        self.player_name: Optional[str] = None
        self.score_saved = False

    def start_game(self, player_name: Optional[str] = None) -> Game:
        self.player_name = player_name
        self.game.start()
        return self.game

    def get_state(self) -> Game:
        return self.game

    def move(self, direction: Direction) -> Game:
        self.game.set_direction(direction)
        self.game.tick()
        return self.game

    def restart(self, player_name: Optional[str] = None) -> Game:
        self.player_name = player_name
        self.score_saved = False
        self.game.restart()
        return self.game
