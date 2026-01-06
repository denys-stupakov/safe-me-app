# backend/src/database/database.py
from sqlmodel import SQLModel, create_engine, Session
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "database" / "safe_me.db"
DB_URL = f"sqlite:///{DB_PATH}"

DB_PATH.parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(DB_URL, echo=False, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

from ..models.user import User
from ..models.topic import Topic
from ..models.test import Test
from ..models.test_answer import TestAnswer
from ..models.test_topics import TestTopic
from ..models.password_history import PasswordHistory
from ..models.user_favorite_tip import UserFavoriteTip
from ..models.tip import Tip
from ..models.tip_topics import TipTopic