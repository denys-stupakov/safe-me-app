# backend/src/models/topic.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Topic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)