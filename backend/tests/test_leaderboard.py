from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.database import Base
from app.services.leaderboard_service import LeaderboardService


def test_scores_are_persisted_ordered_and_limited(tmp_path) -> None:
    database_path = tmp_path / "test.sqlite3"
    engine = create_engine(f"sqlite:///{database_path}")
    Base.metadata.create_all(engine)

    with Session(engine) as session:
        service = LeaderboardService(session)
        for score in [30, 100, 70, 50]:
            service.save_score("player", score)

    with Session(engine) as session:
        records = LeaderboardService(session).get_top_scores(limit=3)
        assert [record.score for record in records] == [100, 70, 50]

    Base.metadata.drop_all(engine)
