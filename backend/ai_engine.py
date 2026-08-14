"""
AI Engine & Explainable ATS Scoring System — Powered by Gemini 1.5 Flash & Scikit-learn
Includes Skill Ontology, Hybrid Scoring Engine, Confidence Score, & Generative AI Features.
"""
import re
import io
import os
from typing import Dict, Any, List, Optional, Set, Tuple

# ── Gemini setup ──────────────────────────────────────────────────────────────
import google.generativeai as genai

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
_gemini_model = None

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        _gemini_model = genai.GenerativeModel("gemini-1.5-flash")
        print("[OK] Gemini 1.5 Flash initialized.")
    except Exception as e:
        print(f"[WARN] Failed to init Gemini: {e}")

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

# ── Skill Taxonomy & Alias Ontology System ──────────────────────────────────
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
        "mariadb", "cockroachdb", "influxdb", "sql",
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
        "jupyter", "etl", "dbt",
    ],
    "tools_practices": [
        "git", "github", "gitlab", "jira", "agile", "scrum", "kanban",
        "tdd", "bdd", "code review", "system design", "api design",
        "microservices", "event driven", "oauth", "jwt", "swagger", "openapi", "postman",
    ],
    "soft_skills": [
        "leadership", "team lead", "management", "communication",
        "problem solving", "mentoring", "project management",
    ],
}

SKILL_ALIASES = {
    "ml": "machine learning",
    "machine learning algorithms": "machine learning",
    "dl": "deep learning",
    "structured query language": "sql",
    "sql database": "sql",
    "postgres": "postgresql",
    "node": "node.js",
    "next": "next.js",
    "react.js": "react",
    "reactjs": "react",
    "vue.js": "vue",
    "vuejs": "vue",
    "amazon web services": "aws",
    "google cloud": "gcp",
    "google cloud platform": "gcp",
    "k8s": "kubernetes",
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
}

ALL_SKILLS: Set[str] = set()
for skills in SKILL_TAXONOMY.values():
    ALL_SKILLS.update(skills)

def normalize_skill(skill: str) -> str:
    s = skill.lower().strip()
    return SKILL_ALIASES.get(s, s)

# ── Multi-Stage File Parsers ──────────────────────────────────────────────────
def _extract_text_from_pdf(file_content: bytes) -> Tuple[str, float]:
    """Extracts text from PDF. Returns (text, confidence_score)."""
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(file_content))
        pages = [page.extract_text() or "" for page in reader.pages]
        text = "\n".join(pages).strip()
        confidence = 0.95 if len(text) > 100 else 0.40
        return text, confidence
    except Exception as e:
        print(f"PDF parse error: {e}")
        return "", 0.0

def _extract_text_from_docx(file_content: bytes) -> Tuple[str, float]:
    """Extracts text from DOCX. Returns (text, confidence_score)."""
    try:
        import docx
        document = docx.Document(io.BytesIO(file_content))
        text = "\n".join([para.text for para in document.paragraphs if para.text]).strip()
        confidence = 0.98 if len(text) > 100 else 0.50
        return text, confidence
    except Exception as e:
        print(f"DOCX parse error: {e}")
        return "", 0.0

def parse_resume(file_content: bytes, filename: str) -> Dict[str, Any]:
    print(f"Parsing resume: {filename}")
    filename_lower = filename.lower()

    if filename_lower.endswith(".pdf"):
        resume_text, confidence = _extract_text_from_pdf(file_content)
    elif filename_lower.endswith(".docx"):
        resume_text, confidence = _extract_text_from_docx(file_content)
    else:
        try:
            resume_text = file_content.decode("utf-8", errors="ignore").strip()
            confidence = 0.70 if len(resume_text) > 50 else 0.20
        except Exception:
            resume_text = ""
            confidence = 0.0

    if not resume_text:
        resume_text = "Could not extract readable text from resume."
        confidence = 0.0

    # Extract Contact Details safely
    lines = [l.strip() for l in resume_text.split("\n") if l.strip()]
    name = "Candidate"
    for line in lines[:5]:
        if "@" not in line and not any(char.isdigit() for char in line) and 2 < len(line) < 50:
            name = line
            break

    email_match = re.search(r"[\w.\-+]+@[\w.\-]+\.\w+", resume_text)
    phone_match = re.search(r"(\+?\d[\d\s\-().]{7,}\d)", resume_text)

    # Extract Skills
    extracted_skills = extract_skills_from_text(resume_text)

    return {
        "raw_text": resume_text,
        "name": name,
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0).strip() if phone_match else None,
        "skills": extracted_skills,
        "extraction_confidence": round(confidence * 100, 1),
    }

