import os
import sqlite3
import json
from typing import Dict, Any, List, Optional
from datetime import datetime

DATABASE_PATH = os.environ.get("DATABASE_PATH", "./resume_analyzer.db")
REPORT_RETENTION_DAYS = int(os.environ.get("REPORT_RETENTION_DAYS", 90))


def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def dict_from_row(row) -> Optional[Dict[str, Any]]:
    if row is None:
        return None
    return dict(row)


def rows_to_dicts(rows) -> List[Dict[str, Any]]:
    return [dict(r) for r in rows]


def init_db():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                role TEXT NOT NULL,
                is_2fa_enabled INTEGER DEFAULT 0,
                account_locked_until TEXT,
                failed_login_attempts INTEGER DEFAULT 0,
                created_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS candidates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                linkedin_url TEXT,
                github_url TEXT,
                location TEXT,
                resume_text TEXT,
                skills TEXT DEFAULT '[]',
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS resume_versions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
                label TEXT NOT NULL,
                resume_text TEXT NOT NULL,
                original_filename TEXT,
                file_path TEXT,
                parsed_data TEXT,
                created_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS job_postings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                company_name TEXT NOT NULL,
                location TEXT,
                jd_text TEXT NOT NULL,
                status TEXT DEFAULT 'Published',
                created_by INTEGER,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now')),
                semantic_weight REAL DEFAULT 0.4,
                skill_weight REAL DEFAULT 0.3,
                experience_weight REAL DEFAULT 0.2,
                education_weight REAL DEFAULT 0.1
            );

            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
                job_posting_id INTEGER REFERENCES job_postings(id) ON DELETE CASCADE,
                recruiter_id INTEGER,
                application_text TEXT,
                resume_version_id INTEGER REFERENCES resume_versions(id),
                ats_score REAL,
                ats_result TEXT,
                status TEXT DEFAULT 'Applied',
                applied_at TEXT DEFAULT (datetime('now')),
                UNIQUE(candidate_id, job_posting_id)
            );

            CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_posting_id);
            CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
            CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
            CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
        """)

        # Seed sample job postings if empty
        cur.execute("SELECT COUNT(*) FROM job_postings")
        count = cur.fetchone()[0]
        if count == 0:
            sample_jobs = [
                (
                    "Senior Python Developer",
                    "TechCorp Solutions",
                    "Remote / Bangalore",
                    """We are looking for a Senior Python Developer to join our growing engineering team.

Requirements:
- 5+ years of Python development experience
- Strong knowledge of FastAPI, Django or Flask
- Experience with PostgreSQL, Redis, and message queues
- Proficiency in Docker and Kubernetes
- Experience with AWS or GCP cloud services
- Strong understanding of REST APIs and microservices
- Knowledge of CI/CD pipelines (GitHub Actions, Jenkins)
- Excellent problem-solving and communication skills

Nice to have:
- Experience with machine learning frameworks (TensorFlow, PyTorch)
- Contributions to open source projects
- Knowledge of agile/scrum methodologies

Responsibilities:
- Design and build scalable backend services
- Mentor junior developers
- Lead code reviews and architectural discussions""",
                    "Published",
                ),
                (
                    "React Frontend Engineer",
                    "StartupHub",
                    "Hybrid / Chennai",
                    """Join our fast-moving product team as a React Frontend Engineer.

Requirements:
- 3+ years React and TypeScript experience
- Proficiency in Next.js and modern CSS (Tailwind, CSS Modules)
- Experience with REST APIs and GraphQL
- Knowledge of state management (Redux, Zustand, React Query)
- Understanding of web performance optimization
- Experience with testing frameworks (Jest, Cypress)
- Git and version control best practices

Nice to have:
- React Native experience
- Design system creation experience
- Node.js backend knowledge

Responsibilities:
- Build pixel-perfect, performant UI components
- Collaborate closely with design and backend teams
- Participate in sprint planning and retrospectives""",
                    "Published",
                ),
                (
                    "DevOps / Cloud Engineer",
                    "CloudNine Systems",
                    "Remote",
                    """We are hiring a DevOps Engineer to help scale our cloud infrastructure.

Requirements:
- 4+ years DevOps/SRE experience
- Expertise in AWS (EC2, ECS, Lambda, RDS, S3)
- Strong Kubernetes and Helm experience
- Proficiency with Terraform and infrastructure as code
- CI/CD pipeline design with GitHub Actions or GitLab CI
- Monitoring and observability (Prometheus, Grafana, Datadog)
- Linux system administration
- Scripting in Python or Bash

Nice to have:
- GCP or Azure certifications
- Experience with service mesh (Istio, Linkerd)
- Security and compliance background

Responsibilities:
- Maintain and improve cloud infrastructure
- Build automated deployment pipelines
- Ensure 99.9% uptime SLAs""",
                    "Published",
                ),
                (
                    "Data Science Engineer",
                    "Analytics Pro",
                    "Bangalore / Remote",
                    """Seeking a Data Science Engineer to build data pipelines and ML models.

Requirements:
- 3+ years in data science or ML engineering
- Strong Python skills (pandas, numpy, scikit-learn)
- Experience with deep learning frameworks (TensorFlow or PyTorch)
- SQL proficiency and experience with big data tools (Spark, Hive)
- Knowledge of MLOps and model deployment
- Statistics and probability fundamentals
- Experience with data visualization tools

