# ⚡ PrimeATS — AI-Powered Resume Screening & Job Matching Platform

A full-stack, production-ready ATS platform that evaluates resumes against job specifications, calculates deterministic 7-factor matching scores, identifies skill gaps, generates AI-assisted interview preparation questions, and provides recruiter bulk screening with applicant ranking.

Built with **React + Vite + TypeScript**, **Express / Vercel Serverless Functions**, **pdfjs-dist**, **Mammoth**, **JSZip**, and **Google Gemini AI**.

---

## 🚀 Deployment (Vercel)

This application is configured for continuous deployment on **Vercel**.

1. Connect your repository to **Vercel**.
2. Set the following environment variable in the Vercel project settings:
   - `GEMINI_API_KEY` (Optional for AI explanation enhancements)
3. Framework Preset: **Vite**
4. Build Command: `vite build` (defined in `vercel.json` and `package.json`)
5. Output Directory: `dist`

API routes are served serverlessly via `api/index.ts` mounted at `/api`.

---

## 🌟 Key Capabilities

### 👤 Candidate Portal
- 📄 **Native Multi-Format Parsing**: Extracts text directly from `.pdf` (via `pdfjs-dist`), `.docx` (via `mammoth`), `.txt`, and `.json` in-browser with zero placeholder substitution.
- 🎯 **Deterministic 7-Factor ATS Matching**: Weighted scoring across Skills Alignment, Experience Depth, Responsibilities Context, Projects Evidence, Education, Keywords, and Certifications.
- 📊 **Skill Gap Analysis**: Identifies missing competencies against 23+ industry job requirements and provides actionable roadmaps.
- 🤖 **AI Interview Prep**: Generates role-specific behavioral and technical interview questions.

### 👔 Recruiter Operations
- 🚀 **Bulk Screening & ZIP Extraction**: Batch screens multiple `.pdf`/`.docx` resumes or uploaded `.zip` archives with ranking.
- ⚙️ **Custom Weights & Calibration**: Adjust component weighting per job posting.
- 🔒 **Role-Locked Security & Audit Trails**: Session-locked authentication with explainable ATS audit logs.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Build for production
npm run build
```

---

## 📄 License
MIT License. Free for personal and commercial use.