def extract_skills_from_text(text: str) -> List[str]:
    text_lower = text.lower()
    found = set()
    for skill in ALL_SKILLS:
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text_lower):
            found.add(normalize_skill(skill))
    
    # Also check aliases explicitly
    for alias, canonical in SKILL_ALIASES.items():
        pattern = r"\b" + re.escape(alias) + r"\b"
        if re.search(pattern, text_lower):
            found.add(canonical)

    return sorted(list(found))

# ── Semantic Matcher ─────────────────────────────────────────────────────────
def _tfidf_similarity(text_a: str, text_b: str) -> float:
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        tfidf = vectorizer.fit_transform([text_a, text_b])
        score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return float(score)
    except Exception:
        # Fallback Jaccard similarity
        words_a = set(re.findall(r"\b\w{3,}\b", text_a.lower()))
        words_b = set(re.findall(r"\b\w{3,}\b", text_b.lower()))
        if not words_a or not words_b: return 0.0
        return len(words_a & words_b) / len(words_a | words_b)

# ── Deterministic Hybrid ATS Scoring Engine ──────────────────────────────────
def calculate_hybrid_ats_score(
    resume_text: str,
    jd_text: str,
    weights: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    if not weights:
        weights = {
            "skills": 0.30,
            "experience": 0.25,
            "responsibilities": 0.20,
            "projects": 0.10,
            "education": 0.05,
            "keywords": 0.05,
            "certifications": 0.05,
        }

    resume_skills = set(extract_skills_from_text(resume_text))
    jd_skills = set(extract_skills_from_text(jd_text))

    # 1. Skills Score (30%)
    matched_skills = sorted(list(resume_skills & jd_skills))
    missing_skills = sorted(list(jd_skills - resume_skills))
    skills_score = (len(matched_skills) / len(jd_skills) * 100) if jd_skills else 70.0

    # 2. Experience Match Score (25%)
    exp_words = ["years", "experience", "senior", "lead", "managed", "architected", "delivered"]
    exp_matches = sum(1 for w in exp_words if w in resume_text.lower())
    experience_score = min(100.0, exp_matches * 15.0)

    # 3. Responsibilities Match (20%) - Semantic similarity
    responsibilities_score = _tfidf_similarity(resume_text, jd_text) * 100.0

    # 4. Projects Score (10%)
    proj_words = ["project", "built", "implemented", "system", "application", "designed", "deployed"]
    proj_matches = sum(1 for w in proj_words if w in resume_text.lower())
    projects_score = min(100.0, proj_matches * 20.0)

    # 5. Education Score (5%)
    edu_words = ["bachelor", "master", "degree", "b.e", "b.tech", "m.tech", "phd", "university", "college"]
    edu_matches = sum(1 for w in edu_words if w in resume_text.lower())
    education_score = min(100.0, edu_matches * 30.0)

    # 6. Keywords Score (5%)
    keywords_score = _tfidf_similarity(resume_text, jd_text) * 100.0

    # 7. Certifications Score (5%)
    cert_words = ["certified", "certification", "aws certified", "pmp", "ckad", "azure certified"]
    cert_matches = sum(1 for w in cert_words if w in resume_text.lower())
    certifications_score = min(100.0, cert_matches * 50.0)

    # Calculate Weighted Overall Score
    overall_score = (
        skills_score * weights.get("skills", 0.30) +
        experience_score * weights.get("experience", 0.25) +
        responsibilities_score * weights.get("responsibilities", 0.20) +
        projects_score * weights.get("projects", 0.10) +
        education_score * weights.get("education", 0.05) +
        keywords_score * weights.get("keywords", 0.05) +
        certifications_score * weights.get("certifications", 0.05)
    )

    # Calculate Confidence Score based on document length and extraction quality
    doc_length = len(resume_text)
    if doc_length < 200:
        confidence = 40.0
    elif doc_length < 500:
        confidence = 70.0
    else:
        confidence = 92.0

    overall_score = round(overall_score, 1)
    confidence = round(confidence, 1)

    return {
        "overall_score": overall_score,
        "confidence_score": confidence,
        "components": {
            "skills_score": round(skills_score, 1),
            "experience_score": round(experience_score, 1),
            "responsibilities_score": round(responsibilities_score, 1),
            "projects_score": round(projects_score, 1),
            "education_score": round(education_score, 1),
            "keywords_score": round(keywords_score, 1),
            "certifications_score": round(certifications_score, 1),
        },
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
    }

# ── Generative AI Features (Gemini 1.5 Flash) ─────────────────────────────────
def generate_ats_explanation(ats_result: Dict[str, Any], jd_title: str) -> str:
    prompt = f"""
Provide a clear, professional 3-bullet explanation of this ATS Candidate Evaluation for the position of '{jd_title}'.

Overall Match: {ats_result['overall_score']}%
Matched Skills: {', '.join(ats_result['matched_skills'])}
Missing Skills: {', '.join(ats_result['missing_skills'])}

Be objective, concise, and constructive.
"""
    fallback = (
        f"Candidate scored {ats_result['overall_score']}% match for {jd_title}. "
        f"Key matched skills include {', '.join(ats_result['matched_skills'][:4]) if ats_result['matched_skills'] else 'general domain skills'}. "
        f"Missing key skills: {', '.join(ats_result['missing_skills'][:4]) if ats_result['missing_skills'] else 'None identified'}."
    )
    return _ask_gemini(prompt, fallback)

def generate_resume_optimizer_tips(resume_text: str, jd_text: str) -> List[str]:
    prompt = f"""
Act as an expert resume career coach. Analyze the resume against the job description and suggest 4 specific, actionable improvements.
Do NOT fabricate experience or false information.

RESUME TEXT:
{resume_text[:1500]}

JOB DESCRIPTION:
{jd_text[:1500]}

Return 4 bullet points of realistic suggestions.
"""
    fallback_response = _ask_gemini(prompt, "")
    if fallback_response:
        return [b.strip("-* ") for b in fallback_response.split("\n") if b.strip()]
    return [
        "Clearly state technical tools and frameworks in bullet points.",
        "Quantify project achievements with measurable metrics (e.g. improved performance by 20%).",
        "Ensure exact keyword alignment with the key skills listed in the job description.",
        "Add a dedicated Core Competencies section to highlight primary technologies."
    ]

def generate_interview_questions(resume_text: str, jd_text: str) -> List[Dict[str, str]]:
    prompt = f"""
Generate 3 tailored technical/behavioral interview questions based on the candidate's resume and job description.

RESUME:
{resume_text[:1000]}

JOB DESCRIPTION:
{jd_text[:1000]}

Return output formatted strictly as Question lines.
"""
    raw = _ask_gemini(prompt, "")
    questions = []
    if raw:
        for line in raw.split("\n"):
            if line.strip():
                questions.append({"question": line.strip("-* 123. "), "category": "Tailored"})
    if not questions:
        questions = [
            {"question": "Can you walk us through a recent technical project where you designed a key feature?", "category": "Technical"},
            {"question": "How do you handle missing requirements or changing priorities during a deployment?", "category": "Behavioral"},
            {"question": "What techniques do you use to ensure code quality and system performance?", "category": "Engineering Practices"}
        ]
    return questions
