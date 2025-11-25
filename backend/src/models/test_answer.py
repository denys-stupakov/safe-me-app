# backend/src/models/test_answer.py
from sqlmodel import SQLModel, Field
from typing import Optional

class TestAnswer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    test_id: int = Field(foreign_key="test.id", nullable=False)
    content: str = Field(nullable=False)  # e.g. "Fake login pages"
    is_correct: bool = Field(default=False)  # allows multiple correct answers