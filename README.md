# Resume Analyzer

Hybrid BERT + rule-based ATS engine, condensed into 8 files (from a
30-file, ~5,500-line build) while preserving every feature — verified
with a full regression suite after consolidation.

## Files

| File | Contents |
|---|---|
| `app.py` | Entry point — login gate, onboarding gate, role-based routing |
| `auth.py` | Recruiter/candidate accounts, lockout, password reset, recruiter profiles |
| `database.py` | Candidates, job postings, pipeline stages, notes, interviews, embedding cache |
| `ai_engine.py` | Resume parsing (PDF/DOCX), skill extraction, BERT scoring, interview questions |
| `report_generator.py` | PDF report generation + automatic retention purge |
| `ui_kit.py` | Theme/CSS, login screen (chat funnel + tabs), help assistant |
| `recruiter_app.py` | Analyzer, bulk screening, job postings, pipeline board, dashboard, onboarding |
| `candidate_app.py` | Candidate self-service portal |

## Roles

- **Recruiter** — username + password. Full access: analyze resumes, bulk screen, post jobs, manage the hiring pipeline, view analytics.
- **Candidate** — email only, no password. Self-service resume check, own history only, can delete their own data.

(No host/admin role in this build — removed per request. `auth.create_user()` can create additional recruiter accounts directly if needed.)

## Setup

```bash
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab'); nltk.download('wordnet'); nltk.download('omw-1.4')"
streamlit run app.py
```

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `BULK_SCREENING_MAX_FILES` | 300 | Max resumes per Bulk Screening batch |
| `REPORT_RETENTION_DAYS` | 90 | PDF reports older than this are auto-deleted |

## Scoring

```
Final Score = 40% Semantic (Sentence-BERT) + 35% Skill Match
            + 15% Experience + 10% Education
```

Configurable per job posting via the weight inputs on the "Create Job Posting" form.

## Notes

- Both Sentence-BERT and NLTK degrade gracefully to simpler fallbacks if not installed/downloaded — the app runs either way, just with reduced matching quality until the real dependencies are in place.
- A latent bug from the previous multi-file version was found and fixed during this consolidation: `_candidate_login()` was never actually defined as its own function — its code was accidentally left nested inside `_recruiter_login()`, which would have caused a `NameError` the first time a candidate tried to log in. It's now a proper standalone function in `ui_kit.py`, verified with a direct test.
