import os
import sys
from pathlib import Path

_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from models import Base, JobPosting, User, UserRole

# Database connection URL setup
# Supports PostgreSQL (production) or SQLite (local/fallback)
DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if not DATABASE_URL:
    DATABASE_PATH = os.environ.get("DATABASE_PATH", "./resume_analyzer.db")
    DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# Configure engine parameters according to DB dialect
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI Dependency for database session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Creates database tables and seeds initial sample data if empty."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if sample jobs exist
        job_count = db.query(JobPosting).count()
        if job_count == 0:
            # Seed default jobs
            sample_jobs = [
                JobPosting(
                    recruiter_id=1,
                    title="Senior Python Developer",
                    company_name="TechCorp Solutions",
                    location="Remote / Bangalore",
                    jd_text="""We are looking for a Senior Python Developer to join our growing engineering team.

Requirements:
- 5+ years of Python development experience
- Strong knowledge of FastAPI, Django or Flask
- Experience with PostgreSQL, Redis, and message queues
- Proficiency in Docker and Kubernetes
- Experience with AWS or GCP cloud services
- Strong understanding of REST APIs and microservices

Nice to have:
- Experience with machine learning frameworks (TensorFlow, PyTorch)
- Knowledge of agile/scrum methodologies""",
                    status="Published"
                ),
                JobPosting(
                    recruiter_id=1,
                    title="Flutter Mobile Engineer",
                    company_name="AppVentures",
                    location="Hybrid / Chennai",
                    jd_text="""Looking for a skilled Flutter Mobile Engineer to build our next-gen Android app.

Requirements:
- 3+ years Flutter & Dart experience
- Experience with Clean Architecture and Riverpod/Provider
- REST API integration & JWT authentication
- Android release engineering and Play Store deployment experience
- Knowledge of Material Design 3""",
                    status="Published"
                )
            ]
            db.add_all(sample_jobs)
            db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
