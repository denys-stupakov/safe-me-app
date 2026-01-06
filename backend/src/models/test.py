# backend/src/models/test.py
from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class Test(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str

    answers: List["TestAnswer"] = Relationship(back_populates="test")