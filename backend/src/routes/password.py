# backend/src/routes/password.py
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlmodel import Session
from ..database.database import get_session
from ..models.password_history import PasswordHistory
import secrets
import string
import math
from pydantic import BaseModel

router = APIRouter(prefix="/password", tags=["Password Generator"])

def calculate_entropy(charset_size: int, length: int) -> float:
    return round(length * math.log2(charset_size), 2)


def get_charset(exclude_special: bool = False) -> str:
    charset = string.ascii_lowercase + string.ascii_uppercase + string.digits
    if not exclude_special:
        charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    return charset

class Password(BaseModel):
    length: int
    exclude_special: bool

@router.post("/generate")
def generate_password(
        password: Password,
        session: Session = Depends(get_session)
):
    length = password.length
    exclude_special = password.exclude_special

    print(length)
    print(exclude_special)

    if not 24 <= length <= 64:
        raise HTTPException(400, "Length must be 16–64")

    min_length = 26 if exclude_special else 24
    if length < min_length:
        raise HTTPException(400, f"Minimum length is {min_length} when excluding special chars")

    charset = get_charset(exclude_special)

    password = ''.join(secrets.choice(charset) for _ in range(length))

    entropy = calculate_entropy(len(charset), length)

    if entropy < 150:
        raise HTTPException(400,
                            f"Entropy too low: {entropy} bits. Need ≥ 150. Try longer password or include special chars.")

    if entropy < 100:
        strength = "weak"
    elif entropy < 140:
        strength = "medium"
    elif entropy < 160:
        strength = "strong"
    else:
        strength = "very_strong"

    history = PasswordHistory(
        password=password,
        length=length,
        exclude_special=exclude_special,
        entropy=entropy,
        strength=strength
    )
    session.add(history)
    session.commit()
    session.refresh(history)

    return {
        "password": password,
        "length": length,
        "entropy": entropy,
        "strength": strength,
        "strength_emoji": "🟢" if strength == "very_strong" else "🟡" if strength == "strong" else "🔴",
        "message": "Secure password generated!",
        "saved_to_history": True
    }