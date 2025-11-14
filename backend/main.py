from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# CORRECT IMPORT — no dots!
from src.database.database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Safe Me backend is starting up...")
    create_db_and_tables()
    print("SQLite database ready: safe_me.db created!")
    print("API is now LIVE – your friend can call from React Native!")
    yield
    print("Safe Me backend is shutting down...")


app = FastAPI(
    title="Safe Me API",
    description="Backend for Safe Me – Password Generator, Validator, Tips & Tests",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Safe Me API is running!"}