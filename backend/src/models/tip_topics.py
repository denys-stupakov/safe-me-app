# backend/src/models/tip_topics.py
from sqlmodel import SQLModel, Field
from datetime import datetime

class TipTopic(SQLModel, table=True):
    tip_id: int = Field(foreign_key="tip.id", primary_key=True)
    topic_id: int = Field(foreign_key="topic.id", primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)