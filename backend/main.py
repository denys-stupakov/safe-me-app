# backend/src/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---- IMPORT FROM SAME PACKAGE ---------------------------------
from .database.db import create_db_and_tables
# ----------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()   # ← creates data/safe_me.db
    yield
    # optional cleanup

# ---- CREATE APP ------------------------------------------------
app = FastAPI(title="Safe Me API", lifespan=lifespan)
# ----------------------------------------------------------------

# ---- CORS (Expo Go) --------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ----------------------------------------------------------------

# ---- ROUTES ----------------------------------------------------
@app.get("/")
async def root():
    return {"message": "Safe Me backend is ready with SQLite!"}

@app.get("/api/hello")
async def hello():
    return {"greeting": "Hello from FastAPI!", "status": "success"}
# ----------------------------------------------------------------