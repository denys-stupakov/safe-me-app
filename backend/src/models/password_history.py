# backend/src/models/password_history.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class PasswordHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    # Optional: link to user later
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")

    password: str = Field(nullable=False)  # plain text (we'll discuss encryption later)
    length: int = Field(nullable=False)
    exclude_special: bool = Field(default=False)

    entropy: float = Field(nullable=False)
    strength: str = Field(nullable=False)  # "weak", "medium", "strong", "very_strong"

    created_at: datetime = Field(default_factory=datetime.utcnow)