import os
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from models import User, CandidateProfile, RecruiterProfile, UserRole

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "super-secret-ats-jwt-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days validity

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def create_user(db: Session, username: str, password: str, email: str, role: str) -> User:
    hashed_pwd = hash_password(password)
    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_pwd,
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Initialize role profiles
    if role == UserRole.CANDIDATE.value:
        profile = CandidateProfile(
            user_id=new_user.id,
            full_name=username,
            email=email
        )
        db.add(profile)
    elif role == UserRole.RECRUITER.value:
        profile = RecruiterProfile(
            user_id=new_user.id,
            company_name="My Company",
            designation="Recruiter"
        )
        db.add(profile)
    
    db.commit()
    return new_user
