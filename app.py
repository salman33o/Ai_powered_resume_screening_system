import streamlit as st

import auth
import database as db
import ui_kit as ui
from recruiter_app import (needs_onboarding, show_onboarding_form, show_analyzer,
                            show_bulk_screening, show_job_postings, show_pipeline_board, show_dashboard)
from candidate_app import show_candidate_portal

db.init_db()
auth.init_db()

st.set_page_config(page_title="Resume Analyzer", layout="wide")

st.session_state.setdefault("user", None)

if st.session_state["user"] is None:
    ui.show_login_screen()
    st.stop()

user = st.session_state["user"]
ui.inject_css()

if needs_onboarding(user):
    show_onboarding_form(user)
    st.stop()

st.sidebar.markdown("## Resume Analyzer")

if user["role"] == "recruiter":
    profile = auth.get_recruiter_profile(user["id"])
    st.sidebar.caption(f"**{profile['company_name']}** · {user['username']}" if profile
                        else f"Signed in as **{user['username']}**")
else:
    st.sidebar.caption(f"Signed in as **{user['username']}**")

st.sidebar.markdown("---")

nav_options = (["ATS Analyzer", "Bulk Screening", "Job Postings", "Pipeline Board", "Recruiter Dashboard", "About"]
               if user["role"] == "recruiter" else ["My Resume Analyzer"])
page = st.sidebar.radio("Navigate", nav_options, label_visibility="collapsed")

st.sidebar.markdown("---")
if st.sidebar.button("Log Out", use_container_width=True):
    st.session_state["user"] = None
    st.rerun()

if user["role"] == "candidate":
    show_candidate_portal(user)
    st.stop()

# ---- Recruiter pages ----

if page == "Bulk Screening":
    show_bulk_screening(user)
elif page == "Job Postings":
    profile = auth.get_recruiter_profile(user["id"])
    show_job_postings(user, profile["company_name"] if profile else user["username"])
elif page == "Pipeline Board":
    profile = auth.get_recruiter_profile(user["id"])
    show_pipeline_board(user, profile["company_name"] if profile else user["username"])
elif page == "Recruiter Dashboard":
    show_dashboard(user)
elif page == "About":
    st.title("Resume Analyzer")
    st.caption("Hybrid BERT + Rule-Based ATS Engine")
    st.markdown("""
    <div class="arp-card"><h4>Features</h4>
    Resume Upload & Parsing (PDF/DOCX) &nbsp;&nbsp; Hybrid ATS Score (BERT + Rule-Based)
    &nbsp;&nbsp; 9-Category Skill Matching with Synonym Resolution
    &nbsp;&nbsp; AI Hiring Verdict & Feedback &nbsp;&nbsp; AI Interview Questions
    &nbsp;&nbsp; Bulk Screening &nbsp;&nbsp; Job Postings & Hiring Pipeline
    &nbsp;&nbsp; PDF Reports &nbsp;&nbsp; Recruiter Analytics Dashboard
    &nbsp;&nbsp; Role-Based Login (Recruiter / Candidate)
    <br><br><b>Stack:</b> Python · Streamlit · Sentence-BERT · NLTK · SQLite · ReportLab · Plotly
    </div>
    """, unsafe_allow_html=True)
else:
    show_analyzer(user)
