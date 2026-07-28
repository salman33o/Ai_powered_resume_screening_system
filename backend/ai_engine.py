"""
AI Engine — powered by Google Gemini 1.5 Flash (free tier)
Falls back to smart rule-based analysis if GEMINI_API_KEY is not set.
"""
import re
import io
import os
from typing import Dict, Any, List, Optional

# ── Gemini setup ──────────────────────────────────────────────────────────────
import google.generativeai as genai

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
_gemini_model = None

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    _gemini_model = genai.GenerativeModel("gemini-1.5-flash")
    print("[OK] Gemini 1.5 Flash initialized.")
else:
    print("[INFO] GEMINI_API_KEY not set - using enhanced rule-based fallback.")


def _ask_gemini(prompt: str, fallback: str) -> str:
    """Call Gemini; return fallback string on any error."""
    if not _gemini_model:
        return fallback
    try:
        response = _gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini error: {e}")
        return fallback


# ── Skill taxonomy ────────────────────────────────────────────────────────────
SKILL_TAXONOMY = {
    "languages": [
        "python", "java", "javascript", "typescript", "c", "c++", "c#", "go",
        "rust", "ruby", "php", "kotlin", "swift", "scala", "r", "matlab",
        "perl", "bash", "shell", "powershell", "dart",
    ],
    "frontend": [
        "react", "next.js", "nextjs", "vue", "angular", "svelte", "html",
        "css", "sass", "tailwind", "tailwindcss", "bootstrap", "jquery",
        "webpack", "vite", "redux", "zustand", "graphql", "three.js",
    ],
    "backend": [
        "fastapi", "django", "flask", "express", "node.js", "nodejs",
        "spring", "spring boot", "laravel", "rails", "asp.net", "nestjs",
        "fiber", "gin", "rest api", "grpc", "websocket", "microservices",
    ],
    "databases": [
        "postgresql", "mysql", "sqlite", "mongodb", "redis", "elasticsearch",
        "cassandra", "dynamodb", "firebase", "supabase", "neo4j", "oracle",
        "mariadb", "cockroachdb", "influxdb",
    ],
    "cloud_devops": [
        "aws", "gcp", "azure", "docker", "kubernetes", "k8s", "terraform",
        "ansible", "helm", "jenkins", "github actions", "gitlab ci", "ci/cd",
        "linux", "nginx", "apache", "prometheus", "grafana", "datadog",
        "cloudformation", "pulumi", "serverless",
    ],
    "data_ml": [
        "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
        "scikit-learn", "pandas", "numpy", "scipy", "spark", "hadoop",
        "airflow", "mlflow", "hugging face", "nlp", "computer vision",
        "data analysis", "data visualization", "tableau", "power bi",
        "jupyter", "sql", "etl", "dbt",
    ],
    "tools_practices": [
        "git", "github", "gitlab", "jira", "agile", "scrum", "kanban",
        "tdd", "bdd", "code review", "system design", "api design",
        "microservices", "event driven", "oauth", "jwt", "graphql",
        "swagger", "openapi", "postman",
    ],
    "soft_skills": [
        "leadership", "team lead", "management", "communication",
        "problem solving", "mentoring", "project management",
    ],
}

ALL_SKILLS: List[str] = []
for skills in SKILL_TAXONOMY.values():
    ALL_SKILLS.extend(skills)


# ── PDF / DOCX parsing ────────────────────────────────────────────────────────
def _extract_text_from_pdf(file_content: bytes) -> str:
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(file_content))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages)
    except Exception as e:
        print(f"PDF parse error: {e}")
        return ""


def _extract_text_from_docx(file_content: bytes) -> str:
    try:
        import docx
        document = docx.Document(io.BytesIO(file_content))
        return "\n".join([para.text for para in document.paragraphs])
    except Exception as e:
        print(f"DOCX parse error: {e}")
        return ""


def _extract_skills_from_text(text: str) -> List[str]:
    text_lower = text.lower()
    found = set()
    for skill in ALL_SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text_lower):
            found.add(skill)
    return sorted(found)


