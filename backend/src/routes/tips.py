# backend/src/routes/tips.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from typing import List
from pydantic import BaseModel

from .auth import get_current_user
from ..database.database import get_session
from ..models.tip import Tip
from ..models.tip_topics import TipTopic
from ..models.topic import Topic  # ← NEW: to get topic names
from ..models.user import User
from ..models.user_viewed_tips import UserViewedTip
from ..models.user_favorite_tip import UserFavoriteTip
from .topic import Topic
from ..models.tip import Tip
from ..models.tip_topics import TipTopic

router = APIRouter(prefix="/tips", tags=["Tips"])

class TipRead(BaseModel):
    id: int
    title: str
    content: str
    topics: List[str]

@router.get("/random", response_model=List[TipRead])
def get_random_tips(
        topic_ids: str = None,
        session: Session = Depends(get_session),
        user: User = Depends(get_current_user)
):
    seen_subq = select(UserViewedTip.tip_id).where(UserViewedTip.user_id == user.id)

    query = select(Tip).where(Tip.id.not_in(seen_subq))

    if topic_ids:
        ids = [int(x) for x in topic_ids.split(",") if x.strip()]
        if ids:
            query = query.join(TipTopic).where(TipTopic.topic_id.in_(ids))

    tips = session.exec(query.order_by(func.random())).all()

    result = []
    for tip in tips:
        topic_names = session.exec(
            select(Topic.name)
            .join(TipTopic)
            .where(TipTopic.tip_id == tip.id)
        ).all()
        result.append(TipRead(
            id=tip.id,
            title=tip.title,
            content=tip.content,
            topics=topic_names
        ))

    return result

@router.post("/view/{tip_id}")
def mark_tip_viewed(tip_id: int, session: Session = Depends(get_session)):
    user_id = 1
    existing = session.exec(
        select(UserViewedTip).where(UserViewedTip.user_id == user_id, UserViewedTip.tip_id == tip_id)
    ).first()
    if not existing:
        viewed = UserViewedTip(user_id=user_id, tip_id=tip_id)
        session.add(viewed)
        session.commit()
    return {"message": "Viewed"}

@router.get("/favorites", response_model=List[TipRead])
def get_favorite_tips(
        session: Session = Depends(get_session),
        user: User = Depends(get_current_user)
):
    fav_tip_ids = session.exec(
        select(UserFavoriteTip.tip_id).where(UserFavoriteTip.user_id == user.id)
    ).all()

    tips = session.exec(
        select(Tip).where(Tip.id.in_(fav_tip_ids))
    ).all()

    result = []
    for tip in tips:
        topic_names = session.exec(
            select(Topic.name)
            .join(TipTopic)
            .where(TipTopic.tip_id == tip.id)
        ).all()
        result.append(TipRead(
            id=tip.id,
            title=tip.title,
            content=tip.content,
            topics=topic_names
        ))

    return result


@router.get("/history", response_model=List[TipRead])
def get_viewed_history(
        session: Session = Depends(get_session),
        user: User = Depends(get_current_user)
):
    viewed_tip_ids = session.exec(
        select(UserViewedTip.tip_id).where(UserViewedTip.user_id == user.id)
    ).all()

    tips = session.exec(
        select(Tip).where(Tip.id.in_(viewed_tip_ids))
    ).all()

    result = []
    for tip in tips:
        topic_names = session.exec(
            select(Topic.name)
            .join(TipTopic)
            .where(TipTopic.tip_id == tip.id)
        ).all()
        result.append(TipRead(
            id=tip.id,
            title=tip.title,
            content=tip.content,
            topics=topic_names
        ))

    return result

@router.post("/favorite/{tip_id}")
def toggle_favorite(
    tip_id: int,
    session: Session = Depends(get_session),
    user = Depends(get_current_user)
):
    user_id = user.id

    existing = session.exec(
        select(UserFavoriteTip).where(
            UserFavoriteTip.user_id == user_id,
            UserFavoriteTip.tip_id == tip_id
        )
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

@router.post("/viewed/{tip_id}")
def mark_tip_viewed(
        tip_id: int,
        session: Session = Depends(get_session),
        user: User = Depends(get_current_user)
):
    existing = session.exec(
        select(UserViewedTip).where(
            UserViewedTip.user_id == user.id,
            UserViewedTip.tip_id == tip_id
        )
    ).first()

    if not existing:
        viewed = UserViewedTip(user_id=user.id, tip_id=tip_id)
        session.add(viewed)
        session.commit()

    return {"message": "Tip marked as viewed"}

@router.get("/random", response_model=List[TipRead])
def get_unseen_tips(session: Session = Depends(get_session), user: User = Depends(get_current_user)):
    # IDs of tips already viewed by user
    seen_subq = select(UserViewedTip.tip_id).where(UserViewedTip.user_id == user.id)

    # Tips not viewed yet
    unseen_tips = session.exec(
        select(Tip).where(Tip.id.not_in(seen_subq))
    ).all()

    return unseen_tips