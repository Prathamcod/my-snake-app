from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import LeaderboardEntry
from app.services.leaderboard_service import LeaderboardService

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])


@router.get("", response_model=list[LeaderboardEntry])
def get_leaderboard(database: Session = Depends(get_db)) -> list[LeaderboardEntry]:
    records = LeaderboardService(database).get_top_scores()
    return [
        LeaderboardEntry(rank=index, player_name=record.player_name, score=record.score)
        for index, record in enumerate(records, start=1)
    ]
