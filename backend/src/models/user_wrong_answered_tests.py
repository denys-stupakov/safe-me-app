# backend/src/models/user_wrong_answered_tests.py
from sqlmodel import SQLModel, Field
from datetime import datetime

class UserWrongAnsweredTest(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    test_id: int = Field(foreign_key="test.id", primary_key=True)
    selected_answer_ids: str  # uložené ako CSV, napr. "1,3,4"
    correct_answer_ids: str   # uložené ako CSV, napr. "2,3"
    created_at: datetime = Field(default_factory=datetime.utcnow)