# backend/src/models/user_viewed_tips.py
from sqlmodel import SQLModel, Field
from datetime import datetime

class UserViewedTip(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    tip_id: int = Field(foreign_key="tip.id", primary_key=True)
    viewed_at: datetime = Field(default_factory=datetime.utcnow)