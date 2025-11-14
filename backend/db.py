# backend/src/database/db.py
from pathlib import Path
from sqlmodel import SQLModel, create_engine

# -------------------------------------------------
# 1. SQLite DB path (creates data/ folder)
# -------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # backend/
DB_DIR = BASE_DIR / "data"
DB_PATH = DB_DIR / "safe_me.db"

DB_DIR.mkdir(parents=True, exist_ok=True)

engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)


# -------------------------------------------------
# 2. Define tables
# -------------------------------------------------
class User(SQLModel, table=True):
    id: int | None = None
    username: str
    password: str


class Tip(SQLModel, table=True):
    id: int int | None = None
    name: str
    content: str


class ViewedTip(SQLModel, table=True):
    user_id: int
    tip_id: int
    viewed_at: str | None = None


# -------------------------------------------------
# 3. Create tables on startup
# -------------------------------------------------
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)