"""
ATS Enterprise Database Management Layer
SQLite schema & CRUD operations mirroring TypeScript data models in src/types.ts
"""

import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "resume_analyzer.db")


def get_db_connection(db_path: str = DB_PATH) -> sqlite3.Connection:
    """Creates a thread-safe connection to the SQLite database with Row factory."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db(db_path: str = DB_PATH) -> None:
    """Initializes the database tables for jobs, resumes, applications, messages, and audit logs."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    cursor.executescript("""
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('candidate', 'recruiter', 'admin')),
        company_name TEXT,
        avatar_url TEXT,
        created_at TEXT NOT NULL
    );

    -- Jobs table
    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        department TEXT,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        seniority TEXT NOT NULL,
        min_experience_years INTEGER NOT NULL DEFAULT 0,
        salary_range TEXT,
        summary TEXT NOT NULL,
        required_skills TEXT NOT NULL,      -- JSON Array
        preferred_skills TEXT NOT NULL,     -- JSON Array
        responsibilities TEXT NOT NULL,     -- JSON Array
        education_requirement TEXT,
        required_certifications TEXT,       -- JSON Array
        keywords TEXT NOT NULL,             -- JSON Array
        scoring_weights TEXT,               -- JSON Object
        published INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        applications_count INTEGER NOT NULL DEFAULT 0
    );

    -- Resumes table
    CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        version_name TEXT NOT NULL DEFAULT 'Primary Resume',
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        location TEXT NOT NULL,
        linkedin TEXT,
        github TEXT,
        portfolio TEXT,
        summary TEXT NOT NULL,
        skills TEXT NOT NULL,               -- JSON Object: {technical: [], soft: [], tools: []}
        experience TEXT NOT NULL,           -- JSON Array of WorkExperience
        education TEXT NOT NULL,            -- JSON Array of EducationItem
        projects TEXT NOT NULL,             -- JSON Array of ProjectItem
        certifications TEXT NOT NULL,       -- JSON Array of CertificationItem
        raw_text TEXT,
        extraction_quality TEXT NOT NULL DEFAULT 'high',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Candidate Applications Pipeline table
    CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        candidate_id TEXT NOT NULL,
        job_id TEXT NOT NULL,
        stage TEXT NOT NULL DEFAULT 'applied' CHECK (stage IN ('applied', 'screening', 'shortlisted', 'interview', 'selected', 'rejected', 'on_hold')),
        applied_date TEXT NOT NULL,
        ats_score REAL,
        confidence_score REAL,
        ats_breakdown TEXT,                 -- JSON Object of ATSScoreBreakdown
        recruiter_notes TEXT,               -- JSON Array of strings/note objects
        tags TEXT,                          -- JSON Array of strings
        recruiter_rating REAL,
        interview_scheduled_date TEXT,
        interview_notes TEXT,
        feedback TEXT,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );

    -- Direct Messages table
    CREATE TABLE IF NOT EXISTS direct_messages (
        id TEXT PRIMARY KEY,
        thread_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        sender_role TEXT NOT NULL,
        recipient_id TEXT NOT NULL,
        recipient_name TEXT NOT NULL,
        recipient_role TEXT NOT NULL,
        job_id TEXT NOT NULL,
        job_title TEXT NOT NULL,
        company_name TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        is_read INTEGER NOT NULL DEFAULT 0,
        candidate_ats_score REAL,
        tags TEXT                           -- JSON Array
    );

    -- ATS Audit Log Ledger
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        candidate_name TEXT NOT NULL,
        job_title TEXT NOT NULL,
        overall_score REAL NOT NULL,
        confidence_score REAL NOT NULL,
        breakdown TEXT NOT NULL,            -- JSON Object: {skills, experience, responsibilities, projects, education}
        model_version TEXT NOT NULL,
        scoring_version TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        extraction_quality TEXT NOT NULL,
        reviewer_decision TEXT,
        reviewer_notes TEXT
    );
    """)

    conn.commit()
    conn.close()
    print(f"[Database] SQLite schema initialized at: {db_path}")


# ============================================================================
# Job Repository Functions
# ============================================================================

def create_job(job: Dict[str, Any], db_path: str = DB_PATH) -> str:
    """Inserts a new job opening."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO jobs (
        id, title, company, department, location, type, seniority,
        min_experience_years, salary_range, summary, required_skills,
        preferred_skills, responsibilities, education_requirement,
        required_certifications, keywords, scoring_weights, published,
        created_at, applications_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        job["id"],
        job["title"],
        job["company"],
        job.get("department", "Engineering"),
        job["location"],
        job.get("type", "Full-time"),
        job.get("seniority", "Mid"),
        job.get("minExperienceYears", 0),
        job.get("salaryRange", "$120,000 - $160,000"),
        job["summary"],
        json.dumps(job.get("requiredSkills", [])),
        json.dumps(job.get("preferredSkills", [])),
        json.dumps(job.get("responsibilities", [])),
        job.get("educationRequirement", "Bachelor's Degree"),
        json.dumps(job.get("requiredCertifications", [])),
        json.dumps(job.get("keywords", [])),
        json.dumps(job.get("scoringWeights", {})),
        1 if job.get("published", True) else 0,
        job.get("createdAt", datetime.utcnow().isoformat()),
        job.get("applicationsCount", 0)
    ))

    conn.commit()
    conn.close()
    return job["id"]


