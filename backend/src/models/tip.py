from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional
from datetime import datetime

class Tip(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str
    created_at: datetime

    topics: List["TipTopic"] = Relationship(back_populates="tip")  # <-- string, nie priamo trieda