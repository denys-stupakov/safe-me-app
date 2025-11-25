# backend/src/routes/topic.py
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List
from ..database.database import get_session
from ..models.topic import Topic

router = APIRouter(prefix="/topics", tags=["topics"])

@router.get("/", response_model=List[Topic])
def get_topics(session: Session = Depends(get_session)):
    topics = session.exec(select(Topic)).all()
    return topics