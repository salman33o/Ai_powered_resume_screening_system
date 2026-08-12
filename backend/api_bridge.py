from fastapi import FastAPI, HTTPException, UploadFile, File, Form, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from datetime import datetime

import auth
import database as db
import ai_engine as ai

app = FastAPI(
    title="Resume Analyzer API",
    version="3.0",
    description="AI-powered Resume Analysis, Job Matching, and Hiring Management.",
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
    print("Initializing database tables...")
    auth.init_db()
    db.init_db()
    print("Database initialization complete.")


api_router = APIRouter()


@api_router.get("/health")
async def health_check():
    return {"status": "ok", "message": "Resume Analyzer API v3.0 is running"}


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    password: str
    email: str
    role: str


@api_router.post("/auth/login")
async def login(req: LoginRequest):
    try:
        user_data = auth.authenticate_user(req.username, req.password)
        if not user_data:
            raise HTTPException(status_code=401, detail="Incorrect username or password")

        if auth.is_2fa_enabled(user_data["id"]):
            return {"requires_2fa": True, "user_id": user_data["id"]}

        session_token = auth.create_session(user_data["id"])
        return {"requires_2fa": False, "session_token": session_token, "user": user_data}

    except auth.AccountLockedError as e:
        raise HTTPException(status_code=423, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during login.")


@api_router.post("/auth/register")
async def register(req: RegisterRequest):
    if len(req.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")

    existing_user = auth._get_user_by_username(req.username)
    if existing_user:
        raise HTTPException(status_code=409, detail="Username already exists.")

    user = auth.create_user(req.username, req.password, req.email, req.role)
    if not user:
        raise HTTPException(status_code=500, detail="Failed to create user.")

    return {"message": "User registered successfully", "user_id": user["id"]}


# ── Candidate data model ──────────────────────────────────────────────────────

class CandidateData(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    location: Optional[str] = None
    resume_text: Optional[str] = None
    skills: Optional[List[str]] = []
    education: Optional[List[Dict[str, Any]]] = []
    experience: Optional[List[Dict[str, Any]]] = []


# ── Resume upload ─────────────────────────────────────────────────────────────

@api_router.post("/candidate/resume/upload")
async def upload_resume(user_id: int = Form(...), file: UploadFile = File(...)):
    file_bytes = await file.read()

    try:
        parsed_data = ai.parse_resume(file_bytes, file.filename or "resume.dat")
    except Exception as e:
        print(f"Error parsing resume: {e}")
        raise HTTPException(status_code=500, detail="Could not parse resume file.")

    original_filename = file.filename or "resume.dat"
    resume_file_path = f"/storage/resumes/{user_id}/{original_filename}"

    candidate_email = parsed_data.get("email")
    candidate_name = parsed_data.get("name")

    if not candidate_email or candidate_email == "N/A":
        candidate_email = f"user_{user_id}@placeholder.com"
    if not candidate_name or candidate_name == "N/A":
        candidate_name = f"User {user_id}"

    existing_candidate = db.get_candidate_by_user_id(user_id)

    if existing_candidate:
        candidate_id = existing_candidate["id"]
        db.update_candidate(
            candidate_id=candidate_id,
            name=candidate_name,
            email=candidate_email,
            resume_text=parsed_data.get("resume_text"),
            original_filename=original_filename,
            file_path=resume_file_path,
            skills=parsed_data.get("skills", []),
        )
    else:
        candidate_id = db.save_candidate_profile(
            user_id=user_id,
            name=candidate_name,
            email=candidate_email,
            resume_text=parsed_data.get("resume_text"),
            original_filename=original_filename,
            file_path=resume_file_path,
            skills=parsed_data.get("skills", []),
        )

    try:
        db.save_resume_version(
            candidate_id=candidate_id,
            label=f"{original_filename} — {datetime.now().strftime('%Y-%m-%d')}",
            resume_text=parsed_data.get("resume_text", ""),
            original_filename=original_filename,
            file_path=resume_file_path,
            parsed_data=parsed_data,
        )
    except Exception as e:
        print(f"Failed to save resume version: {e}")

    return {
        "message": "Resume uploaded and processed successfully",
        "candidate_id": candidate_id,
        "user_id": user_id,
        "parsed_data": parsed_data,
        "resume_file_path": resume_file_path,
    }


# ── Jobs ──────────────────────────────────────────────────────────────────────

@api_router.get("/jobs")
async def get_job_postings(status: str = "Published"):
    return db.get_job_postings(status=status)


@api_router.get("/jobs/{posting_id}")
async def get_job_posting(posting_id: int):
    posting = db.get_job_posting(posting_id)
    if not posting:
        raise HTTPException(status_code=404, detail="Job posting not found")
    return posting


class JobScoreRequest(BaseModel):
    candidate_data: CandidateData


@api_router.post("/jobs/{posting_id}/score")
async def score_against_job(posting_id: int, req: JobScoreRequest):
    posting = db.get_job_posting(posting_id)
    if not posting:
        raise HTTPException(status_code=404, detail="Job posting not found")

    if not req.candidate_data.resume_text:
        raise HTTPException(status_code=400, detail="Candidate resume text is missing for scoring.")

    skill_report = ai.analyze_skills(req.candidate_data.model_dump(), posting.get("jd_text", ""))

    weights = {
        "semantic": float(posting.get("semantic_weight", 0.4)),
        "skill": float(posting.get("skill_weight", 0.3)),
        "experience": float(posting.get("experience_weight", 0.2)),
        "education": float(posting.get("education_weight", 0.1)),
    }

    ats_result = ai.calculate_ats_score(
        candidate_data=req.candidate_data.model_dump(),
        jd_text=posting.get("jd_text", ""),
        skill_report=skill_report,
        weights=weights,
    )

    already_applied = (
        db.get_existing_application(req.candidate_data.email, posting_id) is not None
    )

    return {
        "posting": posting,
        "skill_report": skill_report,
        "ats_result": ats_result,
        "already_applied": already_applied,
    }


class ApplyRequest(BaseModel):
    user_id: int
    candidate_data: CandidateData
    skill_report: Dict[str, Any]
    ats_result: Dict[str, Any]
    original_resume_filename: Optional[str] = None
    resume_file_path: Optional[str] = None


@api_router.post("/jobs/{posting_id}/apply")
async def apply_to_job(posting_id: int, req: ApplyRequest):
    posting = db.get_job_posting(posting_id)
    if not posting:
        raise HTTPException(status_code=404, detail="Job posting not found")

    existing_app = db.get_existing_application(req.candidate_data.email, posting_id)
    if existing_app:
        raise HTTPException(status_code=409, detail="You have already applied for this position.")

    existing_candidate = db.get_candidate_by_user_id(req.user_id)
    if existing_candidate:
        candidate_id = existing_candidate["id"]
        db.update_candidate_on_apply(candidate_id=candidate_id, candidate_data=req.candidate_data)
    else:
        candidate_id = db.save_candidate_profile(
            user_id=req.user_id,
            name=req.candidate_data.name,
            email=req.candidate_data.email,
            resume_text=req.candidate_data.resume_text,
        )

    resume_version_id = None
    if req.resume_file_path and req.original_resume_filename:
        try:
            res_version_info = db.save_resume_version(
                candidate_id=candidate_id,
                label=f"Application for {posting['title']} — {req.original_resume_filename}",
                resume_text=req.candidate_data.resume_text,
                original_filename=req.original_resume_filename,
                file_path=req.resume_file_path,
                parsed_data=None,
            )
            resume_version_id = res_version_info["id"]
        except Exception as e:
            print(f"Warning: Failed to save resume version for application: {e}")

    application_id = db.save_application(
        candidate_id=candidate_id,
        job_posting_id=posting_id,
        recruiter_id=posting.get("created_by"),
        application_text=req.candidate_data.resume_text,
        resume_version_id=resume_version_id,
        ats_score=req.ats_result.get("Total Score"),
        ats_result=req.ats_result,
    )

    return {
        "status": "applied",
        "application_id": application_id,
        "score": req.ats_result.get("Total Score"),
        "verdict": req.ats_result.get("Verdict"),
    }


# ── AI generation endpoints ───────────────────────────────────────────────────

@api_router.post("/ai/generate/summary")
async def generate_ai_summary(resume_text: str = Form(...)):
    summary = ai.generate_summary(resume_text)
    return {"summary": summary}


@api_router.post("/ai/generate/cover-letter")
async def generate_ai_cover_letter(
    candidate_data_json: str = Form(...),
    job_posting_id: int = Form(...),
):
    import json
    posting = db.get_job_posting(job_posting_id)
    if not posting:
        raise HTTPException(status_code=404, detail="Job posting not found.")
    try:
        candidate_data = json.loads(candidate_data_json)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid candidate_data JSON.")
    cover_letter = ai.generate_cover_letter(candidate_data, posting)
    return {"cover_letter": cover_letter}


class SuggestionsRequest(BaseModel):
    resume_text: str
    preferred_role: str


@api_router.post("/ai/generate/suggestions")
async def generate_ai_suggestions(req: SuggestionsRequest):
    suggestions = ai.generate_suggestions(req.resume_text, req.preferred_role)
    return suggestions


class InterviewQuestionsRequest(BaseModel):
    candidate_data: CandidateData
    job_posting_id: int
    num_questions: int = 5


@api_router.post("/ai/generate/interview-questions")
async def generate_ai_interview_questions(req: InterviewQuestionsRequest):
    posting = db.get_job_posting(req.job_posting_id)
    if not posting:
        raise HTTPException(status_code=404, detail="Job posting not found.")
    questions = ai.generate_interview_questions(
        req.candidate_data.model_dump(), posting, req.num_questions
    )
    return {"questions": questions}


@api_router.get("/candidate/profile/{user_id}")
async def get_candidate_profile(user_id: int):
    profile = db.get_candidate_by_user_id(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")
    return profile


# ── Recruiter ─────────────────────────────────────────────────────────────────

recruiter_router = APIRouter(prefix="/recruiter")


class MatchmakerRequest(BaseModel):
    query: str


@recruiter_router.post("/matchmaker")
async def query_matchmaker(req: MatchmakerRequest):
    candidates = db.get_all_candidates()
    results = ai.ai_matchmaker_query(req.query, candidates)
    return {"results": results}


@recruiter_router.get("/dashboard/analytics")
async def get_recruiter_analytics():
    stats = db.get_applications_stats()
    applications = db.get_all_applications_for_recruiter()
    return {"stats": stats, "applications": applications}


app.include_router(api_router)
app.include_router(recruiter_router)
