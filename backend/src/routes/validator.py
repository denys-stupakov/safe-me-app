from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel
import math
import string
import re

router = APIRouter(prefix="/validator", tags=["Password Validator"])


class ValidateRequest(BaseModel):
    password: str


def calculate_entropy(password: str) -> float:
    charset_size = 0
    if re.search(r"[a-z]", password): charset_size += 26
    if re.search(r"[A-Z]", password): charset_size += 26
    if re.search(r"\d", password): charset_size += 10
    if re.search(r"[!@#$%^&*()_+\-=\[\]{}|;':,.<>/?`~]", password): charset_size += 32

    if charset_size == 0:
        return 0
    return round(len(password) * math.log2(charset_size), 2)


@router.post("/validate")
def validate_password(req: ValidateRequest):
    pwd = req.password
    length = len(pwd)

    if length == 0:
        raise HTTPException(400, "Password cannot be empty")

    if length > 200:
        raise HTTPException(400, "Password too long")

    entropy = calculate_entropy(pwd)

    # Strength rating
    if entropy < 60:
        strength = "Very Weak"
        color = "Red"
    elif entropy < 80:
        strength = "Weak"
        color = "Orange"
    elif entropy < 100:
        strength = "Medium"
        color = "Yellow"
    elif entropy < 128:
        strength = "Strong"
        color = "Green"
    else:
        strength = "Very Strong"
        color = "Dark Green"

    # Warnings
    warnings = []
    if length < 12:
        warnings.append("Too short (minimum 12 recommended)")
    if not re.search(r"[a-z]", pwd):
        warnings.append("Missing lowercase")
    if not re.search(r"[A-Z]", pwd):
        warnings.append("Missing uppercase")
    if not re.search(r"\d", pwd):
        warnings.append("Missing numbers")
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{}|;':,.<>/?`~]", pwd):
        warnings.append("Missing special characters")
    if re.search(r"(.)\1\1\1", pwd):
        warnings.append("Repeating characters detected")
    if pwd.lower() in ["password", "123456", "qwerty", "admin"]:
        warnings.append("Common password detected")

    return {
        "length": length,
        "entropy": entropy,
        "strength": strength,
        "color": color,
        "warnings": warnings,
        "has_lowercase": bool(re.search(r"[a-z]", pwd)),
        "has_uppercase": bool(re.search(r"[A-Z]", pwd)),
        "has_digits": bool(re.search(r"\d", pwd)),
        "has_special": bool(re.search(r"[!@#$%^&*()_+\-=\[\]{}|;':,.<>/?`~]", pwd)),
    }