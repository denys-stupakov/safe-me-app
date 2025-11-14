from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database.database import create_db_and_tables
from contextlib import asynccontextmanager

# Allow React Native to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origins later for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()

app = FastAPI(title="Safe Me API")

@app.get("/")
def root():
    return {"message": "Safe Me backend is ready with database!"}