def parse_resume(file_content: bytes, filename: str) -> Dict[str, Any]:
    print(f"Parsing resume: {filename}")
    filename_lower = filename.lower()

    if filename_lower.endswith(".pdf"):
        resume_text = _extract_text_from_pdf(file_content)
    elif filename_lower.endswith(".docx"):
        resume_text = _extract_text_from_docx(file_content)
    else:
        try:
            resume_text = file_content.decode("utf-8", errors="ignore")
        except Exception:
            resume_text = ""

    if not resume_text:
        resume_text = "Could not extract text from resume."

    # Extract name (first non-empty line, up to 60 chars, no email chars)
    lines = [l.strip() for l in resume_text.split("\n") if l.strip()]
    name = "N/A"
    for line in lines[:5]:
        if "@" not in line and len(line) < 60 and len(line) > 2:
            name = line
            break

    email_match = re.search(r"[\w.\-+]+@[\w.\-]+\.\w+", resume_text)
    phone_match = re.search(
        r"(\+?\d[\d\s\-().]{7,}\d)", resume_text
    )

    skills = _extract_skills_from_text(resume_text)

    return {
        "resume_text": resume_text,
        "name": name,
        "email": email_match.group(0) if email_match else "N/A",
        "phone": phone_match.group(0).strip() if phone_match else None,
        "skills": skills,
        "experience": [],
        "education": [],
        "parsed_features": {},
    }


# ── TF-IDF semantic scoring ───────────────────────────────────────────────────
def _pure_python_similarity(text_a: str, text_b: str) -> float:
    words_a = set(re.findall(r"\b\w{3,}\b", text_a.lower()))
    words_b = set(re.findall(r"\b\w{3,}\b", text_b.lower()))
    if not words_a or not words_b:
        return 0.0
    intersection = words_a & words_b
    union = words_a | words_b
    return float(len(intersection)) / float(len(union))


def _tfidf_similarity(text_a: str, text_b: str) -> float:
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        tfidf = vectorizer.fit_transform([text_a, text_b])
        score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return float(score)
    except Exception:
        return _pure_python_similarity(text_a, text_b)


# ── Core analysis functions ───────────────────────────────────────────────────
def analyze_skills(candidate_data: Dict[str, Any], jd_text: str) -> Dict[str, Any]:
    required_skills = set(_extract_skills_from_text(jd_text))
    candidate_skills = set(
        s.lower() for s in candidate_data.get("skills", [])
    )

    # Also check resume text directly
    resume_text = candidate_data.get("resume_text", "")
    if resume_text:
        candidate_skills.update(_extract_skills_from_text(resume_text))

    matched = list(candidate_skills & required_skills)
    unmatched = list(required_skills - candidate_skills)

    return {
        "required_skills": sorted(required_skills),
        "candidate_skills": sorted(candidate_skills),
        "matched_skills": sorted(matched),
        "unmatched_skills": sorted(unmatched),
        "skill_gap_analysis": (
            f"Matched {len(matched)} of {len(required_skills)} required skills."
            if required_skills
            else "No specific skills identified in job description."
        ),
    }


