from sqlmodel import SQLModel, create_engine, Session
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DB_PATH = BASE_DIR / "database" / "safe_me.db"
DB_URL = f"sqlite:///{DB_PATH}"

DB_PATH.parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(DB_URL, echo=True, connect_args={"check_same_thread": False})

from ..models.user import User
from ..models.topic import Topic
from ..models.tip import Tip
from ..models.tip_topics import TipTopic
from ..models.user_viewed_tips import UserViewedTip
from ..models.password_history import PasswordHistory

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session