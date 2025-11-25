# backend/src/models/test.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class Test(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field(index=True)

    answers: List["TestAnswer"] = Relationship(back_populates="test")

    topics: List["Topic"] = Relationship(
        back_populates="tests",
        sa_relationship_kwargs={"secondary": "testtopic"}
    )