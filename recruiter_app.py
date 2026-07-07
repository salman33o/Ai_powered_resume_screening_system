import streamlit as st
import pandas as pd
import plotly.graph_objects as go
from datetime import datetime
from collections import Counter
import os

import auth
import database as db
import ai_engine as ai
from report_generator import generate_pdf_report
import ui_kit as ui
from ui_kit import (render_candidate_header, render_skill_chips, render_verdict_badge,
                     render_question_card, render_kpi_card, render_glass_kpi,
                     verdict_tier, NAVY, TEAL, MUTED)

BULK_MAX_FILES = int(os.environ.get("BULK_SCREENING_MAX_FILES", 300))

CANDIDATE_COLS = ["ID", "Name", "Email", "Phone", "Education", "ATS Score", "Semantic", "Skill",
                  "Education Score", "Experience", "Matched Skills", "Missing Skills", "Verdict",
                  "User ID", "Company Name", "Job Posting ID", "Recruiter ID", "Stage", "Upload Date"]

STAGE_COLORS = {"Screened": "#64748B", "Shortlisted": "#0EA5A4", "Interview Scheduled": "#B45309",
                 "Interviewed": "#7C3AED", "Offer Extended": "#0891B2", "Hired": "#15803D", "Rejected": "#B91C1C"}

VERDICT_COLORS = {"Strong Fit — Highly Recommended for Interview": "#15803D",
                   "Good Fit — Recommended for Interview": "#0EA5A4",
                   "Moderate Fit — Consider with Reservations": "#B45309",
                   "Weak Fit — Not Recommended at This Time": "#B91C1C"}

JD_TEMPLATES = {
    "Data Science / AI": ("We are hiring a Data Scientist with 3+ years of experience.\n"
        "Required: Python, SQL, Machine Learning, Deep Learning, Docker, Kubernetes, AWS. "
        "Bachelor's degree required.\n\nResponsibilities: build and deploy ML models into "
        "production, analyze large datasets, and present findings to stakeholders."),
    "Software Engineering": ("We are hiring a Software Engineer with 2+ years of experience.\n"
        "Required: Python or Java, SQL, Git, REST API, Docker. Bachelor's degree required.\n\n"
        "Responsibilities: design, build, and maintain backend services; write clean, tested, "
        "production-quality code."),
    "DevOps / Cloud": ("We are hiring a DevOps Engineer with 3+ years of experience.\n"
        "Required: AWS or Azure, Docker, Kubernetes, CI/CD, Terraform, Linux. Bachelor's degree "
        "preferred.\n\nResponsibilities: manage cloud infrastructure, build deployment pipelines, "
        "and ensure system reliability."),
    "Business Analytics": ("We are hiring a Business/Data Analyst with 2+ years of experience.\n"
        "Required: SQL, Excel, Power BI or Tableau, Data Analysis, Communication. Bachelor's "
        "degree required.\n\nResponsibilities: build dashboards, analyze business metrics, and "
        "present insights to leadership."),
    "General / Other": ("We are hiring for a role requiring strong technical fundamentals and "
        "2+ years of relevant experience. Bachelor's degree required.\n\nPlease customize this "
        "template with your specific role requirements."),
}


def _company_for(user):
    profile = auth.get_recruiter_profile(user["id"])
    return (profile["company_name"] if profile else user["username"]), profile


# =========================== Onboarding ===========================

def needs_onboarding(user):
    return user["role"] == "recruiter" and not auth.has_recruiter_profile(user["id"])


def show_onboarding_form(user):
    ui.inject_css()
    st.title("Welcome to Resume Analyzer")
    st.caption("Quick one-time setup — personalizes your dashboard and gives you a matching JD template.")

    _, center, _ = st.columns([1, 1.6, 1])
    with center:
        st.markdown('<div class="arp-card">', unsafe_allow_html=True)
        with st.form("onboarding_form"):
            hiring_as = st.radio("Hiring as:", auth.HIRING_AS_TYPES, horizontal=True)
            company_name = st.text_input("Company Name", placeholder="e.g. Acme Corp")
            hiring_roles = st.text_input("What roles are you typically hiring for?",
                                          placeholder="e.g. Data Scientist, ML Engineer")
            jd_type = st.selectbox("What type of job description do you usually write?", auth.JD_TYPES)

            if st.form_submit_button("Continue to Dashboard", use_container_width=True):
                try:
                    auth.save_recruiter_profile(user["id"], company_name, hiring_roles, jd_type, hiring_as=hiring_as)
                    st.success("Profile saved!")
                    st.rerun()
                except ValueError as e:
                    st.error(str(e))
        st.markdown('</div>', unsafe_allow_html=True)


