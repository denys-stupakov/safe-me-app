# backend/src/routes/tips.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from typing import List
from pydantic import BaseModel
from ..database.database import get_session
from ..models.tip import Tip
from ..models.tip_topics import TipTopic
from ..models.topic import Topic  # ← NEW: to get topic names
from ..models.user_viewed_tips import UserViewedTip
from ..models.user_favorite_tip import UserFavoriteTip

router = APIRouter(prefix="/tips", tags=["Tips"])

class TipRead(BaseModel):
    id: int
    title: str
    content: str
    topics: List[str]  # ← NEW: list of topic names for display

@router.get("/random", response_model=List[TipRead])
def get_random_tips(
    topic_ids: str = None,  # comma-separated
    session: Session = Depends(get_session)
):
    query = select(Tip)

    if topic_ids:
        ids = [int(x) for x in topic_ids.split(",") if x.strip()]
        if ids:
            query = query.join(TipTopic).where(TipTopic.topic_id.in_(ids))

    # Get ALL matching tips in random order
    tips = session.exec(query.order_by(func.random())).all()

    result = []
    for tip in tips:
        # Get topic names for this tip
        topic_names = session.exec(
            select(Topic.name)
            .join(TipTopic)
            .where(TipTopic.tip_id == tip.id)
        ).all()

        result.append(TipRead(
            id=tip.id,
            title=tip.title,
            content=tip.content,
            topics=topic_names  # ← sends topic names to frontend
        ))
    return result

@router.post("/view/{tip_id}")
def mark_tip_viewed(tip_id: int, session: Session = Depends(get_session)):
    user_id = 1  # test user
    existing = session.exec(
        select(UserViewedTip).where(UserViewedTip.user_id == user_id, UserViewedTip.tip_id == tip_id)
    ).first()
    if not existing:
        viewed = UserViewedTip(user_id=user_id, tip_id=tip_id)
        session.add(viewed)
        session.commit()
    return {"message": "Viewed"}

@router.post("/favorite/{tip_id}")
def toggle_favorite(tip_id: int, session: Session = Depends(get_session)):
    user_id = 1
    existing = session.exec(
        select(UserFavoriteTip).where(UserFavoriteTip.user_id == user_id, UserFavoriteTip.tip_id == tip_id)
    ).first()

    if existing:
        session.delete(existing)
        session.commit()
        return {"message": "Removed from favorites"}
    else:
        favorite = UserFavoriteTip(user_id=user_id, tip_id=tip_id)
        session.add(favorite)
        session.commit()
        return {"message": "Added to favorites"}