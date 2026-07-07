import sqlite3
import hashlib
import os
import re
import secrets
import binascii
from datetime import datetime, timedelta

DB_PATH = "database/users.db"

VALID_ROLES = ("recruiter", "candidate")
EMAIL_PATTERN = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15
RESET_TOKEN_EXPIRY_MINUTES = 30
PBKDF2_ITERATIONS = 100_000

JD_TYPES = ("Data Science / AI", "Software Engineering", "DevOps / Cloud",
            "Business Analytics", "General / Other")
HIRING_AS_TYPES = ("Staffing Agency", "Corporate HR")


class AccountLockedError(Exception):
    def __init__(self, unlock_time):
        self.unlock_time = unlock_time
        super().__init__(f"Account locked until {unlock_time}")


def _db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    return sqlite3.connect(DB_PATH)


def init_db():
    conn = _db()
    cur = conn.cursor()

    cur.execute("""CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE,
        full_name TEXT, password_hash TEXT NOT NULL, salt TEXT NOT NULL, role TEXT NOT NULL,
        failed_attempts INTEGER DEFAULT 0, locked_until TIMESTAMP, reset_token TEXT,
        reset_token_expires TIMESTAMP, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    cur.execute("""CREATE TABLE IF NOT EXISTS recruiter_profiles(
        user_id INTEGER PRIMARY KEY, company_name TEXT, hiring_roles TEXT, jd_type TEXT,
        hiring_as TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id))""")

    conn.commit()
    conn.close()


# ---------- Password hashing (PBKDF2-HMAC-SHA256, stdlib only) ----------

def _hash_password(password, salt=None):
    salt = salt or os.urandom(16)
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return binascii.hexlify(pwd_hash).decode(), binascii.hexlify(salt).decode()


def _verify_password(password, salt_hex, hash_hex):
    computed, _ = _hash_password(password, binascii.unhexlify(salt_hex))
    return secrets.compare_digest(computed, hash_hex)


# ---------- User Management ----------

def username_taken(username):
    conn = _db()
    exists = conn.execute("SELECT 1 FROM users WHERE username=?", (username,)).fetchone() is not None
    conn.close()
    return exists


def create_user(username, password, role, email=None, full_name=None):
    username = username.strip()

    if not username or not password:
        raise ValueError("Username and password are required.")
    if len(password) < 6:
        raise ValueError("Password must be at least 6 characters.")
    if role not in VALID_ROLES:
        raise ValueError(f"Invalid role: {role}")
    if username_taken(username):
        raise ValueError("That username is already taken.")

    password_hash, salt = _hash_password(password)

    conn = _db()
    cur = conn.cursor()
    cur.execute("INSERT INTO users(username, email, full_name, password_hash, salt, role) VALUES(?,?,?,?,?,?)",
                (username, email, full_name, password_hash, salt, role))
    conn.commit()
    user_id = cur.lastrowid
    conn.close()
    return user_id


def authenticate_user(username, password):
    conn = _db()
    cur = conn.cursor()
    cur.execute("""SELECT id, username, email, full_name, password_hash, salt, role, created_at,
                failed_attempts, locked_until FROM users WHERE username=?""", (username.strip(),))
    row = cur.fetchone()

    if row is None:
        conn.close()
        return None

    (user_id, uname, email, full_name, password_hash, salt, role, created_at,
     failed_attempts, locked_until) = row
    failed_attempts = failed_attempts or 0

    if locked_until:
        unlock_time = datetime.fromisoformat(locked_until)
        if datetime.now() < unlock_time:
            conn.close()
            raise AccountLockedError(unlock_time)
        failed_attempts = 0

    if not _verify_password(password, salt, password_hash):
        failed_attempts += 1
        if failed_attempts >= MAX_FAILED_ATTEMPTS:
            unlock_time = datetime.now() + timedelta(minutes=LOCKOUT_MINUTES)
            cur.execute("UPDATE users SET failed_attempts=?, locked_until=? WHERE id=?",
                        (failed_attempts, unlock_time.isoformat(), user_id))
            conn.commit()
            conn.close()
            raise AccountLockedError(unlock_time)
        cur.execute("UPDATE users SET failed_attempts=? WHERE id=?", (failed_attempts, user_id))
        conn.commit()
        conn.close()
        return None

    cur.execute("UPDATE users SET failed_attempts=0, locked_until=NULL WHERE id=?", (user_id,))
    conn.commit()
    conn.close()
    return {"id": user_id, "username": uname, "email": email, "full_name": full_name,
            "role": role, "created_at": created_at}


def delete_user(user_id):
    conn = _db()
    cur = conn.cursor()
    cur.execute("DELETE FROM users WHERE id=?", (user_id,))
    conn.commit()
    deleted = cur.rowcount
    conn.close()
    return deleted > 0


# ---------- Password Reset (on-screen code — no SMTP configured) ----------

def request_password_reset(username_or_email):
    conn = _db()
    cur = conn.cursor()
    cur.execute("SELECT id, username, role FROM users WHERE username=? OR email=?",
                (username_or_email.strip(), username_or_email.strip()))
    row = cur.fetchone()

    if row is None:
        conn.close()
        raise ValueError("No account found with that username or email.")

    user_id, username, role = row
    if role == "candidate":
        conn.close()
        raise ValueError("Candidate accounts don't use passwords — just log in with your email again.")

    token = secrets.token_hex(4).upper()
    expires_at = (datetime.now() + timedelta(minutes=RESET_TOKEN_EXPIRY_MINUTES)).isoformat()
    cur.execute("UPDATE users SET reset_token=?, reset_token_expires=? WHERE id=?",
                (token, expires_at, user_id))
    conn.commit()
    conn.close()
    return {"username": username, "token": token}


def reset_password_with_token(username, token, new_password):
    if len(new_password) < 6:
        raise ValueError("Password must be at least 6 characters.")

    conn = _db()
    cur = conn.cursor()
    cur.execute("SELECT id, reset_token, reset_token_expires FROM users WHERE username=?", (username.strip(),))
    row = cur.fetchone()

    if row is None:
        conn.close()
        raise ValueError("Account not found.")

    user_id, stored_token, expires_at = row
    if not stored_token or stored_token != token.strip().upper():
        conn.close()
        raise ValueError("Invalid reset code.")
    if datetime.now() > datetime.fromisoformat(expires_at):
        conn.close()
        raise ValueError("Reset code expired. Please request a new one.")

    password_hash, salt = _hash_password(new_password)
    cur.execute("""UPDATE users SET password_hash=?, salt=?, reset_token=NULL, reset_token_expires=NULL,
                failed_attempts=0, locked_until=NULL WHERE id=?""", (password_hash, salt, user_id))
    conn.commit()
    conn.close()


# ---------- Recruiter Onboarding Profile ----------

def has_recruiter_profile(user_id):
    conn = _db()
    exists = conn.execute("SELECT 1 FROM recruiter_profiles WHERE user_id=?", (user_id,)).fetchone() is not None
    conn.close()
    return exists


def save_recruiter_profile(user_id, company_name, hiring_roles, jd_type, hiring_as="Corporate HR"):
    if not company_name.strip():
        raise ValueError("Company name is required.")
    if jd_type not in JD_TYPES:
        raise ValueError(f"Invalid job description type: {jd_type}")
    if hiring_as not in HIRING_AS_TYPES:
        raise ValueError(f"Invalid hiring_as value: {hiring_as}")

    conn = _db()
    conn.execute("""INSERT INTO recruiter_profiles(user_id, company_name, hiring_roles, jd_type, hiring_as)
                VALUES(?,?,?,?,?)
                ON CONFLICT(user_id) DO UPDATE SET company_name=excluded.company_name,
                hiring_roles=excluded.hiring_roles, jd_type=excluded.jd_type, hiring_as=excluded.hiring_as""",
                (user_id, company_name.strip(), hiring_roles.strip(), jd_type, hiring_as))
    conn.commit()
    conn.close()


def get_recruiter_profile(user_id):
    conn = _db()
    row = conn.execute("""SELECT user_id, company_name, hiring_roles, jd_type, hiring_as, created_at
                FROM recruiter_profiles WHERE user_id=?""", (user_id,)).fetchone()
    conn.close()
    if row is None:
        return None
    return {"user_id": row[0], "company_name": row[1], "hiring_roles": row[2],
            "jd_type": row[3], "hiring_as": row[4], "created_at": row[5]}


# ---------- Candidate login — email only, no password ----------

def is_valid_email(email):
    return bool(EMAIL_PATTERN.match(email.strip()))


def get_or_create_candidate(email, full_name=None):
    email = email.strip().lower()
    if not is_valid_email(email):
        raise ValueError("Please enter a valid email address.")

    conn = _db()
    cur = conn.cursor()
    cur.execute("SELECT id, username, email, full_name, role, created_at FROM users WHERE email=? AND role='candidate'",
                (email,))
    row = cur.fetchone()

    if row:
        conn.close()
        return {"id": row[0], "username": row[1], "email": row[2],
                "full_name": row[3], "role": row[4], "created_at": row[5]}

    unusable_password = binascii.hexlify(os.urandom(32)).decode()
    password_hash, salt = _hash_password(unusable_password)

    try:
        cur.execute("INSERT INTO users(username, email, full_name, password_hash, salt, role) VALUES(?,?,?,?,?,'candidate')",
                    (email, email, full_name, password_hash, salt))
        conn.commit()
        user_id = cur.lastrowid
        conn.close()
        return {"id": user_id, "username": email, "email": email,
                "full_name": full_name, "role": "candidate", "created_at": None}

    except sqlite3.IntegrityError:
        conn.rollback()
        cur.execute("SELECT id, username, email, full_name, role, created_at FROM users WHERE email=? AND role='candidate'",
                    (email,))
        row = cur.fetchone()
        conn.close()
        return {"id": row[0], "username": row[1], "email": row[2],
                "full_name": row[3], "role": row[4], "created_at": row[5]}
