from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.game import Game
from app.schemas import GameState, MoveRequest, StartGameRequest
from app.services.game_service import GameService
from app.services.leaderboard_service import LeaderboardService

router = APIRouter(prefix="/game", tags=["game"])
game_service = GameService()


def to_game_state(game: Game) -> GameState:
    return GameState(
        snake=[{"x": x, "y": y} for x, y in game.snake],
        food={"x": game.food[0], "y": game.food[1]},
        direction=game.direction,
        queued_direction=game.queued_direction,
        score=game.score,
        status=game.status,
        board_width=game.board_width,
        board_height=game.board_height,
    )


def save_game_over(database: Session) -> None:
    game = game_service.get_state()
    if game.status == "game_over" and not game_service.score_saved:
        LeaderboardService(database).save_score(game_service.player_name, game.score)
        game_service.score_saved = True


@router.post("/start", response_model=GameState)
def start_game(request: StartGameRequest) -> GameState:
    return to_game_state(game_service.start_game(request.player_name))


@router.get("/state", response_model=GameState)
def get_game_state() -> GameState:
    return to_game_state(game_service.get_state())


@router.post("/move", response_model=GameState)
def move(request: MoveRequest, database: Session = Depends(get_db)) -> GameState:
    state = game_service.move(request.direction)
    save_game_over(database)
    return to_game_state(state)


@router.post("/restart", response_model=GameState)
def restart_game(request: StartGameRequest) -> GameState:
    return to_game_state(game_service.restart(request.player_name))