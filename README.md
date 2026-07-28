# Resume Analyzer

AI-powered resume analysis and job matching platform.

- **Backend:** Python / FastAPI
- **Frontend:** Next.js / React / Tailwind CSS

## Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn api_bridge:app --reload --port 8000
```
Set `DATABASE_URL` in a `.env` file before starting.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL`.

## Deployment
- Frontend: Vercel
- Backend: Render (Docker)
- CI/CD: GitHub Actions (see `.github/workflows/deploy.yml`)
