from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .tip import Tip
    from .topic import Topic

class TipTopic(SQLModel, table=True):
    tip_id: int = Field(foreign_key="tip.id", primary_key=True)
    topic_id: int = Field(foreign_key="topic.id", primary_key=True)

    tip: "Tip" = Relationship(back_populates="topics")
    topic: "Topic" = Relationship(back_populates="tips")