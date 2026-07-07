"""
Full functional test suite for ai_engine.py
Covers: parsing helpers, skill extraction, education/experience scoring,
semantic scoring, final ATS scoring, verdicts, interview questions,
and all previously-fixed bug regressions.
"""
import sys
sys.path.insert(0, ".")
import ai_engine as ai

passed, failed = 0, 0


def check(label, condition):
    global passed, failed
    if condition:
        passed += 1
        print(f"  PASS  {label}")
    else:
        failed += 1
        print(f"  FAIL  {label}")


print("=" * 70)
print("1. CONTACT / NAME EXTRACTION")
print("=" * 70)
check("extracts email", ai.extract_email("Contact: john.doe@gmail.com") == "john.doe@gmail.com")
check("extracts phone (Indian format)", ai.extract_phone("Call me at +91-9876543210") == "+91-9876543210")
check("missing email returns 'Not Found'", ai.extract_email("no email here") == "Not Found")
check("missing phone returns 'Not Found'", ai.extract_phone("no phone here") == "Not Found")
check("extracts a plausible name line", ai.extract_name("Aditya Sharma\nSoftware Engineer\naditya@x.com") == "Aditya Sharma")
check("skips 'Curriculum Vitae' header line", ai.extract_name("Curriculum Vitae\nAditya Sharma\n") == "Aditya Sharma")

print()
print("=" * 70)
print("2. EDUCATION EXTRACTION & SCORING (bug fix verification)")
print("=" * 70)
check("B.Tech detected", "b.tech" in ai.extract_education("B.Tech in Computer Science"))
check("B.Sc detected (previously missing)", "b.sc" in ai.extract_education("B.Sc in Statistics"))
check("MCA detected (previously missing)", "mca" in ai.extract_education("MCA graduate"))
check("MBA detected", "mba" in ai.extract_education("MBA in Marketing"))
check("BCA detected (previously missing)", "bca" in ai.extract_education("BCA from Anna University"))
check("PhD detected", "phd" in ai.extract_education("PhD in Physics"))
check("No degree text -> 'Not Mentioned'", ai.extract_education("Excellent communicator and team player.") == "Not Mentioned")

check("'based/best/become' no longer falsely requires degree",
      ai._degree_level("The best candidate is based here and will become a leader.") == 0)
check("Real Bachelor's requirement still detected", ai._degree_level("Bachelor's degree required.") == 2)
check("Real Master's requirement still detected", ai._degree_level("Master's degree preferred.") == 3)

print()
print("=" * 70)
print("3. SKILL EXTRACTION (false-positive bug fix verification)")
print("=" * 70)
check("'R&D' does NOT falsely match language 'r'", "r" not in ai.extract_skills("Our R&D team is expanding."))
check("'go the extra mile' does NOT falsely match language 'go'",
      "go" not in ai.extract_skills("Someone who will go the extra mile."))
check("'Class C license' does NOT falsely match language 'c'",
      "c" not in ai.extract_skills("Valid Class C driving license required."))
check("'my CV' does NOT falsely match 'computer vision'",
      "computer vision" not in ai.extract_skills("Please find my CV attached."))
check("Real 'R' language usage still detected",
      "r" in ai.extract_skills("Experienced in R programming for statistics."))
check("Real 'Go' language usage still detected",
      "go" in ai.extract_skills("Backend built in Go (Golang)."))
check("Real 'C' language usage still detected",
      "c" in ai.extract_skills("Strong C programming fundamentals."))
check("Spring Boot now recognized (previously missing)",
      "spring boot" in ai.extract_skills("Built services with Spring Boot."))
check("Microservices now recognized (previously missing)",
      "microservices" in ai.extract_skills("Deployed a microservices architecture."))
check("Synonym resolution: 'ML' -> machine learning",
      "machine learning" in ai.extract_skills("3 years of ML experience."))
check("Synonym resolution: 'k8s' -> kubernetes",
      "kubernetes" in ai.extract_skills("Managed clusters with k8s."))
check("c++ token matches correctly", "c++" in ai.extract_skills("Proficient in C++ for embedded systems."))
check("c# token matches correctly", "c#" in ai.extract_skills("Built desktop apps in C#."))

print()
print("=" * 70)
print("4. SKILL GAP ANALYSIS (analyze_skills)")
print("=" * 70)
jd_sample = "Looking for a Python developer with SQL and AWS experience."
resume_full_match = "Experienced Python developer skilled in SQL and AWS."
resume_partial = "Experienced Java developer skilled in SQL."
report_full = ai.analyze_skills({"resume_text": resume_full_match}, jd_sample)
report_partial = ai.analyze_skills({"resume_text": resume_partial}, jd_sample)
check("Full skill match scores 100%", report_full["Skill Match Percentage"] == 100.0)
check("No missing skills when fully matched", report_full["Missing Skills"] == [])
check("Partial match correctly identifies gap", "python" in report_partial["Missing Skills"] and "aws" in report_partial["Missing Skills"])
check("Partial match percentage is between 0 and 100", 0 < report_partial["Skill Match Percentage"] < 100)

print()
print("=" * 70)
print("5. EXPERIENCE SCORING")
print("=" * 70)
check("Meets required years -> 100",
      ai.experience_score({"resume_text": "5 years of experience in backend development."},
                            "Requires 3 years of experience.") == 100.0)
