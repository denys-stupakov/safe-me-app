# backend/src/routes/test.py
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlmodel import Session, select, func, SQLModel
from typing import List
from pydantic import BaseModel, Field, validator
from ..database.database import get_session
from ..models.test import Test
from ..models.test_answer import TestAnswer
from ..models.test_topics import TestTopic
from ..models.topic import Topic

router = APIRouter(prefix="/tests", tags=["tests"])


# Request model — same style as your Password model
class TestRequest(BaseModel):
    topic_ids: List[int] = Field(..., description="List of topic IDs to include in the test")
    limit: int = Field(10, ge=1, le=30, description="Number of random questions (1–30)")

    @validator("topic_ids")
    def must_not_be_empty(cls, v):
        if not v:
            raise ValueError("At least one topic must be selected")
        return v


# Response model — clean and frontend-friendly
class TestAnswerRead(SQLModel):
    id: int
    content: str
    is_correct: bool = False  # hidden from user in real app, but useful for dev/testing

    class Config:
        orm_mode = True


class TestRead(SQLModel):
    id: int
    content: str
    answers: List[TestAnswerRead]

    class Config:
        orm_mode = True


@router.post("/random", response_model=List[TestRead])
def generate_random_test(
    request: TestRequest = Body(...),
    session: Session = Depends(get_session)
):
    """
    Generate a random test from selected topics.
    Same structure & style as /password/generate
    """
    topic_ids = request.topic_ids
    limit = request.limit

    # Validate all topics exist
    existing_count = session.exec(
        select(func.count()).select_from(Topic).where(Topic.id.in_(topic_ids))
    ).one()

    if existing_count != len(topic_ids):
        raise HTTPException(
            status_code=404,
            detail="One or more selected topics not found"
        )

    # Get random questions from selected topics
    tests = session.exec(
        select(Test)
        .join(TestTopic, Test.id == TestTopic.test_id)
        .where(TestTopic.topic_id.in_(topic_ids))
        .order_by(func.random())
        .limit(limit)
    ).all()

    if not tests:
        raise HTTPException(
            status_code=404,
            detail="No questions found for the selected topics"
        )

    # Build response with shuffled answers
    result = []
    import random

    for test in tests:
        answers = session.exec(
            select(TestAnswer).where(TestAnswer.test_id == test.id)
        ).all()

        # Shuffle answers so correct one isn't always first
        random.shuffle(answers)

        result.append(
            TestRead(
                id=test.id,
                content=test.content,
                answers=[TestAnswerRead.from_orm(a) for a in answers]
            )
        )

    return result