from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class Test(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str

    answers: List["TestAnswer"] = Relationship(back_populates="test")


from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .test import Test

class TestAnswer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    test_id: int = Field(foreign_key="test.id")
    content: str
    is_correct: bool = False

    test: Optional["Test"] = Relationship(back_populates="answers")