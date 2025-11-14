from sqlmodel import create_engine, SQLModel, Session
from pathlib import Path

DATABASE_PATH = Path(__file__).parent.parent.parent / "database" / "safe_me.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session