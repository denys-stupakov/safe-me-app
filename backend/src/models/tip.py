# backend/src/models/tip.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Tip(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(nullable=False)
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)