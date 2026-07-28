import bcrypt
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

from database import get_db_connection, dict_from_row

# In-memory sessions (fine for free-tier single-instance deployments)
sessions: Dict[str, Dict] = {}


class AccountLockedError(Exception):
    def __init__(self, unlock_time):
        self.unlock_time = unlock_time
        super().__init__(f"Account locked until {unlock_time}")


def _get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        return dict_from_row(cur.fetchone())
    except Exception as e:
        print(f"Error getting user by username: {e}")
        return None
    finally:
        conn.close()


def _get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, username, email, role, is_2fa_enabled, account_locked_until FROM users WHERE id = ?",
            (user_id,),
        )
        return dict_from_row(cur.fetchone())
    except Exception as e:
        print(f"Error getting user by ID: {e}")
        return None
    finally:
        conn.close()


def init_db():
    """Users table is created in database.init_db(); this is a no-op here."""
    print("Auth init: users table managed by database.py")


def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
    user = _get_user_by_username(username)
    if not user:
        return None

    locked_until = user.get("account_locked_until")
    if locked_until:
        try:
            lock_dt = datetime.fromisoformat(locked_until)
            if datetime.now(timezone.utc) < lock_dt:
                raise AccountLockedError(locked_until)
        except ValueError:
            pass

    if not bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
        return None

    return {
        "id": user["id"],
        "username": user["username"],
        "email": user.get("email"),
        "role": user["role"],
        "is_2fa_enabled": bool(user.get("is_2fa_enabled", 0)),
    }


def create_session(user_id: int) -> str:
    session_token = str(uuid.uuid4())
    expiry_time = datetime.now(timezone.utc) + timedelta(hours=24)
    sessions[session_token] = {"user_id": user_id, "expiry": expiry_time}
    return session_token


def validate_session(session_token: str) -> Optional[int]:
    if not session_token:
        return None
    session_data = sessions.get(session_token)
    if not session_data:
        return None
    if datetime.now(timezone.utc) > session_data["expiry"]:
        del sessions[session_token]
        return None
    return session_data["user_id"]


def is_2fa_enabled(user_id: int) -> bool:
    user = _get_user_by_id(user_id)
    return bool(user.get("is_2fa_enabled", 0)) if user else False


def create_user(username: str, password: str, email: str, role: str) -> Optional[Dict[str, Any]]:
    try:
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)",
            (username, hashed_password.decode("utf-8"), email, role),
        )
        conn.commit()
        user_id = cur.lastrowid
        conn.close()
        return {"id": user_id, "username": username, "role": role, "email": email}
    except Exception as e:
        print(f"Error creating user: {e}")
        return None
