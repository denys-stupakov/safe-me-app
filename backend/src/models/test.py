# backend/src/models/test.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Test(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str = Field(nullable=False)  # The actual question text
    created_at: datetime = Field(default_factory=datetime.utcnow)