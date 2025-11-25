# backend/src/models/topic.py
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List

class Topic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)

    # CORRECT WAY IN 2025
    tests: List["Test"] = Relationship(
        back_populates="topics",
        sa_relationship_kwargs={"secondary": "testtopic"}
    )