check("Under required years -> partial score",
      0 < ai.experience_score({"resume_text": "1 year of experience."},
                                "Requires 5 years of experience.") < 100)
check("No years mentioned anywhere -> falls back to keyword heuristic",
      ai.experience_score({"resume_text": "Worked as an intern on several projects."},
                            "Great opportunity for driven individuals.") > 0)

print()
print("=" * 70)
print("6. SEMANTIC SCORE CALIBRATION (bug fix verification)")
print("=" * 70)
check("Low raw similarity (0.25) rescales to 0", ai._rescale_similarity(0.25) == 0.0)
check("Mid raw similarity (0.5) rescales to 50", ai._rescale_similarity(0.5) == 50.0)
check("High raw similarity (0.75) rescales to 100", ai._rescale_similarity(0.75) == 100.0)
check("Very high raw similarity (0.95) clips at 100", ai._rescale_similarity(0.95) == 100.0)
check("Very low raw similarity (0.05) clips at 0", ai._rescale_similarity(0.05) == 0.0)
check("BERT_AVAILABLE flag exists and is boolean", isinstance(ai.BERT_AVAILABLE, bool))

print()
print("=" * 70)
print("7. FULL END-TO-END ATS SCORING")
print("=" * 70)
jd = """Software Engineer
Requirements: 2+ years of experience. Proficiency in Python, SQL, AWS.
Bachelor's degree in Computer Science required."""

strong_candidate = {
    "name": "Test Candidate A",
    "resume_text": "Software Engineer with 4 years of experience in Python, SQL and AWS. "
                    "B.Tech in Computer Science.",
    "education": ai.extract_education("B.Tech in Computer Science"),
}
weak_candidate = {
    "name": "Test Candidate B",
    "resume_text": "Recent graduate looking for opportunities. Diploma in Arts.",
    "education": ai.extract_education("Diploma in Arts"),
}

skill_report_strong = ai.analyze_skills(strong_candidate, jd)
skill_report_weak = ai.analyze_skills(weak_candidate, jd)

result_strong = ai.calculate_ats_score(strong_candidate, jd, skill_report_strong)
result_weak = ai.calculate_ats_score(weak_candidate, jd, skill_report_weak)

print(f"  Strong candidate -> Final Score: {result_strong['Final Score']}, Verdict: {result_strong['Verdict']}")
print(f"  Weak candidate   -> Final Score: {result_weak['Final Score']}, Verdict: {result_weak['Verdict']}")

check("Strong candidate scores meaningfully higher than weak candidate",
      result_strong["Final Score"] > result_weak["Final Score"])
check("Strong candidate gets a positive verdict",
      "Recommended" in result_strong["Verdict"] or "Strong" in result_strong["Verdict"])
check("Weak candidate gets a low/negative verdict",
      "Not Recommended" in result_weak["Verdict"] or "Reservations" in result_weak["Verdict"])
check("Final Score is within valid 0-100 range (strong)", 0 <= result_strong["Final Score"] <= 100)
check("Final Score is within valid 0-100 range (weak)", 0 <= result_weak["Final Score"] <= 100)
check("AI Feedback text was generated", len(result_strong["AI Feedback"]) > 0)

print()
print("=" * 70)
print("8. BULK SCORING CONSISTENCY")
print("=" * 70)
candidates = [strong_candidate, weak_candidate]
skill_reports = [skill_report_strong, skill_report_weak]
bulk_results = ai.bulk_calculate_ats_scores(candidates, jd, skill_reports)
check("Bulk scoring returns one result per candidate", len(bulk_results) == len(candidates))
check("Bulk scoring produces same ranking as individual scoring",
      bulk_results[0]["Final Score"] > bulk_results[1]["Final Score"])

print()
print("=" * 70)
print("9. INTERVIEW QUESTION GENERATION")
print("=" * 70)
questions = ai.generate_interview_questions(["python", "sql", "docker"], num_technical=5, num_hr=3)
check("Generates at least one technical question", any("Technical" in q["type"] for q in questions))
check("Generates HR questions", any(q["type"] == "HR" for q in questions))
check("No duplicate questions", len(questions) == len(set(q["question"] for q in questions)))
check("Respects HR question count limit", sum(1 for q in questions if q["type"] == "HR") <= 3)

print()
print("=" * 70)
print("10. EDGE CASES / ROBUSTNESS")
print("=" * 70)
check("Empty resume text doesn't crash extract_skills", ai.extract_skills("") == [])
check("Empty JD doesn't crash analyze_skills",
      ai.analyze_skills({"resume_text": "Python developer"}, "")["Skill Match Percentage"] == 100)
check("Empty resume doesn't crash education_score",
      ai.education_score({"education": "Not Mentioned"}, jd) >= 0)
check("Very short resume doesn't crash experience_score",
      ai.experience_score({"resume_text": "Hi"}, jd) >= 0)
check("Unicode/special characters don't crash extract_skills",
      isinstance(ai.extract_skills("Python développeur — 5+ años de experiencia 中文"), list))

print()
print("=" * 70)
print(f"RESULTS: {passed} passed, {failed} failed out of {passed + failed} checks")
print("=" * 70)
sys.exit(1 if failed else 0)