Nice to have:
- NLP / LLM experience
- Cloud ML platforms (SageMaker, Vertex AI)
- A/B testing and experimentation

Responsibilities:
- Build end-to-end ML pipelines
- Develop and deploy predictive models
- Collaborate with product teams on data-driven features""",
                    "Published",
                ),
            ]
            cur.executemany(
                """INSERT INTO job_postings (title, company_name, location, jd_text, status)
                   VALUES (?, ?, ?, ?, ?)""",
                sample_jobs,
            )

        conn.commit()
        print("SQLite database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()


def _get_user_by_username(username: str):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE username = ?", (username,))
        return dict_from_row(cur.fetchone())
    finally:
        conn.close()


def get_candidate_by_user_id(user_id: int):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM candidates WHERE user_id = ?", (user_id,))
        row = dict_from_row(cur.fetchone())
        if row and isinstance(row.get("skills"), str):
            try:
                row["skills"] = json.loads(row["skills"])
            except Exception:
                row["skills"] = []
        return row
    finally:
        conn.close()


def save_candidate_profile(user_id, name, email, resume_text=None,
                            original_filename=None, file_path=None, skills=None, **kwargs):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        skills_json = json.dumps(skills or [])
        cur.execute(
            """INSERT OR REPLACE INTO candidates (user_id, name, email, resume_text, skills)
               VALUES (?, ?, ?, ?, ?)""",
            (user_id, name, email, resume_text, skills_json),
        )
        conn.commit()
        cur.execute("SELECT id FROM candidates WHERE user_id = ?", (user_id,))
        return cur.fetchone()[0]
    finally:
        conn.close()


def update_candidate(candidate_id, name=None, email=None, resume_text=None,
                     original_filename=None, file_path=None, skills=None, **kwargs):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        skills_json = json.dumps(skills or [])
        cur.execute(
            """UPDATE candidates SET name = ?, email = ?, resume_text = ?,
               skills = ?, updated_at = datetime('now') WHERE id = ?""",
            (name, email, resume_text, skills_json, candidate_id),
        )
        conn.commit()
    finally:
        conn.close()


def update_candidate_on_apply(candidate_id, candidate_data):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """UPDATE candidates SET name = ?, email = ?, resume_text = ?,
               updated_at = datetime('now') WHERE id = ?""",
            (candidate_data.name, candidate_data.email,
             candidate_data.resume_text, candidate_id),
        )
        conn.commit()
    finally:
        conn.close()


def save_resume_version(candidate_id, label, resume_text, original_filename=None,
                        file_path=None, parsed_data=None):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        parsed_json = json.dumps(parsed_data) if parsed_data else None
        cur.execute(
            """INSERT INTO resume_versions
               (candidate_id, label, resume_text, original_filename, file_path, parsed_data)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (candidate_id, label, resume_text, original_filename, file_path, parsed_json),
        )
        conn.commit()
        return {"id": cur.lastrowid}
    finally:
        conn.close()


def get_job_postings(status="Published"):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT * FROM job_postings WHERE status = ? ORDER BY created_at DESC",
            (status,),
        )
        return rows_to_dicts(cur.fetchall())
    finally:
        conn.close()


def get_job_posting(posting_id):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM job_postings WHERE id = ?", (posting_id,))
        return dict_from_row(cur.fetchone())
    finally:
        conn.close()


def get_existing_application(email, posting_id):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """SELECT a.* FROM applications a
               JOIN candidates c ON a.candidate_id = c.id
               WHERE c.email = ? AND a.job_posting_id = ?""",
            (email, posting_id),
        )
        return dict_from_row(cur.fetchone())
    finally:
        conn.close()


def save_application(candidate_id, job_posting_id, recruiter_id, application_text,
                     resume_version_id, ats_score, ats_result):
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        ats_json = json.dumps(ats_result) if ats_result else None
        cur.execute(
            """INSERT INTO applications
               (candidate_id, job_posting_id, recruiter_id, application_text,
                resume_version_id, ats_score, ats_result)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (candidate_id, job_posting_id, recruiter_id, application_text,
             resume_version_id, ats_score, ats_json),
        )
        conn.commit()
        return cur.lastrowid
    finally:
        conn.close()


def get_all_applications_for_recruiter():
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """SELECT a.id, a.status, a.ats_score, a.applied_at,
                      c.name as candidate_name, c.email as candidate_email,
                      j.title as job_title, j.company_name
               FROM applications a
               JOIN candidates c ON a.candidate_id = c.id
               JOIN job_postings j ON a.job_posting_id = j.id
               ORDER BY a.applied_at DESC"""
        )
        return rows_to_dicts(cur.fetchall())
    finally:
        conn.close()


def get_applications_stats():
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) as total FROM applications")
        total = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) as total FROM job_postings WHERE status='Published'")
        jobs = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) as total FROM candidates")
        candidates = cur.fetchone()[0]
        cur.execute("SELECT AVG(ats_score) as avg FROM applications WHERE ats_score IS NOT NULL")
        avg_score = cur.fetchone()[0] or 0
        return {
            "total_applications": total,
            "active_jobs": jobs,
            "total_candidates": candidates,
            "avg_ats_score": round(float(avg_score), 1),
        }
    finally:
        conn.close()
