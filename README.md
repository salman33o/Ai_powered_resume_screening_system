# ⚡ ResumeAI — AI-Powered Resume Screening & Job Matching System

A full-stack, production-ready AI application that analyzes resumes against job descriptions, calculates semantic & component ATS matching scores, identifies skill gaps, generates tailored interview preparation questions, and provides recruiter bulk resume screening with candidate rankings.

Built with **FastAPI**, **Google Gemini 1.5 Flash**, **SQLAlchemy (SQLite/PostgreSQL)**, and **Flutter (Android Mobile Client)**.

---

## 🌟 Features

### 👤 Candidate Portal
- 📄 **Multi-Format Parsing**: Extracts text, contact info, and skills from `.pdf`, `.docx`, and `.txt` files.
- 🎯 **ATS Semantic & Component Matching**: Computes hybrid similarity scores using TF-IDF cosine matching & skill taxonomy.
- 🤖 **Google Gemini 1.5 Flash AI**: Generates ATS score explanations, resume optimization tips, and tailored interview prep questions.
- 📊 **Skill Gap Analysis**: Identifies missing skills against target job descriptions and generates actionable learning roadmaps.

### 👔 Recruiter ATS Portal
- 🚀 **Bulk Resume Screening**: Asynchronous batch processing queue for screening high volumes of resumes.
- 🏆 **Applicant Ranking**: Ranks candidates based on ATS match scores and weighted criteria.
- ⚙️ **Custom Weightings**: Configure custom weights for Skills, Experience, Responsibilities, Projects, and Education per job posting.
- 📝 **Job Management**: Create and publish custom job descriptions directly from the mobile app.

---

## 🛠️ System Architecture & Quickstart

### 1. Backend Setup (FastAPI + SQLAlchemy)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI dev server
uvicorn api_bridge:app --reload --port 8000
```

*Interactive Swagger API documentation available at `http://localhost:8000/docs`*

### 2. Mobile App Setup (Flutter Android)

```bash
# Navigate to Android application directory
cd android_app

# Install Flutter dependencies
flutter pub get

# Run Flutter application
flutter run
```

---

## 🔌 API Endpoints Summary

- `POST /api/auth/register` — Candidate & Recruiter user registration
- `POST /api/auth/login` — User authentication returning JWT bearer token
- `GET /api/jobs` — Fetch published job postings
- `POST /api/candidate/analyze-resume` — Upload resume file (PDF/DOCX) & calculate hybrid ATS score with Gemini explainability
- `POST /api/candidate/analyze-resume-text` — Analyze pasted resume text against job description
- `POST /api/candidate/skill-gap` — Compute candidate skill coverage % and missing skills
- `POST /api/candidate/interview-questions` — Generate tailored technical & behavioral interview questions
- `POST /api/recruiter/jobs` — Create new job posting with custom screening weights
- `POST /api/recruiter/bulk-screen/{job_id}` — Asynchronous bulk resume screening
- `GET /api/recruiter/candidate-ranking/{job_id}` — Ranked applicant list for job posting

---

## 📄 License
MIT License. Free for personal and commercial use.
