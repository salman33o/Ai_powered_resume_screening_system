import streamlit as st
import pandas as pd
import plotly.graph_objects as go

import auth
import database as db
import ai_engine as ai
from report_generator import generate_pdf_report
import ui_kit as ui
from ui_kit import (render_candidate_header, render_skill_chips, render_verdict_badge,
                     render_question_card, verdict_tier, NAVY, MUTED)

CANDIDATE_COLS = ["ID", "Name", "Email", "Phone", "Education", "ATS Score", "Semantic", "Skill",
                  "Education Score", "Experience", "Matched Skills", "Missing Skills", "Verdict",
                  "User ID", "Company Name", "Job Posting ID", "Recruiter ID", "Stage", "Upload Date"]


def show_candidate_portal(user):
    ui.inject_css()
    st.title("Resume Analyzer")
    st.caption(f"Welcome, {user['email']} — check your resume against any job description.")

    tab_analyze, tab_history = st.tabs(["Analyze My Resume", "My Past Results"])
    with tab_analyze:
        _analyze_tab(user)
    with tab_history:
        _history_tab(user)


def _analyze_tab(user):
    resume = st.file_uploader("Upload Your Resume (PDF or DOCX)", type=["pdf", "docx"])
    job_description = st.text_area(
        "Paste the Job Description you're applying to", height=180,
        help="Your resume is scored against this specific job description, just like a recruiter's ATS would.")

    if not st.button("Analyze My Resume"):
        return

    if resume is None:
        st.error("Please upload your resume.")
        st.stop()
    if job_description.strip() == "":
        st.error("Please paste the job description.")
        st.stop()

    with st.spinner("Analyzing your resume..."):
        candidate = ai.parse_resume(resume)
        skill_report = ai.analyze_skills(candidate, job_description)
        ats_result = ai.calculate_ats_score(candidate, job_description, skill_report)
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
            title={"text": "Your ATS Match Score", "font": {"size": 15, "color": MUTED}}))
        gauge.update_layout(height=230, margin=dict(l=20, r=20, t=40, b=10), paper_bgcolor="rgba(0,0,0,0)")
        st.plotly_chart(gauge, use_container_width=True)

    skill_col1, skill_col2 = st.columns(2)
    with skill_col1:
        st.markdown(f'<div class="arp-card"><h4>Skills You Have That Match</h4>'
                     f'{render_skill_chips(skill_report["Matched Skills"], "matched")}</div>', unsafe_allow_html=True)
    with skill_col2:
        st.markdown(f'<div class="arp-card"><h4>Skills You\'re Missing</h4>'
                     f'{render_skill_chips(skill_report["Missing Skills"], "missing")}</div>', unsafe_allow_html=True)

    st.markdown('<div class="arp-section-label">Practice Interview Questions</div>', unsafe_allow_html=True)
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

    db.save_candidate(candidate, ats_result, skill_report, user_id=user["id"])
    pdf_file = generate_pdf_report(candidate, ats_result, skill_report, questions)

    st.markdown("---")
    with open(pdf_file, "rb") as pdf:
        st.download_button("Download My ATS Report", data=pdf,
                            file_name=f"{candidate['name'].replace(' ', '_')}_ATS_Report.pdf", mime="application/pdf")


def _history_tab(user):
    rows = db.get_candidates_by_user(user["id"])
    if not rows:
        st.info("You haven't analyzed a resume yet. Use the 'Analyze My Resume' tab to get started.")
        return

    st.caption(f"Showing your {len(rows)} most recent analyses. Only you can see this.")
    df = pd.DataFrame(rows, columns=CANDIDATE_COLS)
    display_df = df[["Upload Date", "ATS Score", "Verdict", "Matched Skills", "Missing Skills"]]

    st.dataframe(display_df, use_container_width=True, hide_index=True,
                 column_config={"ATS Score": st.column_config.ProgressColumn("ATS Score", min_value=0, max_value=100, format="%.1f%%")})

    st.markdown("---")
    with st.expander("Delete my data"):
        st.warning("This permanently deletes every resume analysis tied to your account, and your account itself. "
                   "This can't be undone.")
        confirm = st.checkbox("I understand this is permanent and want to delete all my data.", key="confirm_delete")

        if st.button("Delete My Data", disabled=not confirm, key="delete_data_btn"):
            deleted = db.delete_candidate_data_for_user(user["id"])
            auth.delete_user(user["id"])
            st.session_state["user"] = None
            st.success(f"Deleted {deleted} record(s) and your account. You'll be logged out now.")
            st.rerun()