def calculate_ats_score(
    candidate_data: Dict[str, Any],
    jd_text: str,
    skill_report: Dict[str, Any],
    weights: Dict[str, float],
) -> Dict[str, Any]:
    resume_text = candidate_data.get("resume_text", "")

    # Semantic score via TF-IDF
    semantic_score = _tfidf_similarity(resume_text, jd_text) * 100

    # Skill score
    matched = len(skill_report.get("matched_skills", []))
    required = len(skill_report.get("required_skills", []))
    skill_score = min(100.0, (matched / required) * 100) if required > 0 else 50.0

    # Experience heuristic (keyword-based)
    exp_keywords = ["experience", "years", "managed", "led", "built", "designed",
                    "developed", "architected", "delivered", "senior", "lead"]
    exp_count = sum(1 for kw in exp_keywords if kw in resume_text.lower())
    experience_score = min(100.0, exp_count * 10)

    # Education heuristic
    edu_keywords = ["bachelor", "master", "phd", "degree", "b.e", "b.tech",
                    "m.tech", "m.s", "m.sc", "b.sc", "mba", "university", "college"]
    edu_count = sum(1 for kw in edu_keywords if kw in resume_text.lower())
    education_score = min(100.0, edu_count * 20)

    w = {
        "semantic": weights.get("semantic", 0.4),
        "skill": weights.get("skill", 0.3),
        "experience": weights.get("experience", 0.2),
        "education": weights.get("education", 0.1),
    }

    total = (
        semantic_score * w["semantic"]
        + skill_score * w["skill"]
        + experience_score * w["experience"]
        + education_score * w["education"]
    )
    total = round(min(100.0, total), 1)

    if total >= 75:
        verdict = "Strong Match"
    elif total >= 50:
        verdict = "Potential Match"
    else:
        verdict = "Weak Match"

    return {
        "semantic": round(semantic_score, 1),
        "skill": round(skill_score, 1),
        "experience": round(experience_score, 1),
        "education": round(education_score, 1),
        "Total Score": total,
        "Verdict": verdict,
    }


# ── Gemini-powered generation functions ──────────────────────────────────────
def generate_summary(resume_text: str) -> str:
    if not resume_text or len(resume_text) < 50:
        return "Please upload a valid resume to generate a summary."

    prompt = f"""You are a professional career advisor. Write a concise, compelling 3-sentence professional summary for the following resume. 
Focus on: key skills, years of experience, and what makes this candidate unique.
Keep it in third person and under 100 words.

Resume:
{resume_text[:3000]}

Professional Summary:"""

    fallback = (
        "A skilled professional with demonstrated expertise across multiple technical domains. "
        "The candidate brings a strong foundation in software development and problem-solving. "
        "Committed to delivering high-quality solutions and driving impactful results."
    )
    return _ask_gemini(prompt, fallback)


