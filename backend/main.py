# backend/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---- YOUR DATABASE SETUP -------------------------------------------------
from src.database.database import create_db_and_tables
# -------------------------------------------------------------------------

# -----------------------------------------------------------------------
# 1. Lifespan – runs once at startup
# -----------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create SQLite tables the first time the API starts
    create_db_and_tables()
    yield   # ← app is now running
    # (optional cleanup here)

# -----------------------------------------------------------------------
# 2. Create the FastAPI app **after** the lifespan is defined
# -----------------------------------------------------------------------
app = FastAPI(
    title="Safe Me API",
    lifespan=lifespan          # ← important!
)

# -----------------------------------------------------------------------
# 3. CORS – allow Expo Go (and any origin while developing)
# -----------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------
# 4. Routes
# -----------------------------------------------------------------------
@app.get("/")
async def root():
    return {"message": "Safe Me backend is ready with database!"}

@app.get("/api/hello")
async def hello():
    return {"greeting": "Hello from FastAPI!", "status": "success"}