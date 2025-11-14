# src/database/db.py
import asyncpg
from decouple import config

DATABASE_URL = config("DATABASE_URL")

pool = None

async def init_db():
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL)
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS tips (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                content TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS viewed_tips (
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                tip_id INTEGER REFERENCES tips(id) ON DELETE CASCADE,
                viewed_at TIMESTAMPTZ DEFAULT NOW(),
                PRIMARY KEY (user_id, tip_id)
            );
        """)

async def get_db():
    async with pool.acquire() as conn:
        yield conn