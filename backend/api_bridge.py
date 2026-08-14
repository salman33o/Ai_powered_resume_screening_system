"""
FastAPI REST API Bridge — Advanced ATS & Resume Screening Platform
Supports Candidate & Recruiter Workflows, JWT Auth, Role Access Control, Bulk Screening, & AI Features.
"""
import sys
import os
from pathlib import Path

# Add directory to sys.path to resolve internal modules cleanly
_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Header, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List, Any
from sqlalchemy.orm import Session
import json

import database as db
import auth
import ai_engine as ai
from models import User, CandidateProfile, RecruiterProfile, JobPosting, Application, ResumeVersion, UserRole, ApplicationStatus
import worker

app = FastAPI(
    title="Advanced ATS & Resume Screening Platform API",
    version="4.0",
    description="Production-ready REST APIs for Candidate Resume Optimization and Recruiter ATS Bulk Screening.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("[INIT] Initializing database and tables...")
    db.init_db()
    print("[OK] Database ready.")

# ── JWT Dependency ───────────────────────────────────────────────────────────
def get_current_user(authorization: Optional[str] = Header(None), dbs: Session = Depends(db.get_db)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header.")
    token = authorization.split(" ")[1]
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token expired or invalid.")
    user = dbs.query(User).filter(User.username == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")
    return user

# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Advanced ATS Platform API v4.0 is active"}

# ── Authentication ────────────────────────────────────────────────────────────
class RegisterSchema(BaseModel):
    username: str
    email: str
    password: str
    role: str = "Candidate" # Candidate or Recruiter

class LoginSchema(BaseModel):
    username: str
    password: str

@app.post("/api/auth/register")
async def register(req: RegisterSchema, dbs: Session = Depends(db.get_db)):
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    existing = dbs.query(User).filter((User.username == req.username) | (User.email == req.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or Email already registered.")
    
    user = auth.create_user(dbs, req.username, req.password, req.email, req.role)
    token = auth.create_access_token({"sub": user.username, "role": user.role, "user_id": user.id})
    return {
        "message": "User registered successfully",
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "role": user.role, "email": user.email}
    }

@app.post("/api/auth/login")
async def login(req: LoginSchema, dbs: Session = Depends(db.get_db)):
    user = auth.authenticate_user(dbs, req.username, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    token = auth.create_access_token({"sub": user.username, "role": user.role, "user_id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "role": user.role, "email": user.email}
    }

# ── Candidate Features ───────────────────────────────────────────────────────
@app.post("/api/candidate/analyze-resume")
async def analyze_candidate_resume(
    file: UploadFile = File(...),
    jd_text: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    content = await file.read()
    parsed = ai.parse_resume(content, file.filename)
    ats_result = ai.calculate_hybrid_ats_score(parsed["raw_text"], jd_text)
    explanation = ai.generate_ats_explanation(ats_result, "Target Role")
    optimizer_tips = ai.generate_resume_optimizer_tips(parsed["raw_text"], jd_text)

    return {
        "filename": file.filename,
        "candidate": {
            "name": parsed["name"],
            "email": parsed["email"],
            "extracted_skills": parsed["skills"]
        },
        "ats_score": ats_result["overall_score"],
        "confidence_score": ats_result["confidence_score"],
        "components": ats_result["components"],
        "matched_skills": ats_result["matched_skills"],
        "missing_skills": ats_result["missing_skills"],
        "ai_explanation": explanation,
        "optimizer_suggestions": optimizer_tips
    }

@app.post("/api/candidate/analyze-resume-text")
async def analyze_candidate_resume_text(
    resume_text: str = Form(...),
    jd_text: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    extracted_skills = ai.extract_skills_from_text(resume_text)
    ats_result = ai.calculate_hybrid_ats_score(resume_text, jd_text)
    explanation = ai.generate_ats_explanation(ats_result, "Target Role")
    optimizer_tips = ai.generate_resume_optimizer_tips(resume_text, jd_text)

    return {
        "filename": "Pasted Resume Text",
        "candidate": {
            "name": current_user.username,
            "email": current_user.email,
            "extracted_skills": extracted_skills
        },
        "ats_score": ats_result["overall_score"],
        "confidence_score": ats_result["confidence_score"],
        "components": ats_result["components"],
        "matched_skills": ats_result["matched_skills"],
        "missing_skills": ats_result["missing_skills"],
        "ai_explanation": explanation,
        "optimizer_suggestions": optimizer_tips
    }

@app.post("/api/candidate/skill-gap")
async def analyze_skill_gap(
    resume_text: str = Form(...),
    jd_text: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    candidate_skills = set(ai.extract_skills_from_text(resume_text))
    jd_skills = set(ai.extract_skills_from_text(jd_text))

    matched = sorted(list(candidate_skills & jd_skills))
    missing = sorted(list(jd_skills - candidate_skills))
    coverage = round((len(matched) / len(jd_skills) * 100), 1) if jd_skills else 100.0

    recommendations = []
    for skill in missing[:5]:
        recommendations.append(f"Learn & add hands-on projects for '{skill.title()}'")
    if not recommendations:
        recommendations.append("Your skills closely match all core requirements for this job role!")

    return {
        "candidate_skills": sorted(list(candidate_skills)),
        "jd_skills": sorted(list(jd_skills)),
        "matched_skills": matched,
        "missing_skills": missing,
        "skill_coverage_percent": coverage,
        "recommendations": recommendations
    }

@app.post("/api/candidate/interview-questions")
async def get_interview_questions(
    resume_text: str = Form(...),
    jd_text: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    questions = ai.generate_interview_questions(resume_text, jd_text)
    return {"questions": questions}

# ── Recruiter Workflows ───────────────────────────────────────────────────────
class CreateJobSchema(BaseModel):
    title: str
    company_name: str
    location: Optional[str] = "Remote"
    jd_text: str
    weight_skills: Optional[float] = 0.30
    weight_experience: Optional[float] = 0.25
    weight_responsibilities: Optional[float] = 0.20
    weight_projects: Optional[float] = 0.10
    weight_education: Optional[float] = 0.05

@app.get("/api/jobs")
async def list_jobs(dbs: Session = Depends(db.get_db)):
    jobs = dbs.query(JobPosting).filter(JobPosting.status == "Published").order_by(JobPosting.created_at.desc()).all()
    return [{
        "id": j.id,
        "title": j.title,
        "company_name": j.company_name,
        "location": j.location,
        "jd_text": j.jd_text,
        "jd_snippet": j.jd_text[:150] + ("..." if len(j.jd_text) > 150 else ""),
        "created_at": j.created_at.isoformat() if j.created_at else None
    } for j in jobs]

@app.post("/api/recruiter/jobs")
async def create_job(req: CreateJobSchema, current_user: User = Depends(get_current_user), dbs: Session = Depends(db.get_db)):
    if current_user.role != UserRole.RECRUITER.value:
        raise HTTPException(status_code=403, detail="Only recruiters can create job postings.")
    
    recruiter = dbs.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not recruiter:
        recruiter = RecruiterProfile(user_id=current_user.id, company_name=req.company_name)
        dbs.add(recruiter)
        dbs.commit()
        dbs.refresh(recruiter)

    job = JobPosting(
        recruiter_id=recruiter.id,
        title=req.title,
        company_name=req.company_name,
        location=req.location,
        jd_text=req.jd_text,
        weight_skills=req.weight_skills,
        weight_experience=req.weight_experience,
        weight_responsibilities=req.weight_responsibilities,
        weight_projects=req.weight_projects,
        weight_education=req.weight_education
    )
    dbs.add(job)
    dbs.commit()
    dbs.refresh(job)
    return {"message": "Job posting created successfully", "job_id": job.id}

@app.post("/api/recruiter/bulk-screen/{job_id}")
async def bulk_screen_resumes(
    job_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    dbs: Session = Depends(db.get_db)
):
    if current_user.role != UserRole.RECRUITER.value:
        raise HTTPException(status_code=403, detail="Recruiter access required.")

    files_data = []
    for f in files:
        content = await f.read()
        files_data.append({"filename": f.filename, "content": content})

    result = await worker.process_bulk_resume_screening(job_id, files_data, dbs)
    return result

@app.get("/api/recruiter/candidate-ranking/{job_id}")
async def get_candidate_ranking(job_id: int, dbs: Session = Depends(db.get_db)):
    applications = dbs.query(Application).filter(Application.job_id == job_id).order_by(Application.ats_score.desc()).all()
    rankings = []
    for app in applications:
        rankings.append({
            "application_id": app.id,
            "candidate_id": app.candidate_id,
            "ats_score": app.ats_score,
            "status": app.status,
            "applied_at": app.applied_at
        })
    return {"job_id": job_id, "rankings": rankings}