# =========================== ATS Analyzer ===========================

def show_analyzer(user):
    ui.inject_css()
    st.title("Resume Analyzer")

    company_name, profile = _company_for(user)
    st.caption(f"{company_name} — upload a resume and a job description for an instant hybrid AI evaluation."
               if profile else "Upload a resume and a job description for an instant hybrid AI evaluation.")

    open_postings = db.get_job_postings(company_name, status="Open")
    selected_posting_id = None

    col_a, col_b = st.columns(2)

    with col_a:
        resume = st.file_uploader("Upload Resume (PDF or DOCX)", type=["pdf", "docx"])

        if open_postings:
            labels = {"— Paste JD manually —": None, **{p["title"]: p["id"] for p in open_postings}}
            choice = st.selectbox("Or screen against an open Job Posting", list(labels.keys()))
            selected_posting_id = labels[choice]
            if selected_posting_id:
                st.session_state["jd_prefill"] = next(p for p in open_postings if p["id"] == selected_posting_id)["jd_text"]

    with col_b:
        if profile and profile["jd_type"] in JD_TEMPLATES:
            if st.button(f"Use my {profile['jd_type']} JD template"):
                st.session_state["jd_prefill"] = JD_TEMPLATES[profile["jd_type"]]

        job_description = st.text_area("Paste Job Description", height=180,
                                        value=st.session_state.get("jd_prefill", ""))

    if not st.button("Analyze Resume"):
        return

    if resume is None:
        st.error("Please upload a resume.")
        st.stop()
    if job_description.strip() == "":
        st.error("Please enter the Job Description.")
        st.stop()

    with st.spinner("Running BERT semantic analysis and skill matching..."):
        candidate = ai.parse_resume(resume)
        skill_report = ai.analyze_skills(candidate, job_description)

        weights = None
        if selected_posting_id:
            p = next(p for p in open_postings if p["id"] == selected_posting_id)
            weights = {"semantic": p["semantic_weight"], "skill": p["skill_weight"],
                       "experience": p["experience_weight"], "education": p["education_weight"]}

        ats_result = ai.calculate_ats_score(candidate, job_description, skill_report, weights=weights)
        score = ats_result["Final Score"]
        questions = ai.generate_interview_questions(skill_report["Matched Skills"])

    st.markdown("---")
    top_left, top_right = st.columns([1.4, 1])

    with top_left:
        st.markdown(f'<div class="arp-card">{render_candidate_header(candidate)}'
                     f'{render_verdict_badge(score)}<br>'
                     f'<p style="color:{MUTED}; font-size:14.5px; margin-top:10px; white-space:pre-line;">'
                     f'{ats_result["AI Feedback"]}</p></div>', unsafe_allow_html=True)

    with top_right:
        _, color, _ = verdict_tier(score)
        gauge = go.Figure(go.Indicator(
            mode="gauge+number", value=score, number={"suffix": "%", "font": {"size": 40, "color": NAVY}},
            gauge={"axis": {"range": [0, 100], "tickcolor": MUTED}, "bar": {"color": color, "thickness": 0.28},
                   "bgcolor": "white", "borderwidth": 0,
                   "steps": [{"range": [0, 50], "color": "#FEE2E2"}, {"range": [50, 70], "color": "#FEF3C7"},
                             {"range": [70, 85], "color": "#CCFBF1"}, {"range": [85, 100], "color": "#DCFCE7"}]},
            title={"text": "Overall ATS Score", "font": {"size": 15, "color": MUTED}}))
        gauge.update_layout(height=230, margin=dict(l=20, r=20, t=40, b=10), paper_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(gauge, use_container_width=True)

    st.markdown('<div class="arp-section-label">Score Breakdown</div>', unsafe_allow_html=True)
    labels = ["Semantic (BERT)", "Skill Match", "Experience", "Education"]
    values = [ats_result["Semantic Score"], ats_result["Skill Score"], ats_result["Experience Score"], ats_result["Education Score"]]
    weight_labels = ["40% weight", "35% weight", "15% weight", "10% weight"]

    bar = go.Figure(go.Bar(x=values, y=labels, orientation="h", marker_color=TEAL,
                            text=[f"{v}%  ({w})" for v, w in zip(values, weight_labels)], textposition="outside"))
    bar.update_layout(height=240, margin=dict(l=10, r=10, t=10, b=10),
                       xaxis=dict(range=[0, 110], showgrid=False, visible=False),
                       yaxis=dict(autorange="reversed"), plot_bgcolor="rgba(0,0,0,0)",
                       paper_bgcolor="rgba(0,0,0,0)", font=dict(color=NAVY))
    st.plotly_chart(bar, use_container_width=True)

    skill_col1, skill_col2 = st.columns(2)
    with skill_col1:
        st.markdown(f'<div class="arp-card"><h4>Matched Skills</h4>'
                     f'{render_skill_chips(skill_report["Matched Skills"], "matched")}</div>', unsafe_allow_html=True)
    with skill_col2:
        st.markdown(f'<div class="arp-card"><h4>Missing Skills</h4>'
                     f'{render_skill_chips(skill_report["Missing Skills"], "missing")}</div>', unsafe_allow_html=True)

    with st.expander("View skills by category"):
        for category, skills in skill_report["Resume Skills By Category"].items():
            if skills:
                st.markdown(f"**{category}:** " + ", ".join(skills))

    st.markdown('<div class="arp-section-label">AI-Generated Interview Questions</div>', unsafe_allow_html=True)
    q_col1, q_col2 = st.columns(2)
    with q_col1:
        st.caption("Technical")
        for q in questions:
            if q["type"] != "HR":
                st.markdown(render_question_card(q), unsafe_allow_html=True)
    with q_col2:
        st.caption("HR")
        for q in questions:
            if q["type"] == "HR":
                st.markdown(render_question_card(q), unsafe_allow_html=True)

    db.save_candidate(candidate, ats_result, skill_report, company_name=company_name,
                       job_posting_id=selected_posting_id, recruiter_id=user["id"])
    pdf_file = generate_pdf_report(candidate, ats_result, skill_report, questions)

    st.markdown("---")
    footer1, footer2 = st.columns([3, 1])
    with footer1:
        st.success("Candidate saved to the recruiter dashboard.")
    with footer2:
        with open(pdf_file, "rb") as pdf:
            st.download_button("Download PDF Report", data=pdf,
                                file_name=f"{candidate['name'].replace(' ', '_')}_ATS_Report.pdf",
                                mime="application/pdf", use_container_width=True)


# =========================== Bulk Screening ===========================

def show_bulk_screening(user):
    ui.inject_css()
    st.title("Bulk Resume Screening")
    st.caption(f"Upload up to {BULK_MAX_FILES} resumes at once, scored against one job description and auto-ranked.")

    company_name, _ = _company_for(user)
    open_postings = db.get_job_postings(company_name, status="Open")
    selected_posting_id = None

    if open_postings:
        labels = {"— Paste JD manually —": None, **{p["title"]: p["id"] for p in open_postings}}
        choice = st.selectbox("Screen against an open Job Posting (optional)", list(labels.keys()))
        selected_posting_id = labels[choice]
        if selected_posting_id:
            st.session_state["bulk_jd_prefill"] = next(p for p in open_postings if p["id"] == selected_posting_id)["jd_text"]

    job_description = st.text_area("Job Description", height=180, key="bulk_jd",
                                    value=st.session_state.get("bulk_jd_prefill", ""))

    uploaded_files = st.file_uploader("Upload Resumes (PDF or DOCX) — select multiple files",
                                       type=["pdf", "docx"], accept_multiple_files=True)

    if uploaded_files and len(uploaded_files) > BULK_MAX_FILES:
        st.error(f"You selected {len(uploaded_files)} files. Max per batch is {BULK_MAX_FILES}.")
        st.stop()

    if uploaded_files:
        st.caption(f"{len(uploaded_files)} resume(s) ready.")

    if st.button("Run Bulk Screening", disabled=not uploaded_files):
        if job_description.strip() == "":
            st.error("Please enter the Job Description.")
            st.stop()
        _run_bulk_batch(uploaded_files, job_description, user, company_name, selected_posting_id)

    if "bulk_results" in st.session_state:
        _render_bulk_results(st.session_state["bulk_results"])


def _run_bulk_batch(uploaded_files, job_description, user, company_name, job_posting_id):
    progress = st.progress(0, text="Parsing resumes...")
    candidates, skill_reports, failed = [], [], []
    total = len(uploaded_files)

    for i, file in enumerate(uploaded_files):
        try:
            candidate = ai.parse_resume(file)
            skill_report = ai.analyze_skills(candidate, job_description)
            candidates.append(candidate)
            skill_reports.append(skill_report)
        except Exception as e:
            failed.append((file.name, str(e)))
        progress.progress((i + 1) / total, text=f"Parsing resume {i + 1} of {total}...")

    if not candidates:
        progress.empty()
        st.error("None of the uploaded files could be parsed.")
        return

    progress.progress(1.0, text="Running batched BERT semantic scoring...")

    weights = None
    if job_posting_id:
        posting = db.get_job_posting(job_posting_id)
        if posting:
            weights = {"semantic": posting["semantic_weight"], "skill": posting["skill_weight"],
                       "experience": posting["experience_weight"], "education": posting["education_weight"]}

    ats_results = ai.bulk_calculate_ats_scores(candidates, job_description, skill_reports, weights=weights)
    progress.progress(1.0, text="Saving results...")

    rows = []
    for candidate, ats_result, skill_report in zip(candidates, ats_results, skill_reports):
        db.save_candidate(candidate, ats_result, skill_report, company_name=company_name,
                           job_posting_id=job_posting_id, recruiter_id=user["id"])
        rows.append({"Name": candidate["name"], "Email": candidate["email"], "Phone": candidate["phone"],
                     "Education": candidate["education"], "ATS Score": ats_result["Final Score"],
                     "Verdict": ats_result["Verdict"], "Matched Skills": ", ".join(skill_report["Matched Skills"]),
                     "Missing Skills": ", ".join(skill_report["Missing Skills"])})

    progress.empty()
    if failed:
        with st.expander(f"{len(failed)} file(s) failed to process"):
            for name, err in failed:
                st.write(f"**{name}**: {err}")

    result_df = pd.DataFrame(rows).sort_values(by="ATS Score", ascending=False).reset_index(drop=True)
    result_df.insert(0, "Rank", range(1, len(result_df) + 1))
    st.session_state["bulk_results"] = result_df
    st.success(f"Screened {len(rows)} candidate(s).")


def _render_bulk_results(result_df):
    st.markdown("---")
    st.markdown('<div class="arp-section-label">Screening Results</div>', unsafe_allow_html=True)

    perfect = result_df[result_df["ATS Score"] >= 85]
    good = result_df[(result_df["ATS Score"] >= 70) & (result_df["ATS Score"] < 85)]

    k1, k2, k3 = st.columns(3)
    with k1:
        st.markdown(render_kpi_card("Candidates Screened", len(result_df)), unsafe_allow_html=True)
    with k2:
        st.markdown(render_kpi_card("Perfect Matches (85%+)", len(perfect)), unsafe_allow_html=True)
    with k3:
        st.markdown(render_kpi_card("Good Matches (70-84%)", len(good)), unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    if len(perfect) > 0:
        st.markdown('<div class="arp-section-label">Perfect Matches — Interview First</div>', unsafe_allow_html=True)
        for _, row in perfect.head(10).iterrows():
            matched = row["Matched Skills"].split(", ") if row["Matched Skills"] else []
            st.markdown(f'<div class="arp-card"><b>#{row["Rank"]} &nbsp; {row["Name"]}</b>'
                         f'<span style="color:#64748B; font-size:13.5px;"> &nbsp;·&nbsp; {row["Email"]} &nbsp;·&nbsp; {row["Phone"]}</span><br><br>'
                         f'{render_verdict_badge(row["ATS Score"])}<br>{render_skill_chips(matched, "matched")}</div>',
                         unsafe_allow_html=True)

    st.markdown('<div class="arp-section-label">Ranking (Top 15)</div>', unsafe_allow_html=True)
    top_n = result_df.head(15).iloc[::-1]
    fig = go.Figure(go.Bar(x=top_n["ATS Score"], y=top_n["Name"], orientation="h",
                            marker_color=[verdict_tier(s)[1] for s in top_n["ATS Score"]],
                            text=[f"{v}%" for v in top_n["ATS Score"]], textposition="outside"))
    fig.update_layout(height=max(300, 28 * len(top_n)), margin=dict(l=10, r=10, t=10, b=10),
                       xaxis=dict(range=[0, 110], showgrid=False, visible=False),
                       plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)", font=dict(color=NAVY))
    st.plotly_chart(fig, use_container_width=True)

    st.markdown('<div class="arp-section-label">Full Ranked List</div>', unsafe_allow_html=True)
    st.dataframe(result_df, use_container_width=True, hide_index=True,
                 column_config={"ATS Score": st.column_config.ProgressColumn("ATS Score", min_value=0, max_value=100, format="%.1f%%")})

    csv = result_df.to_csv(index=False)
    st.download_button("Download Full Ranking (CSV)", data=csv,
                        file_name=f"Bulk_Screening_Ranking_{datetime.now().strftime('%Y%m%d_%H%M')}.csv", mime="text/csv")


# =========================== Job Postings ===========================

def show_job_postings(user, company_name):
    ui.inject_css()
    st.markdown(f'<div class="arp-hero"><h1 style="margin-bottom:4px;">Job Postings</h1>'
                 f'<p>{company_name} — manage the open roles your team is hiring for.</p></div>', unsafe_allow_html=True)

    tab_open, tab_closed, tab_create = st.tabs(["Open Postings", "Closed Postings", "+ Create New"])
    with tab_open:
        _postings_list(company_name, "Open")
    with tab_closed:
        _postings_list(company_name, "Closed")
    with tab_create:
        _postings_create_form(user, company_name)


def _postings_list(company_name, status):
    postings = db.get_job_postings(company_name, status=status)
    if not postings:
        st.info(f"No {status.lower()} job postings yet.")
        return

    for posting in postings:
        st.markdown('<div class="arp-glass-card">', unsafe_allow_html=True)
        header_col, action_col = st.columns([4, 1])
        with header_col:
            dept = f" · {posting['department']}" if posting["department"] else ""
            st.markdown(f"### {posting['title']}{dept}")
            st.caption(f"Posted {posting['created_at']}")
        with action_col:
            if status == "Open":
                if st.button("Close Posting", key=f"close_{posting['id']}"):
                    db.close_job_posting(posting["id"])
                    st.rerun()
            elif st.button("Reopen", key=f"reopen_{posting['id']}"):
                db.reopen_job_posting(posting["id"])
                st.rerun()
        with st.expander("View job description"):
            st.write(posting["jd_text"])
        st.markdown('</div>', unsafe_allow_html=True)


def _postings_create_form(user, company_name):
    st.markdown('<div class="arp-glass-card">', unsafe_allow_html=True)
    with st.form("create_job_posting_form"):
        title = st.text_input("Job Title", placeholder="e.g. Senior Data Scientist")
        department = st.text_input("Department (optional)")
        jd_text = st.text_area("Job Description", height=220)

        st.caption("Scoring weights (must add up to 100)")
        w1, w2, w3, w4 = st.columns(4)
        semantic_w = w1.number_input("Semantic %", 0, 100, 40, step=5)
        skill_w = w2.number_input("Skill %", 0, 100, 35, step=5)
        experience_w = w3.number_input("Experience %", 0, 100, 15, step=5)
        education_w = w4.number_input("Education %", 0, 100, 10, step=5)

        total = semantic_w + skill_w + experience_w + education_w
        if total != 100:
            st.caption(f"Current total: {total} (needs to be 100)")

        if st.form_submit_button("Create Job Posting", use_container_width=True):
            try:
                db.create_job_posting(company_name, title, jd_text, user["id"], department=department or None,
                                       semantic_weight=semantic_w, skill_weight=skill_w,
                                       experience_weight=experience_w, education_weight=education_w)
                st.success(f"Job posting '{title}' created.")
                st.rerun()
            except ValueError as e:
                st.error(str(e))
    st.markdown('</div>', unsafe_allow_html=True)


# =========================== Pipeline Board ===========================

def show_pipeline_board(user, company_name):
    ui.inject_css()
    st.markdown(f'<div class="arp-hero"><h1 style="margin-bottom:4px;">Hiring Pipeline</h1>'
                 f'<p>{company_name} — move candidates through the hiring process.</p></div>', unsafe_allow_html=True)

    filter_col, search_col = st.columns([1, 2])
    stage_filter = filter_col.selectbox("Filter by stage", ["All Stages"] + db.STAGES)
    search = search_col.text_input("Search by name or email")

    rows = db.search_candidate_in_company(company_name, search) if search.strip() else db.get_candidates_by_company(company_name)
    if not rows:
        st.info("No candidates in your pipeline yet.")
        return

    df = pd.DataFrame(rows, columns=CANDIDATE_COLS)
    if stage_filter != "All Stages":
        df = df[df["Stage"] == stage_filter]
    if len(df) == 0:
        st.warning(f"No candidates currently in the '{stage_filter}' stage.")
        return

    export_df = df.drop(columns=["User ID", "Company Name", "Job Posting ID", "Recruiter ID"])
    st.download_button("Export Pipeline (CSV)", data=export_df.to_csv(index=False),
                        file_name=f"{company_name}_pipeline.csv", mime="text/csv")

    stages_to_show = [stage_filter] if stage_filter != "All Stages" else db.STAGES
    for stage in stages_to_show:
        stage_df = df[df["Stage"] == stage]
        if len(stage_df) == 0:
            continue
        color = STAGE_COLORS.get(stage, NAVY)
        st.markdown(f'<div class="arp-section-label" style="color:{color};">{stage} '
                     f'<span style="color:{MUTED}; font-weight:400;">({len(stage_df)})</span></div>', unsafe_allow_html=True)
        for _, row in stage_df.iterrows():
            _pipeline_candidate_card(row, user)
        st.markdown("<br>", unsafe_allow_html=True)


def _pipeline_candidate_card(row, user):
    candidate_id = int(row["ID"])
    st.markdown('<div class="arp-glass-card">', unsafe_allow_html=True)
    header_col, score_col, action_col = st.columns([2.5, 1, 1.5])

    with header_col:
        st.markdown(f"**{row['Name']}**")
        st.caption(f"{row['Email']} · {row['Phone']}")
    with score_col:
        _, color, _ = verdict_tier(row["ATS Score"])
        st.markdown(f"<span style='color:{color}; font-weight:700; font-size:18px;'>{row['ATS Score']}%</span>", unsafe_allow_html=True)
    with action_col:
        idx = db.STAGES.index(row["Stage"]) if row["Stage"] in db.STAGES else 0
        new_stage = st.selectbox("Move to stage", db.STAGES, index=idx, key=f"stage_{candidate_id}", label_visibility="collapsed")
        if new_stage != row["Stage"] and st.button("Update", key=f"upd_{candidate_id}", use_container_width=True):
            db.move_candidate_stage(candidate_id, new_stage, user["id"], user["username"])
            st.rerun()

    with st.expander("Notes, interviews & history"):
        _notes_section(candidate_id, user)
        st.markdown("---")
        _interview_section(candidate_id, user)
        st.markdown("---")
        _history_section(candidate_id)

    st.markdown('</div>', unsafe_allow_html=True)


def _notes_section(candidate_id, user):
    st.markdown("**Recruiter Notes & Ratings**")
    for note in db.get_candidate_notes(candidate_id):
        stars = "★" * note["rating"] if note["rating"] else ""
        st.markdown(f"*{note['author_username']}* {stars} — {note['note_text']}")
        st.caption(note["created_at"])

    with st.form(f"note_form_{candidate_id}"):
        note_text = st.text_area("Add a note", key=f"note_{candidate_id}", height=80)
        rating = st.slider("Rating (optional)", 0, 5, 0, key=f"rating_{candidate_id}")
        if st.form_submit_button("Add Note") and note_text.strip():
            db.add_candidate_note(candidate_id, user["id"], user["username"], note_text, rating=rating or None)
            st.rerun()


def _interview_section(candidate_id, user):
    st.markdown("**Interviews**")
    for iv in db.get_interviews_for_candidate(candidate_id):
        st.markdown(f"**{iv['scheduled_at']}** with {iv['interviewer_name']} — *{iv['status']}*")
        if iv["notes"]:
            st.caption(iv["notes"])

    with st.form(f"interview_form_{candidate_id}"):
        interviewer = st.text_input("Interviewer name", key=f"iv_who_{candidate_id}")
        scheduled_at = st.text_input("Date/time (e.g. 2026-07-15 14:00)", key=f"iv_when_{candidate_id}")
        notes = st.text_input("Notes (optional)", key=f"iv_notes_{candidate_id}")
        if st.form_submit_button("Schedule Interview") and interviewer.strip() and scheduled_at.strip():
            db.schedule_interview(candidate_id, interviewer, scheduled_at, user["id"], notes=notes or None)
            st.rerun()


def _history_section(candidate_id):
    st.markdown("**Audit Trail**")
    history = db.get_stage_history(candidate_id)
    if not history:
        st.caption("No stage changes yet.")
        return
    for h in history:
        st.caption(f"{h['changed_at']} — {h['changed_by_username']}: {h['from_stage'] or '—'} → {h['to_stage']}")


# =========================== Dashboard ===========================

def _verdict_short(v):
    return v.split(" — ")[0] if v else "Unknown"


def show_dashboard(user):
    ui.inject_css()
    company_name, _ = _company_for(user)

    st.markdown(f'<div class="arp-hero"><h1 style="margin-bottom:4px;">Analytics Dashboard — {company_name}</h1>'
                 f'<p>Statistical overview of every candidate screened by the ATS engine.</p></div>', unsafe_allow_html=True)

    candidates = db.get_candidates_by_company(company_name)
    if not candidates:
        st.info("No candidates analyzed yet.")
        return

    df_all = pd.DataFrame(candidates, columns=CANDIDATE_COLS)
    df_all["Upload Date"] = pd.to_datetime(df_all["Upload Date"], errors="coerce")
    scores = df_all["ATS Score"].astype(float)

    mean_score, median_score = round(scores.mean(), 2), round(scores.median(), 2)
    std_score = round(scores.std(), 2) if len(scores) > 1 else 0.0
    strong_fit = int((scores >= 85).sum())

    k1, k2, k3, k4, k5 = st.columns(5)
    k1.markdown(render_glass_kpi("Total Candidates", len(candidates)), unsafe_allow_html=True)
    k2.markdown(render_glass_kpi("Mean Score", f"{mean_score}%"), unsafe_allow_html=True)
    k3.markdown(render_glass_kpi("Median Score", f"{median_score}%"), unsafe_allow_html=True)
    k4.markdown(render_glass_kpi("Std. Deviation", f"{std_score}"), unsafe_allow_html=True)
    k5.markdown(render_glass_kpi("Strong-Fit Candidates", strong_fit), unsafe_allow_html=True)
    st.markdown("<br>", unsafe_allow_html=True)

    dist_col, box_col = st.columns(2)
    with dist_col:
        st.markdown('<div class="arp-glass-card">', unsafe_allow_html=True)
        st.markdown('<div class="arp-section-label">Score Distribution</div>', unsafe_allow_html=True)
        hist = go.Figure(go.Histogram(x=scores, nbinsx=12, marker_color=TEAL, marker_line_color=NAVY, marker_line_width=0.5))
        hist.add_vline(x=mean_score, line_dash="dash", line_color=NAVY, annotation_text=f"mean {mean_score}%")
        hist.update_layout(height=280, margin=dict(l=10, r=10, t=10, b=10), xaxis_title="ATS Score (%)",
                            yaxis_title="Candidates", plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)", font=dict(color=NAVY))
        st.plotly_chart(hist, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

    with box_col:
        st.markdown('<div class="arp-glass-card">', unsafe_allow_html=True)
        st.markdown('<div class="arp-section-label">Score Component Spread</div>', unsafe_allow_html=True)
        box = go.Figure()
        for col, label in zip(["Semantic", "Skill", "Experience", "Education Score"],
                               ["Semantic (BERT)", "Skill Match", "Experience", "Education"]):
            box.add_trace(go.Box(y=df_all[col].astype(float), name=label, marker_color=TEAL, boxmean=True))
        box.update_layout(height=280, margin=dict(l=10, r=10, t=10, b=10), yaxis_title="Score (%)", showlegend=False,
                           plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)", font=dict(color=NAVY))
        st.plotly_chart(box, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

    corr_col, skill_col = st.columns(2)
    with corr_col:
        st.markdown('<div class="arp-glass-card">', unsafe_allow_html=True)
        st.markdown('<div class="arp-section-label">Score Component Correlation</div>', unsafe_allow_html=True)
        if len(df_all) >= 3:
            corr_df = df_all[["ATS Score", "Semantic", "Skill", "Experience", "Education Score"]].astype(float)
            corr = corr_df.corr().round(2)
            heat = go.Figure(go.Heatmap(z=corr.values, x=corr.columns, y=corr.columns,
                                         colorscale=[[0, "#FEE2E2"], [0.5, "#F8FAFC"], [1, TEAL]], zmin=-1, zmax=1,
                                         text=corr.values, texttemplate="%{text}", textfont={"size": 11}))
            heat.update_layout(height=300, margin=dict(l=10, r=10, t=10, b=10), paper_bgcolor="rgba(0,0,0,0)", font=dict(color=NAVY, size=11))
            st.plotly_chart(heat, use_container_width=True)

            final_corr = corr["ATS Score"].drop("ATS Score")
            driver = final_corr.abs().idxmax()
            st.markdown(ui.render_insight_tag("AI Insight") +
                        f"<p style='font-size:13.5px; color:{MUTED}; margin-top:6px;'>"
                        f"<b>{driver}</b> correlates most strongly with the final ATS score "
                        f"(r = {final_corr[driver]}) across this candidate pool.</p>", unsafe_allow_html=True)
        else:
            st.info("Need at least 3 candidates to compute meaningful correlations.")
        st.markdown('</div>', unsafe_allow_html=True)

    with skill_col:
        st.markdown('<div class="arp-glass-card">', unsafe_allow_html=True)
        st.markdown('<div class="arp-section-label">Most In-Demand Matched Skills</div>', unsafe_allow_html=True)
        all_skills = [s.strip() for cell in df_all["Matched Skills"].dropna() for s in cell.split(",") if s.strip()]
        if all_skills:
            counts = Counter(all_skills).most_common(10)
            names, freq = [c[0] for c in counts][::-1], [c[1] for c in counts][::-1]
            skill_bar = go.Figure(go.Bar(x=freq, y=names, orientation="h", marker_color=NAVY, text=freq, textposition="outside"))
            skill_bar.update_layout(height=300, margin=dict(l=10, r=10, t=10, b=10), xaxis=dict(showgrid=False, visible=False),
                                     plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)", font=dict(color=NAVY))
            st.plotly_chart(skill_bar, use_container_width=True)
        else:
            st.info("No matched skills recorded yet.")
        st.markdown('</div>', unsafe_allow_html=True)

    trend_col, donut_col = st.columns([1.3, 1])
    with trend_col:
        st.markdown('<div class="arp-glass-card">', unsafe_allow_html=True)
        st.markdown('<div class="arp-section-label">Screening Volume Over Time</div>', unsafe_allow_html=True)
        daily = df_all.dropna(subset=["Upload Date"]).copy()
        if len(daily) >= 2 and daily["Upload Date"].dt.date.nunique() >= 2:
            daily["date"] = daily["Upload Date"].dt.date
            volume = daily.groupby("date").size().reset_index(name="count")
            trend = go.Figure(go.Scatter(x=volume["date"], y=volume["count"], mode="lines+markers",
                                          line=dict(color=TEAL, width=3), marker=dict(size=7, color=NAVY),
                                          fill="tozeroy", fillcolor="rgba(14,165,164,0.15)"))
            trend.update_layout(height=260, margin=dict(l=10, r=10, t=10, b=10), xaxis_title="Date",
                                 yaxis_title="Candidates Screened", plot_bgcolor="rgba(0,0,0,0)",
                                 paper_bgcolor="rgba(0,0,0,0)", font=dict(color=NAVY))
            st.plotly_chart(trend, use_container_width=True)
        else:
            st.info("Trend appears once you have candidates from at least 2 different days.")
        st.markdown('</div>', unsafe_allow_html=True)

    with donut_col:
        st.markdown('<div class="arp-glass-card">', unsafe_allow_html=True)
        st.markdown('<div class="arp-section-label">Verdict Distribution</div>', unsafe_allow_html=True)
        vc = df_all["Verdict"].apply(_verdict_short).value_counts()
        donut = go.Figure(go.Pie(labels=vc.index, values=vc.values, hole=0.55,
                                  marker=dict(colors=[VERDICT_COLORS.get(next((f for f in VERDICT_COLORS if f.startswith(l)), ""), MUTED) for l in vc.index])))
        donut.update_layout(height=260, margin=dict(l=10, r=10, t=10, b=10), paper_bgcolor="rgba(0,0,0,0)", legend=dict(orientation="h", y=-0.15))
        st.plotly_chart(donut, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    search = st.text_input("Search by Name or Email")
    candidates_to_show = db.search_candidate_in_company(company_name, search) if search.strip() else candidates
    if not candidates_to_show:
        st.warning("No candidates found.")
        return

    df = pd.DataFrame(candidates_to_show, columns=CANDIDATE_COLS)
    st.markdown('<div class="arp-section-label">Candidate Records</div>', unsafe_allow_html=True)
    display_df = df.drop(columns=["User ID", "Company Name", "Job Posting ID", "Recruiter ID"])
    st.dataframe(display_df, use_container_width=True, hide_index=True,
                 column_config={"ATS Score": st.column_config.ProgressColumn("ATS Score", min_value=0, max_value=100, format="%.1f%%"),
                                "Verdict": st.column_config.TextColumn("Verdict", width="medium")})

    st.markdown("<br>", unsafe_allow_html=True)
    st.download_button("Download Candidate Report (CSV)", data=display_df.to_csv(index=False),
                        file_name="Candidate_Report.csv", mime="text/csv")
