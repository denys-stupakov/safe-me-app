# backend/src/models/test_topics.py  ← MUST be defined first
from sqlmodel import SQLModel, Field
from datetime import datetime

class TestTopic(SQLModel, table=True):
    __tablename__ = "testtopic"  # ← lowercase, no camelcase

    test_id: int = Field(foreign_key="test.id", primary_key=True)
    topic_id: int = Field(foreign_key="topic.id", primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)