# backend/src/routes/tests.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List
from pydantic import BaseModel
from ..database.database import get_session
from ..models.test import Test
from ..models.test_answer import TestAnswer
from ..models.test_topics import TestTopic

router = APIRouter(prefix="/tests", tags=["Tests"])

# Response models (same as before)
class TestAnswerRead(BaseModel):
    id: int
    content: str

class TestRead(BaseModel):
    id: int
    content: str
    answers: List[TestAnswerRead]

class ScoreRequest(BaseModel):
    test_id: int
    selected_answer_ids: List[int]

class WrongQuestion(BaseModel):
    content: str
    selected: List[str]
    correct: List[str]

class ScoreResponse(BaseModel):
    score: float
    total: int
    correct: int
    wrong_questions: List[WrongQuestion]

@router.get("/random", response_model=List[TestRead])
def get_random_tests(
    topic_ids: str = None,
    limit: int = 10,
    session: Session = Depends(get_session)
):
    query = select(Test)

    if topic_ids:
        ids = [int(x) for x in topic_ids.split(",") if x.strip()]
        if ids:
            query = query.join(TestTopic).where(TestTopic.topic_id.in_(ids))

    tests = session.exec(query.order_by(func.random()).limit(limit)).all()

    result = []
    for test in tests:
        answers = session.exec(select(TestAnswer).where(TestAnswer.test_id == test.id)).all()
        result.append(TestRead(
            id=test.id,
            content=test.content,
            answers=[TestAnswerRead(id=a.id, content=a.content) for a in answers]
        ))
    return result

@router.post("/score", response_model=ScoreResponse)
def score_test(
    data: List[ScoreRequest],
    session: Session = Depends(get_session)
):
    if not data:
        return ScoreResponse(score=0, total=0, correct=0, wrong_questions=[])

    total = len(data)
    correct = 0
    wrong = []

    for item in data:
        # Get all answers for this test
        answers = session.exec(
            select(TestAnswer).where(TestAnswer.test_id == item.test_id)
        ).all()

        if not answers:
            continue

        correct_ids = {a.id for a in answers if a.is_correct}
        selected_ids = set(item.selected_answer_ids)

        if selected_ids == correct_ids:
            correct += 1
        else:
            test = session.get(Test, item.test_id)
            wrong.append(WrongQuestion(
                content=test.content if test else "Unknown question",
                selected=[a.content for a in answers if a.id in selected_ids],
                correct=[a.content for a in answers if a.id in correct_ids]
            ))

    score = round((correct / total * 100), 1) if total > 0 else 0

    return ScoreResponse(
        score=score,
        total=total,
        correct=correct,
        wrong_questions=wrong
    )