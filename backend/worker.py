"""
Async Worker Queue for Bulk Resume Screening (Handles up to 400 resumes without blocking FastAPI)
"""
import sys
import os
from pathlib import Path

_backend_dir = Path(__file__).resolve().parent
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

import asyncio
import json
from typing import List, Dict, Any
from sqlalchemy.orm import Session
import database as db
import ai_engine as ai
from models import Application, ResumeVersion, JobPosting, ApplicationStatus

class BulkProcessingTask:
    def __init__(self, job_id: int, candidate_resumes: List[Dict[str, Any]]):
        self.job_id = job_id
        self.candidate_resumes = candidate_resumes
        self.total = len(candidate_resumes)
        self.completed = 0
        self.failed = 0
        self.status = "In Progress"
        self.results = []

async def process_bulk_resume_screening(job_id: int, files_data: List[Dict[str, Any]], db_session: Session) -> Dict[str, Any]:
    job = db_session.query(JobPosting).filter(JobPosting.id == job_id).first()
    if not job:
        return {"error": "Job posting not found", "completed": 0, "failed": len(files_data)}

    custom_weights = {
        "skills": job.weight_skills,
        "experience": job.weight_experience,
        "responsibilities": job.weight_responsibilities,
        "projects": job.weight_projects,
        "education": job.weight_education,
        "keywords": job.weight_keywords,
        "certifications": job.weight_certifications,
    }

    completed_count = 0
    failed_count = 0
    processed_results = []

    for file_info in files_data:
        try:
            filename = file_info.get("filename", "resume.pdf")
            content = file_info.get("content", b"")

            # Parse & extract
            parsed = ai.parse_resume(content, filename)
            
            # Hybrid ATS score
            ats_result = ai.calculate_hybrid_ats_score(parsed["raw_text"], job.jd_text, custom_weights)

            processed_results.append({
                "filename": filename,
                "candidate_name": parsed["name"],
                "email": parsed["email"],
                "ats_score": ats_result["overall_score"],
                "confidence_score": ats_result["confidence_score"],
                "matched_skills": ats_result["matched_skills"],
                "missing_skills": ats_result["missing_skills"],
                "breakdown": ats_result["components"]
            })
            completed_count += 1
            # Yield control back to event loop to maintain responsiveness
            await asyncio.sleep(0.01)
        except Exception as e:
            print(f"Error processing resume {file_info.get('filename')}: {e}")
            failed_count += 1

    return {
        "job_id": job_id,
        "total_uploaded": len(files_data),
        "completed": completed_count,
        "failed": failed_count,
        "results": processed_results
    }