def get_all_jobs(db_path: str = DB_PATH) -> List[Dict[str, Any]]:
    """Retrieves all published jobs."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "title": r["title"],
            "company": r["company"],
            "department": r["department"],
            "location": r["location"],
            "type": r["type"],
            "seniority": r["seniority"],
            "minExperienceYears": r["min_experience_years"],
            "salaryRange": r["salary_range"],
            "summary": r["summary"],
            "requiredSkills": json.loads(r["required_skills"]),
            "preferredSkills": json.loads(r["preferred_skills"]),
            "responsibilities": json.loads(r["responsibilities"]),
            "educationRequirement": r["education_requirement"],
            "requiredCertifications": json.loads(r["required_certifications"] or "[]"),
            "keywords": json.loads(r["keywords"]),
            "scoringWeights": json.loads(r["scoring_weights"] or "{}"),
            "published": bool(r["published"]),
            "createdAt": r["created_at"],
            "applicationsCount": r["applications_count"]
        })
    return result


# ============================================================================
# Resume & Application Repository Functions
# ============================================================================

def save_resume(resume: Dict[str, Any], db_path: str = DB_PATH) -> str:
    """Inserts or updates a structured resume record."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO resumes (
        id, user_id, version_name, full_name, email, phone, location,
        linkedin, github, portfolio, summary, skills, experience,
        education, projects, certifications, raw_text, extraction_quality,
        created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        version_name = excluded.version_name,
        full_name = excluded.full_name,
        email = excluded.email,
        phone = excluded.phone,
        location = excluded.location,
        summary = excluded.summary,
        skills = excluded.skills,
        experience = excluded.experience,
        education = excluded.education,
        projects = excluded.projects,
        certifications = excluded.certifications,
        updated_at = excluded.updated_at
    """, (
        resume["id"],
        resume.get("userId"),
        resume.get("versionName", "Primary Resume"),
        resume["fullName"],
        resume["email"],
        resume.get("phone", ""),
        resume.get("location", ""),
        resume.get("linkedin", ""),
        resume.get("github", ""),
        resume.get("portfolio", ""),
        resume.get("summary", ""),
        json.dumps(resume.get("skills", {"technical": [], "soft": [], "tools": []})),
        json.dumps(resume.get("experience", [])),
        json.dumps(resume.get("education", [])),
        json.dumps(resume.get("projects", [])),
        json.dumps(resume.get("certifications", [])),
        resume.get("rawText", ""),
        resume.get("extractionQuality", "high"),
        resume.get("createdAt", datetime.utcnow().isoformat()),
        datetime.utcnow().isoformat()
    ))

    conn.commit()
    conn.close()
    return resume["id"]


def save_candidate_application(app: Dict[str, Any], db_path: str = DB_PATH) -> str:
    """Saves or updates a candidate application and ATS score."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO applications (
        id, candidate_id, job_id, stage, applied_date, ats_score,
        confidence_score, ats_breakdown, recruiter_notes, tags,
        recruiter_rating, interview_scheduled_date, interview_notes, feedback
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
        stage = excluded.stage,
        ats_score = excluded.ats_score,
        confidence_score = excluded.confidence_score,
        ats_breakdown = excluded.ats_breakdown,
        recruiter_notes = excluded.recruiter_notes,
        tags = excluded.tags,
        interview_scheduled_date = excluded.interview_scheduled_date
    """, (
        app["id"],
        app["candidateId"],
        app["jobId"],
        app.get("stage", "applied"),
        app.get("appliedDate", datetime.utcnow().isoformat()),
        app.get("atsScore", {}).get("overallScore") if isinstance(app.get("atsScore"), dict) else app.get("atsScore"),
        app.get("atsScore", {}).get("confidenceScore") if isinstance(app.get("atsScore"), dict) else None,
        json.dumps(app.get("atsScore", {}) if isinstance(app.get("atsScore"), dict) else app.get("atsAnalysis", {})),
        json.dumps(app.get("recruiterNotes", [])),
        json.dumps(app.get("tags", [])),
        app.get("recruiterRating"),
        app.get("interviewScheduledDate"),
        app.get("interviewNotes"),
        app.get("feedback")
    ))

    conn.commit()
    conn.close()
    return app["id"]


# ============================================================================
# Messaging Ledger Functions
# ============================================================================

def record_direct_message(msg: Dict[str, Any], db_path: str = DB_PATH) -> str:
    """Logs a direct message between candidate and recruiter."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    msg_id = msg.get("id", f"msg-{int(datetime.utcnow().timestamp() * 1000)}")
    cursor.execute("""
    INSERT INTO direct_messages (
        id, thread_id, sender_id, sender_name, sender_role,
        recipient_id, recipient_name, recipient_role, job_id,
        job_title, company_name, content, timestamp, is_read,
        candidate_ats_score, tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        msg_id,
        msg["threadId"],
        msg["senderId"],
        msg["senderName"],
        msg["senderRole"],
        msg["recipientId"],
        msg["recipientName"],
        msg["recipientRole"],
        msg["jobId"],
        msg["jobTitle"],
        msg["companyName"],
        msg["content"],
        msg.get("timestamp", datetime.utcnow().isoformat()),
        1 if msg.get("isRead", False) else 0,
        msg.get("candidateAtsScore"),
        json.dumps(msg.get("tags", []))
    ))

    conn.commit()
    conn.close()
    return msg_id


def get_thread_messages(thread_id: str, db_path: str = DB_PATH) -> List[Dict[str, Any]]:
    """Fetches all messages in a specific thread."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM direct_messages WHERE thread_id = ? ORDER BY timestamp ASC", (thread_id,))
    rows = cursor.fetchall()
    conn.close()

    return [{
        "id": r["id"],
        "threadId": r["thread_id"],
        "senderId": r["sender_id"],
        "senderName": r["sender_name"],
        "senderRole": r["sender_role"],
        "recipientId": r["recipient_id"],
        "recipientName": r["recipient_name"],
        "recipientRole": r["recipient_role"],
        "jobId": r["job_id"],
        "jobTitle": r["job_title"],
        "companyName": r["company_name"],
        "content": r["content"],
        "timestamp": r["timestamp"],
        "isRead": bool(r["is_read"]),
        "candidateAtsScore": r["candidate_ats_score"],
        "tags": json.loads(r["tags"] or "[]")
    } for r in rows]


# ============================================================================
# Audit Log Repository
# ============================================================================

def log_audit_record(audit: Dict[str, Any], db_path: str = DB_PATH) -> str:
    """Records an ATS evaluation audit log for compliance and explainability."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    log_id = audit.get("id", f"audit-{int(datetime.utcnow().timestamp() * 1000)}")
    cursor.execute("""
    INSERT INTO audit_logs (
        id, candidate_name, job_title, overall_score, confidence_score,
        breakdown, model_version, scoring_version, timestamp,
        extraction_quality, reviewer_decision, reviewer_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        log_id,
        audit["candidateName"],
        audit["jobTitle"],
        audit["overallScore"],
        audit["confidenceScore"],
        json.dumps(audit.get("breakdown", {})),
        audit.get("modelVersion", "gemini-3.7-flash"),
        audit.get("scoringVersion", "ATS-Hybrid-v2.6"),
        audit.get("timestamp", datetime.utcnow().isoformat()),
        audit.get("extractionQuality", "high"),
        audit.get("reviewerDecision"),
        audit.get("reviewerNotes")
    ))

    conn.commit()
    conn.close()
    return log_id


if __name__ == "__main__":
    init_db()
    print("[Database] Schema check and initialization completed successfully.")