def generate_suggestions(resume_text: str, preferred_role: str) -> Dict[str, Any]:
    prompt = f"""You are a career coach specializing in tech roles. Analyze this resume for someone targeting a '{preferred_role}' position.

Provide:
1. Three specific skill improvement suggestions (be concrete, mention real tools/courses)
2. Two project ideas they should build for their portfolio
3. A 4-step learning roadmap with specific resources

Resume snippet:
{resume_text[:2000]}

Respond in this exact JSON format:
{{
  "skill_suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "project_recommendations": ["project1", "project2"],
  "learning_roadmap": [
    {{"step": 1, "topic": "...", "resource": "..."}},
    {{"step": 2, "topic": "...", "resource": "..."}},
    {{"step": 3, "topic": "...", "resource": "..."}},
    {{"step": 4, "topic": "...", "resource": "..."}}
  ]
}}"""

    fallback_json = {
        "skill_suggestions": [
            f"Master advanced {preferred_role} patterns through hands-on projects on GitHub",
            f"Get certified in core {preferred_role} technologies (AWS, GCP, or relevant platform)",
            "Strengthen system design skills via 'Designing Data-Intensive Applications' (Kleppmann)",
        ],
        "project_recommendations": [
            f"Build a full-stack {preferred_role} demo with real-world complexity and deploy it",
            "Create an open-source tool that solves a real problem — add it to your GitHub",
        ],
        "learning_roadmap": [
            {"step": 1, "topic": "Core Fundamentals", "resource": "freeCodeCamp / official docs"},
            {"step": 2, "topic": "Advanced Patterns", "resource": "Udemy / Coursera top-rated courses"},
            {"step": 3, "topic": "Real Project", "resource": "Build & deploy on Vercel / Render"},
            {"step": 4, "topic": "Community & Portfolio", "resource": "GitHub, LinkedIn, Dev.to"},
        ],
    }

    result = _ask_gemini(prompt, "")
    if result:
        import json
        try:
            # Extract JSON from response
            json_match = re.search(r"\{.*\}", result, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        except Exception:
            pass
    return fallback_json


def generate_cover_letter(candidate_data: Dict[str, Any], job_posting: Dict[str, Any]) -> str:
    name = candidate_data.get("name", "Valued Candidate")
    job_title = job_posting.get("title", "the role")
    company = job_posting.get("company_name", "your company")
    skills = candidate_data.get("skills", [])
    resume_text = candidate_data.get("resume_text", "")

    prompt = f"""Write a professional, engaging cover letter for this job application.

Candidate: {name}
Target Role: {job_title} at {company}
Candidate Skills: {', '.join(skills[:15]) if skills else 'various technical skills'}
Resume Excerpt: {resume_text[:1000]}
Job Description: {job_posting.get('jd_text', '')[:800]}

Write a 3-paragraph cover letter:
- Paragraph 1: Opening — express enthusiasm and mention the specific role
- Paragraph 2: Connect 2-3 specific skills/experiences to the job requirements
- Paragraph 3: Call to action — request an interview

Keep it professional, under 300 words, and avoid generic phrases. Do NOT include the address header, just start with 'Dear Hiring Manager,'."""

    fallback = f"""Dear Hiring Manager,

I am excited to apply for the {job_title} position at {company}. With my background in {', '.join(skills[:3]) if skills else 'software development'} and a passion for building impactful solutions, I am confident that I would be a strong addition to your team.

Throughout my career, I have developed deep expertise in {', '.join(skills[:5]) if skills else 'key technical areas'}, which aligns closely with the requirements outlined in your job description. I thrive in collaborative environments and have consistently delivered high-quality work on time, even under pressure.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to {company}'s continued success. Thank you for considering my application — I look forward to speaking with you.

Sincerely,
{name}"""

    return _ask_gemini(prompt, fallback)


def generate_interview_questions(
    candidate_data: Dict[str, Any],
    job_posting: Dict[str, Any],
    num_questions: int = 5,
) -> List[str]:
    job_title = job_posting.get("title", "the role")
    company = job_posting.get("company_name", "the company")
    skills = candidate_data.get("skills", [])
    jd_text = job_posting.get("jd_text", "")

    prompt = f"""Generate {num_questions} thoughtful technical and behavioral interview questions for a {job_title} position at {company}.

Required skills from JD: {', '.join(skills[:10]) if skills else 'general tech skills'}
Job Description: {jd_text[:600]}

Mix of:
- 2-3 technical questions specific to the role's tech stack
- 1-2 behavioral/situational questions (using STAR format)
- 1 culture/motivation question

Format as a numbered list. Be specific and relevant."""

    fallback = [
        f"Walk me through a challenging technical problem you solved in a previous {job_title}-like role.",
        f"How do you stay current with new developments in {skills[0] if skills else 'your field'}?",
        "Describe a time you had to deliver under a tight deadline. What was your approach?",
        f"How would you design a scalable system for {company}'s expected use case?",
        "Tell me about a time you disagreed with a technical decision. How did you handle it?",
    ][:num_questions]

    result = _ask_gemini(prompt, "")
    if result:
        # Parse numbered list
        questions = re.findall(r"\d+\.\s+(.+?)(?=\n\d+\.|\Z)", result, re.DOTALL)
        questions = [q.strip() for q in questions if q.strip()]
        if questions:
            return questions[:num_questions]
    return fallback


def generate_resume_draft(existing_resume: Optional[str], preferred_role: str) -> str:
    if existing_resume:
        prompt = f"""Rewrite and improve this resume for a '{preferred_role}' role.
Make it:
- ATS-friendly with strong action verbs
- Quantified achievements where possible
- Clean, professional format

Original resume:
{existing_resume[:2000]}

Improved resume:"""
        fallback = f"[Enhanced resume for {preferred_role} based on your original content would appear here.]"
    else:
        prompt = f"""Write a professional template resume for a '{preferred_role}' role.
Include: Summary, Skills, Experience (2 sample jobs), Education, Projects sections.
Use strong action verbs and quantified achievements."""
        fallback = f"[Professional resume template for {preferred_role} would appear here.]"

    return _ask_gemini(prompt, fallback)
