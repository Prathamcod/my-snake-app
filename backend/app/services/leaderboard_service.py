from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import ScoreRecord


class LeaderboardService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def save_score(self, player_name: str | None, score: int) -> ScoreRecord:
        record = ScoreRecord(player_name=player_name, score=score)
        self.session.add(record)
        self.session.commit()
        self.session.refresh(record)
        return record

    def get_top_scores(self, limit: int = 10) -> list[ScoreRecord]:
        stmt = select(ScoreRecord).order_by(ScoreRecord.score.desc(), ScoreRecord.created_at.asc()).limit(limit)
        return list(self.session.execute(stmt).scalars().all())
