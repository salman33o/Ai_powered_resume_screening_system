"""
SQLAlchemy ORM Database Models for Advanced ATS & Resume Screening Platform
Supports PostgreSQL and SQLite.
"""
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Table, Enum
)
from sqlalchemy.orm import relationship, declarative_base
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    CANDIDATE = "Candidate"
    RECRUITER = "Recruiter"
    ADMIN = "Admin"

class ApplicationStatus(str, enum.Enum):
    APPLIED = "Applied"
    SCREENING = "Screening"
    SHORTLISTED = "Shortlisted"
    INTERVIEW = "Interview"
    SELECTED = "Selected"
    REJECTED = "Rejected"
    ON_HOLD = "On Hold"

class JobStatus(str, enum.Enum):
    DRAFT = "Draft"
    PUBLISHED = "Published"
    UNPUBLISHED = "Unpublished"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default=UserRole.CANDIDATE.value, nullable=False)
    is_2fa_enabled = Column(Boolean, default=False)
    account_locked_until = Column(DateTime, nullable=True)
    failed_login_attempts = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False)
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False)

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="candidate_profile")
    resumes = relationship("ResumeVersion", back_populates="candidate", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")

class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    company_name = Column(String, nullable=False)
    company_website = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="recruiter_profile")
    jobs = relationship("JobPosting", back_populates="recruiter", cascade="all, delete-orphan")

class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False)
    version_label = Column(String, default="v1 - General", nullable=False)
    file_path = Column(String, nullable=True)
    original_filename = Column(String, nullable=True)
    raw_text = Column(Text, nullable=False)
    parsed_json = Column(Text, nullable=True) # Serialized JSON string of extracted structured data
    extraction_confidence = Column(Float, default=1.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    candidate = relationship("CandidateProfile", back_populates="resumes")
    applications = relationship("Application", back_populates="resume_version")

class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    location = Column(String, nullable=True)
    jd_text = Column(Text, nullable=False)
    parsed_requirements = Column(Text, nullable=True) # JSON string of parsed skills, exp, responsibilities
    status = Column(String, default=JobStatus.PUBLISHED.value)
    
    # Custom Weightings for Recruiter Screening
    weight_skills = Column(Float, default=0.30)
    weight_experience = Column(Float, default=0.25)
    weight_responsibilities = Column(Float, default=0.20)
    weight_projects = Column(Float, default=0.10)
    weight_education = Column(Float, default=0.05)
    weight_keywords = Column(Float, default=0.05)
    weight_certifications = Column(Float, default=0.05)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    recruiter = relationship("RecruiterProfile", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_postings.id", ondelete="CASCADE"), nullable=False)
    resume_version_id = Column(Integer, ForeignKey("resume_versions.id"), nullable=True)
    
    status = Column(String, default=ApplicationStatus.APPLIED.value)
    ats_score = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=True)
    ats_breakdown_json = Column(Text, nullable=True) # Detailed component score breakdown JSON
    recruiter_notes = Column(Text, nullable=True)
    tags = Column(String, nullable=True) # Comma-separated tags
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    candidate = relationship("CandidateProfile", back_populates="applications")
    job = relationship("JobPosting", back_populates="applications")
    resume_version = relationship("ResumeVersion", back_populates="applications")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
