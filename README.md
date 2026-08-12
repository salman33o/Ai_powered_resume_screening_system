# ⚡ ResumeAI — AI-Powered Resume Screening & Job Matching System

A full-stack, production-ready AI application that analyzes resumes against job descriptions, calculates semantic ATS matching scores, identifies skill gaps, generates custom cover letters, and provides mock interview preparation.

Built with **FastAPI**, **Google Gemini 1.5 Flash**, **SQLite**, and **Next.js 14**.

---

## 🌟 Features

- 📄 **Multi-Format Parsing**: Extracts text, contact info, and skills from `.pdf`, `.docx`, and `.txt` files.
- 🎯 **ATS Semantic Matching**: Computes similarity scores using TF-IDF cosine matching with pure-Python n-gram fallbacks.
- 🤖 **Google Gemini 1.5 Flash AI**: Generates professional summaries, skill upgrade recommendations, custom cover letters, and interview prep questions.
- 📊 **Recruiter Analytics Dashboard**: Interactive KPIs and Recharts score distribution bar chart.
- 💎 **Premium Dark Glassmorphism UI**: Built with Next.js 14 App Router, Tailwind CSS, Outfit & Inter fonts.
- 💰 **100% Free Deployment**: Operates with zero database costs using SQLite and free-tier hosting.

---

## 🚀 1-Click Free Deployment Guide

### 1. Deploy Backend (Render.com — 100% Free)
1. Go to [Render.com](https://render.com) and create a free account.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repo: `salman33o/Ai_powered_resume_screening_system`.
4. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api_bridge:app --host 0.0.0.0 --port $PORT`
5. *(Optional)* Add Environment Variable:
   - `GEMINI_API_KEY`: `your_free_google_ai_studio_key`
6. Click **Create Web Service**. You will get a backend URL like `https://your-backend.onrender.com`.

---

### 2. Deploy Frontend (Vercel — 100% Free)
1. Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** → Import `Ai_powered_resume_screening_system`.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com`
5. Click **Deploy**. Done! 🎉

---

## 🛠️ Local Development Setup

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn api_bridge:app --reload --port 8000
```
*API docs available at `http://localhost:8000/docs`*

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*App running at `http://localhost:3000`*

---

## 📄 License
MIT License. Free for personal and commercial use.
