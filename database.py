import sqlite3
import hashlib
import json
import os

DB_PATH = "database/recruitment.db"
CACHE_PATH = "database/embedding_cache.db"

STAGES = ["Screened", "Shortlisted", "Interview Scheduled", "Interviewed",
          "Offer Extended", "Hired", "Rejected"]

POSTING_COLS = ["id", "company_name", "title", "department", "jd_text", "status",
                "semantic_weight", "skill_weight", "experience_weight", "education_weight",
                "created_by", "created_at"]


def _db(path=DB_PATH):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return sqlite3.connect(path)


def _run(sql, params=(), path=DB_PATH, fetch=None):
    conn = _db(path)
    cur = conn.cursor()
    cur.execute(sql, params)
    result = cur.fetchone() if fetch == "one" else cur.fetchall() if fetch == "all" else cur.lastrowid
    conn.commit()
    conn.close()
    return result


def _migrate(cur, table, columns):
    cur.execute(f"PRAGMA table_info({table})")
    existing = {row[1] for row in cur.fetchall()}
    for name, ddl in columns:
        if name not in existing:
            cur.execute(ddl)


def init_db():
    conn = _db()
    cur = conn.cursor()

    cur.execute("""CREATE TABLE IF NOT EXISTS candidates(
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, education TEXT,
        ats_score REAL, semantic_score REAL, skill_score REAL, education_score REAL, experience_score REAL,
        matched_skills TEXT, missing_skills TEXT, verdict TEXT, user_id INTEGER,
        company_name TEXT, job_posting_id INTEGER, recruiter_id INTEGER, stage TEXT DEFAULT 'Screened',
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    cur.execute("""CREATE TABLE IF NOT EXISTS job_postings(
        id INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT NOT NULL, title TEXT NOT NULL,
        department TEXT, jd_text TEXT NOT NULL, status TEXT DEFAULT 'Open',
        semantic_weight REAL DEFAULT 40, skill_weight REAL DEFAULT 35,
        experience_weight REAL DEFAULT 15, education_weight REAL DEFAULT 10,
        created_by INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    cur.execute("""CREATE TABLE IF NOT EXISTS candidate_notes(
        id INTEGER PRIMARY KEY AUTOINCREMENT, candidate_id INTEGER NOT NULL,
        author_user_id INTEGER, author_username TEXT, note_text TEXT, rating INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    cur.execute("""CREATE TABLE IF NOT EXISTS stage_history(
        id INTEGER PRIMARY KEY AUTOINCREMENT, candidate_id INTEGER NOT NULL,
        from_stage TEXT, to_stage TEXT NOT NULL, changed_by_user_id INTEGER,
        changed_by_username TEXT, changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    cur.execute("""CREATE TABLE IF NOT EXISTS interviews(
        id INTEGER PRIMARY KEY AUTOINCREMENT, candidate_id INTEGER NOT NULL, job_posting_id INTEGER,
        interviewer_name TEXT, scheduled_at TEXT, notes TEXT, status TEXT DEFAULT 'Scheduled',
        created_by INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")

    _migrate(cur, "job_postings", [
        ("semantic_weight", "ALTER TABLE job_postings ADD COLUMN semantic_weight REAL DEFAULT 40"),
        ("skill_weight", "ALTER TABLE job_postings ADD COLUMN skill_weight REAL DEFAULT 35"),
        ("experience_weight", "ALTER TABLE job_postings ADD COLUMN experience_weight REAL DEFAULT 15"),
        ("education_weight", "ALTER TABLE job_postings ADD COLUMN education_weight REAL DEFAULT 10"),
    ])

    conn.commit()
    conn.close()

    conn2 = _db(CACHE_PATH)
    conn2.execute("""CREATE TABLE IF NOT EXISTS embedding_cache(
        text_hash TEXT PRIMARY KEY, embedding_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
    conn2.commit()
    conn2.close()


# ---------- Candidates ----------

def get_existing_application(email, job_posting_id):
    if job_posting_id is None:
        return None
    return _run("SELECT * FROM candidates WHERE email=? AND job_posting_id=?",
                (email, job_posting_id), fetch="one")


def save_candidate(candidate, ats_result, skill_report, user_id=None,
                    company_name=None, job_posting_id=None, recruiter_id=None):

    existing = get_existing_application(candidate["email"], job_posting_id)
    matched = ", ".join(skill_report["Matched Skills"])
    missing = ", ".join(skill_report["Missing Skills"])

    if existing is not None:
        _run("""UPDATE candidates SET name=?, phone=?, education=?, ats_score=?, semantic_score=?,
                skill_score=?, education_score=?, experience_score=?, matched_skills=?, missing_skills=?,
                verdict=?, upload_date=CURRENT_TIMESTAMP WHERE id=?""",
             (candidate["name"], candidate["phone"], candidate["education"], ats_result["Final Score"],
              ats_result["Semantic Score"], ats_result["Skill Score"], ats_result["Education Score"],
              ats_result["Experience Score"], matched, missing, ats_result.get("Verdict", ""), existing[0]))
        return existing[0]

    return _run("""INSERT INTO candidates(name, email, phone, education, ats_score, semantic_score,
                skill_score, education_score, experience_score, matched_skills, missing_skills, verdict,
                user_id, company_name, job_posting_id, recruiter_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (candidate["name"], candidate["email"], candidate["phone"], candidate["education"],
                 ats_result["Final Score"], ats_result["Semantic Score"], ats_result["Skill Score"],
                 ats_result["Education Score"], ats_result["Experience Score"], matched, missing,
                 ats_result.get("Verdict", ""), user_id, company_name, job_posting_id, recruiter_id))


def get_candidates_by_user(user_id):
    return _run("SELECT * FROM candidates WHERE user_id=? ORDER BY upload_date DESC", (user_id,), fetch="all")


def get_candidates_by_company(company_name):
    return _run("SELECT * FROM candidates WHERE company_name=? ORDER BY ats_score DESC", (company_name,), fetch="all")


def search_candidate_in_company(company_name, keyword):
    like = f"%{keyword}%"
    return _run("""SELECT * FROM candidates WHERE company_name=? AND (name LIKE ? OR email LIKE ?)
                ORDER BY ats_score DESC""", (company_name, like, like), fetch="all")


def get_candidate_by_id(candidate_id):
    return _run("SELECT * FROM candidates WHERE id=?", (candidate_id,), fetch="one")


def delete_candidate_data_for_user(user_id):
    conn = _db()
    cur = conn.cursor()
    cur.execute("DELETE FROM candidates WHERE user_id=?", (user_id,))
    conn.commit()
    deleted = cur.rowcount
    conn.close()
    return deleted


def get_all_candidates():
    return _run("SELECT * FROM candidates ORDER BY ats_score DESC", fetch="all")


def search_candidate(keyword):
    like = f"%{keyword}%"
    return _run("SELECT * FROM candidates WHERE name LIKE ? OR email LIKE ? ORDER BY ats_score DESC",
                (like, like), fetch="all")


def total_candidates():
    return _run("SELECT COUNT(*) FROM candidates", fetch="one")[0]


# ---------- Job Postings ----------

def create_job_posting(company_name, title, jd_text, created_by, department=None,
                        semantic_weight=40, skill_weight=35, experience_weight=15, education_weight=10):
    if not title.strip() or not jd_text.strip():
        raise ValueError("Job title and description are required.")

    total = semantic_weight + skill_weight + experience_weight + education_weight
    if abs(total - 100) > 0.01:
        raise ValueError(f"Scoring weights must add up to 100 (currently {total}).")

    return _run("""INSERT INTO job_postings(company_name, title, department, jd_text, created_by,
                semantic_weight, skill_weight, experience_weight, education_weight) VALUES(?,?,?,?,?,?,?,?,?)""",
                (company_name, title.strip(), department, jd_text.strip(), created_by,
                 semantic_weight, skill_weight, experience_weight, education_weight))


def get_job_postings(company_name, status=None):
    cols = ", ".join(POSTING_COLS)
    if status:
        rows = _run(f"SELECT {cols} FROM job_postings WHERE company_name=? AND status=? ORDER BY created_at DESC",
                     (company_name, status), fetch="all")
    else:
        rows = _run(f"SELECT {cols} FROM job_postings WHERE company_name=? ORDER BY created_at DESC",
                     (company_name,), fetch="all")
    return [dict(zip(POSTING_COLS, r)) for r in rows]


def get_job_posting(posting_id):
    cols = ", ".join(POSTING_COLS)
    row = _run(f"SELECT {cols} FROM job_postings WHERE id=?", (posting_id,), fetch="one")
    return dict(zip(POSTING_COLS, row)) if row else None


def close_job_posting(posting_id):
    _run("UPDATE job_postings SET status='Closed' WHERE id=?", (posting_id,))


def reopen_job_posting(posting_id):
    _run("UPDATE job_postings SET status='Open' WHERE id=?", (posting_id,))


# ---------- Pipeline Stages ----------

def move_candidate_stage(candidate_id, new_stage, changed_by_user_id, changed_by_username):
    if new_stage not in STAGES:
        raise ValueError(f"Invalid stage: {new_stage}")

    row = _run("SELECT stage FROM candidates WHERE id=?", (candidate_id,), fetch="one")
    if row is None:
        raise ValueError("Candidate not found.")
    old_stage = row[0]

    conn = _db()
    cur = conn.cursor()
    cur.execute("UPDATE candidates SET stage=? WHERE id=?", (new_stage, candidate_id))
    cur.execute("""INSERT INTO stage_history(candidate_id, from_stage, to_stage, changed_by_user_id,
                changed_by_username) VALUES(?,?,?,?,?)""",
                (candidate_id, old_stage, new_stage, changed_by_user_id, changed_by_username))
    conn.commit()
    conn.close()
    return old_stage, new_stage


def get_stage_history(candidate_id):
    cols = ["from_stage", "to_stage", "changed_by_username", "changed_at"]
    rows = _run(f"SELECT {', '.join(cols)} FROM stage_history WHERE candidate_id=? ORDER BY changed_at ASC",
                (candidate_id,), fetch="all")
    return [dict(zip(cols, r)) for r in rows]


# ---------- Notes ----------

def add_candidate_note(candidate_id, author_user_id, author_username, note_text, rating=None):
    if rating is not None and not (1 <= rating <= 5):
        raise ValueError("Rating must be between 1 and 5.")
    return _run("""INSERT INTO candidate_notes(candidate_id, author_user_id, author_username, note_text, rating)
                VALUES(?,?,?,?,?)""", (candidate_id, author_user_id, author_username, note_text.strip(), rating))


def get_candidate_notes(candidate_id):
    cols = ["id", "author_username", "note_text", "rating", "created_at"]
    rows = _run(f"SELECT {', '.join(cols)} FROM candidate_notes WHERE candidate_id=? ORDER BY created_at DESC",
                (candidate_id,), fetch="all")
    return [dict(zip(cols, r)) for r in rows]


# ---------- Interviews ----------

def schedule_interview(candidate_id, interviewer_name, scheduled_at, created_by, job_posting_id=None, notes=None):
    return _run("""INSERT INTO interviews(candidate_id, job_posting_id, interviewer_name, scheduled_at,
                notes, created_by) VALUES(?,?,?,?,?,?)""",
                (candidate_id, job_posting_id, interviewer_name, scheduled_at, notes, created_by))


def get_interviews_for_candidate(candidate_id):
    cols = ["id", "interviewer_name", "scheduled_at", "notes", "status", "created_at"]
    rows = _run(f"SELECT {', '.join(cols)} FROM interviews WHERE candidate_id=? ORDER BY scheduled_at ASC",
                (candidate_id,), fetch="all")
    return [dict(zip(cols, r)) for r in rows]


def update_interview_status(interview_id, status):
    if status not in ("Scheduled", "Completed", "Cancelled"):
        raise ValueError(f"Invalid interview status: {status}")
    _run("UPDATE interviews SET status=? WHERE id=?", (status, interview_id))


# ---------- Embedding Cache ----------

def _hash_text(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def get_cached_embeddings(texts):
    if not texts:
        return {}
    hashes = {_hash_text(t): t for t in texts}
    placeholders = ",".join("?" * len(hashes))
    rows = _run(f"SELECT text_hash, embedding_json FROM embedding_cache WHERE text_hash IN ({placeholders})",
                list(hashes.keys()), path=CACHE_PATH, fetch="all")
    return {hashes[h]: json.loads(e) for h, e in rows}


def store_embeddings(text_to_embedding):
    if not text_to_embedding:
        return
    conn = _db(CACHE_PATH)
    cur = conn.cursor()
    cur.executemany("INSERT OR REPLACE INTO embedding_cache(text_hash, embedding_json) VALUES(?,?)",
                     [(_hash_text(t), json.dumps(e)) for t, e in text_to_embedding.items()])
    conn.commit()
    conn.close()


def cache_size():
    return _run("SELECT COUNT(*) FROM embedding_cache", path=CACHE_PATH, fetch="one")[0]


def clear_cache():
    _run("DELETE FROM embedding_cache", path=CACHE_PATH)
