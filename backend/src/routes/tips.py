# backend/src/routes/tips.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from typing import List
from pydantic import BaseModel  # ← THIS WAS MISSING!
from ..database.database import get_session
from ..models.tip import Tip
from ..models.tip_topics import TipTopic
from ..models.user_viewed_tips import UserViewedTip
from ..models.user_favorite_tip import UserFavoriteTip

router = APIRouter(prefix="/tips", tags=["Tips"])

class TipRead(BaseModel):
    id: int
    title: str
    content: str

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

    # Get ALL matching tips and randomize on server
    tips = session.exec(query.order_by(func.random())).all()

    return [TipRead(id=t.id, title=t.title, content=t.content) for t in tips]

@router.post("/view/{tip_id}")
def mark_tip_viewed(tip_id: int, session: Session = Depends(get_session)):
    # For testing, use user_id = 1
    user_id = 1
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