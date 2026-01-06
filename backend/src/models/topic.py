from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class Topic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    tips: List["TipTopic"] = Relationship(back_populates="topic")