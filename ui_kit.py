import streamlit as st
import auth

NAVY, TEAL, MUTED, BORDER, BG = "#0F172A", "#0EA5A4", "#64748B", "#E2E8F0", "#F8FAFC"
TEAL_LIGHT, INK = "#CCFBF1", "#0F172A"
GREEN, GREEN_BG = "#15803D", "#DCFCE7"
AMBER, AMBER_BG = "#B45309", "#FEF3C7"
RED, RED_BG = "#B91C1C", "#FEE2E2"


def verdict_tier(score):
    if score >= 85:
        return ("Strong Fit", GREEN, GREEN_BG)
    if score >= 70:
        return ("Good Fit", TEAL, TEAL_LIGHT)
    if score >= 50:
        return ("Moderate Fit", AMBER, AMBER_BG)
    return ("Weak Fit", RED, RED_BG)


CUSTOM_CSS = f"""
<style>
    #MainMenu {{visibility: hidden;}}
    footer {{visibility: hidden;}}
    .stApp {{ background-color: {BG}; }}
    h1, h2, h3 {{ color: {NAVY}; font-family: 'Segoe UI', -apple-system, sans-serif; }}

    section[data-testid="stSidebar"] {{ background-color: {NAVY}; }}
    section[data-testid="stSidebar"] * {{ color: #E2E8F0 !important; }}

    .arp-card {{
        background: #FFFFFF; border: 1px solid {BORDER}; border-radius: 12px;
        padding: 22px 26px; margin-bottom: 18px; box-shadow: 0 1px 3px rgba(15,23,42,0.06);
    }}
    .arp-card h4 {{ margin-top: 0; font-size: 15px; text-transform: uppercase;
        letter-spacing: 0.04em; color: {MUTED}; font-weight: 600; }}

    .arp-kpi {{
        background: #FFFFFF; border: 1px solid {BORDER}; border-radius: 12px;
        padding: 18px 20px; box-shadow: 0 1px 3px rgba(15,23,42,0.06);
    }}
    .arp-kpi .label {{ font-size: 13px; color: {MUTED}; text-transform: uppercase;
        letter-spacing: 0.04em; font-weight: 600; margin-bottom: 6px; }}
    .arp-kpi .value {{ font-size: 30px; font-weight: 700; color: {NAVY}; }}

    .arp-candidate-header {{ display: flex; align-items: center; gap: 16px; margin-bottom: 6px; }}
    .arp-avatar {{
        width: 54px; height: 54px; border-radius: 50%;
        background: linear-gradient(135deg, {NAVY}, {TEAL}); color: white;
        display: flex; align-items: center; justify-content: center;
        font-size: 22px; font-weight: 700; flex-shrink: 0;
    }}
    .arp-candidate-name {{ font-size: 22px; font-weight: 700; color: {NAVY}; margin: 0; }}
    .arp-candidate-sub {{ font-size: 13.5px; color: {MUTED}; margin: 2px 0 0 0; }}

    .arp-chip-row {{ display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0 4px 0; }}
    .arp-chip {{ display: inline-block; padding: 5px 14px; border-radius: 999px;
        font-size: 13px; font-weight: 600; white-space: nowrap; }}
    .arp-chip-matched {{ background: {GREEN_BG}; color: {GREEN}; border: 1px solid {GREEN}; }}
    .arp-chip-missing {{ background: {RED_BG}; color: {RED}; border: 1px dashed {RED}; }}

    .arp-verdict-badge {{ display: inline-block; padding: 8px 20px; border-radius: 8px;
        font-size: 17px; font-weight: 700; margin-bottom: 10px; }}

    .arp-section-label {{ font-size: 13px; font-weight: 700; color: {MUTED};
        text-transform: uppercase; letter-spacing: 0.05em; margin: 4px 0 8px 0; }}

    .arp-question {{ border-left: 3px solid {TEAL}; background: #FFFFFF; padding: 10px 16px;
        border-radius: 0 8px 8px 0; margin-bottom: 10px; }}
    .arp-question .tag {{ font-size: 11.5px; font-weight: 700; color: {TEAL};
        text-transform: uppercase; letter-spacing: 0.03em; }}
    .arp-question .text {{ color: {INK}; font-size: 14.5px; margin-top: 3px; }}

    div[data-testid="stButton"] button {{
        background-color: {NAVY}; color: white; border-radius: 8px; border: none;
        font-weight: 600; padding: 0.55em 1.4em;
    }}
    div[data-testid="stButton"] button:hover {{ background-color: {TEAL}; color: {NAVY}; }}
    div[data-testid="stDownloadButton"] button {{
        background-color: {TEAL}; color: {NAVY}; border-radius: 8px; border: none; font-weight: 700;
    }}

    .arp-hero {{
        background: linear-gradient(135deg, {NAVY} 0%, #164E63 55%, {TEAL} 130%);
        border-radius: 18px; padding: 28px 32px; margin-bottom: 22px;
        box-shadow: 0 20px 40px -12px rgba(15,23,42,0.45); position: relative; overflow: hidden;
    }}
    .arp-hero::before {{
        content: ""; position: absolute; top: -60px; right: -60px; width: 220px; height: 220px;
        background: radial-gradient(circle, rgba(20,184,166,0.35), transparent 70%); border-radius: 50%;
    }}
    .arp-hero h1, .arp-hero p {{ color: #FFFFFF !important; position: relative; z-index: 1; }}
    .arp-hero p {{ color: #CBD5E1 !important; font-size: 14.5px; }}

    .arp-glass-card {{
        background: rgba(255,255,255,0.72); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255,255,255,0.5); border-radius: 16px; padding: 20px 22px;
        box-shadow: 0 10px 30px -10px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.6);
        transition: transform 0.18s ease; margin-bottom: 16px;
    }}
    .arp-glass-card:hover {{ transform: translateY(-3px); }}

    .arp-glass-kpi {{
        background: rgba(255,255,255,0.75); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255,255,255,0.55); border-radius: 16px; padding: 18px 20px;
        box-shadow: 0 10px 24px -8px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.6);
        border-left: 4px solid {TEAL}; transition: transform 0.18s ease;
    }}
    .arp-glass-kpi:hover {{ transform: translateY(-3px); }}
    .arp-glass-kpi .label {{ font-size: 12.5px; color: {MUTED}; text-transform: uppercase;
        letter-spacing: 0.05em; font-weight: 700; margin-bottom: 6px; }}
    .arp-glass-kpi .value {{
        font-size: 28px; font-weight: 800; background: linear-gradient(135deg, {NAVY}, {TEAL});
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }}

    .arp-insight-tag {{
        display: inline-block; background: linear-gradient(135deg, {TEAL}, #0891B2); color: white;
        font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
        padding: 3px 10px; border-radius: 999px; margin-bottom: 8px;
    }}
</style>
"""


def inject_css():
    st.markdown(CUSTOM_CSS, unsafe_allow_html=True)


def render_candidate_header(candidate):
    initial = candidate["name"][0].upper() if candidate["name"] else "?"
    return f"""<div class="arp-candidate-header"><div class="arp-avatar">{initial}</div>
        <div><p class="arp-candidate-name">{candidate['name']}</p>
        <p class="arp-candidate-sub">{candidate['email']} &nbsp;·&nbsp; {candidate['phone']} &nbsp;·&nbsp; {candidate['education']}</p>
        </div></div>"""


def render_skill_chips(skills, kind="matched"):
    if not skills:
        return f'<p style="color:{MUTED}; font-size:13.5px;">None</p>'
    css_class = "arp-chip-matched" if kind == "matched" else "arp-chip-missing"
    icon = "✓" if kind == "matched" else "✕"
    chips = "".join(f'<span class="arp-chip {css_class}">{icon} {s}</span>' for s in skills)
    return f'<div class="arp-chip-row">{chips}</div>'


def render_verdict_badge(score):
    label, color, bg = verdict_tier(score)
    return f'<span class="arp-verdict-badge" style="background:{bg}; color:{color};">{label} — {score}%</span>'


def render_kpi_card(label, value):
    return f'<div class="arp-kpi"><div class="label">{label}</div><div class="value">{value}</div></div>'


def render_glass_kpi(label, value):
    return f'<div class="arp-glass-kpi"><div class="label">{label}</div><div class="value">{value}</div></div>'


def render_insight_tag(text):
    return f'<span class="arp-insight-tag">{text}</span>'


def render_question_card(q):
    return f'<div class="arp-question"><div class="tag">{q["type"]} · {q["difficulty"]}</div><div class="text">{q["question"]}</div></div>'


# =========================== Help Assistant (FAQ) ===========================

FAQ_MENUS = {
    "main": {
        "prompt": "Hey! I'm here to help you get started with Resume Analyzer. Choose an option below:",
        "options": ["I'm a Recruiter", "I'm a Candidate", "How does the AI scoring work?"],
    },
    "I'm a Recruiter": {
        "prompt": ("As a recruiter:\n\n1. Sign up on the **Recruiter** tab\n"
                   "2. First login asks your company name, roles you hire for, and JD type\n"
                   "3. Use **ATS Analyzer** for one resume, or **Bulk Screening** for many at once\n"
                   "4. Check the **Recruiter Dashboard** for rankings and analytics\n\n"
                   "Every candidate you screen is scoped to your company only."),
        "options": ["Back to Main Menu"],
    },
    "I'm a Candidate": {
        "prompt": ("As a candidate, no password needed:\n\n1. Enter your email\n"
                   "2. Upload your resume and paste the job description\n"
                   "3. Get your match score, skill gaps, and practice interview questions\n\n"
                   "Only you can see your own results."),
        "options": ["Back to Main Menu"],
    },
    "How does the AI scoring work?": {
        "prompt": ("**Final Score = 40% Semantic + 35% Skill Match + 15% Experience + 10% Education**\n\n"
                   "Semantic similarity uses Sentence-BERT to compare meaning, not just keywords. "
                   "Skill matching checks a 110-skill database with synonym resolution "
                   "(e.g. 'ML' = 'Machine Learning')."),
        "options": ["Back to Main Menu"],
    },
}


def show_help_assistant():
    st.session_state.setdefault("help_chat", [("assistant", FAQ_MENUS["main"]["prompt"])])
    st.session_state.setdefault("help_menu", "main")

    for role, msg in st.session_state["help_chat"]:
        with st.chat_message(role):
            st.markdown(msg)

    menu = FAQ_MENUS[st.session_state["help_menu"]]
    cols = st.columns(len(menu["options"]))
    for i, option in enumerate(menu["options"]):
        with cols[i]:
            if st.button(option, key=f"help_{st.session_state['help_menu']}_{option}", use_container_width=True):
                st.session_state["help_chat"].append(("user", option))
                target = "main" if option == "Back to Main Menu" else option
                st.session_state["help_menu"] = target
                st.session_state["help_chat"].append(("assistant", FAQ_MENUS[target]["prompt"]))
                st.rerun()


# =========================== Login Screen ===========================

ENTRY_GREETING = "Hi! Are you a candidate checking your resume, or a recruiter looking to hire?"
ENTRY_OPTIONS = ["I'm a Candidate", "I'm a Recruiter"]
ENTRY_INTENT = {"I'm a Candidate": "candidate", "I'm a Recruiter": "recruiter"}
ENTRY_CONFIRM = {
    "candidate": "Great — no password needed, just your email below.",
    "recruiter": "Great — log in below, or sign up if this is your first time.",
}


def _entry_assistant():
    st.session_state.setdefault("entry_chat", [("assistant", ENTRY_GREETING)])
    st.session_state.setdefault("login_intent", None)

    for role, msg in st.session_state["entry_chat"]:
        with st.chat_message(role):
            st.markdown(msg)

    if st.session_state["login_intent"] is None:
        cols = st.columns(len(ENTRY_OPTIONS))
        for i, option in enumerate(ENTRY_OPTIONS):
            with cols[i]:
                if st.button(option, key=f"entry_{option}", use_container_width=True):
                    intent = ENTRY_INTENT[option]
                    st.session_state["entry_chat"].append(("user", option))
                    st.session_state["entry_chat"].append(("assistant", ENTRY_CONFIRM[intent]))
                    st.session_state["login_intent"] = intent
                    st.rerun()
    else:
        if st.button("← Not you? Choose again", key="entry_reset"):
            st.session_state["login_intent"] = None
            st.session_state["entry_chat"] = [("assistant", ENTRY_GREETING)]
            st.rerun()


def show_login_screen():
    inject_css()

    st.markdown("""<div style="text-align:center; margin-top:30px; margin-bottom:10px;">
        <h1 style="margin-bottom:0;">Resume Analyzer</h1>
        <p style="color:#64748B;">Hybrid AI ATS Engine — sign in to continue</p></div>""",
        unsafe_allow_html=True)

    _, center, _ = st.columns([1, 1.4, 1])

    with center:
        st.markdown('<div class="arp-card">', unsafe_allow_html=True)
        _entry_assistant()
        st.markdown('</div>', unsafe_allow_html=True)

        intent = st.session_state.get("login_intent")
        if intent == "recruiter":
            _recruiter_login()
        elif intent == "candidate":
            _candidate_login()

        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown('<div class="arp-section-label">Or choose directly</div>', unsafe_allow_html=True)

        recruiter_tab, candidate_tab = st.tabs(["Recruiter", "Candidate"])
        with recruiter_tab:
            _recruiter_login(key_prefix="tab_")
        with candidate_tab:
            _candidate_login(key_prefix="tab_")

        with st.expander("Need help? Ask the assistant"):
            show_help_assistant()


def _recruiter_login(key_prefix=""):
    st.markdown('<div class="arp-card">', unsafe_allow_html=True)
    login_tab, signup_tab, reset_tab = st.tabs(["Log In", "Sign Up", "Forgot Password"])

    with login_tab:
        with st.form(f"{key_prefix}rec_login_form"):
            username = st.text_input("Username", key=f"{key_prefix}rec_user")
            password = st.text_input("Password", type="password", key=f"{key_prefix}rec_pass")
            if st.form_submit_button("Log In as Recruiter", use_container_width=True):
                try:
                    user = auth.authenticate_user(username, password)
                    if user and user["role"] == "recruiter":
                        st.session_state["user"] = user
                        st.rerun()
                    elif user:
                        st.error("This account isn't a recruiter account.")
                    else:
                        st.error("Incorrect username or password.")
                except auth.AccountLockedError as e:
                    from datetime import datetime
                    minutes = max(1, int((e.unlock_time - datetime.now()).total_seconds() // 60))
                    st.error(f"Too many failed attempts. Locked for about {minutes} more minute(s). "
                             f"Use 'Forgot Password' instead of waiting.")

    with signup_tab:
        with st.form(f"{key_prefix}rec_signup_form"):
            new_user = st.text_input("Choose a username", key=f"{key_prefix}su_user")
            new_email = st.text_input("Email (optional)", key=f"{key_prefix}su_email")
            new_name = st.text_input("Full name (optional)", key=f"{key_prefix}su_name")
            new_pass = st.text_input("Choose a password (min 6 chars)", type="password", key=f"{key_prefix}su_pass")
            if st.form_submit_button("Create Recruiter Account", use_container_width=True):
                try:
                    auth.create_user(new_user, new_pass, "recruiter", email=new_email or None, full_name=new_name or None)
                    st.success("Account created — you can log in now.")
                except ValueError as e:
                    st.error(str(e))

    with reset_tab:
        st.caption("No email service is configured, so your reset code is shown here directly.")
        req_tab, apply_tab = st.tabs(["1. Request Code", "2. Enter Code & Reset"])

        with req_tab:
            with st.form(f"{key_prefix}reset_req"):
                ru = st.text_input("Your username or email", key=f"{key_prefix}reset_ru")
                if st.form_submit_button("Get Reset Code", use_container_width=True):
                    try:
                        info = auth.request_password_reset(ru)
                        st.success(f"Reset code for '{info['username']}': **{info['token']}** "
                                   f"(valid {auth.RESET_TOKEN_EXPIRY_MINUTES} min).")
                    except ValueError as e:
                        st.error(str(e))

        with apply_tab:
            with st.form(f"{key_prefix}reset_apply"):
                ru2 = st.text_input("Username", key=f"{key_prefix}reset_ru2")
                code = st.text_input("Reset code", key=f"{key_prefix}reset_code")
                new_pw = st.text_input("New password (min 6 chars)", type="password", key=f"{key_prefix}reset_pw")
                if st.form_submit_button("Reset Password", use_container_width=True):
                    try:
                        auth.reset_password_with_token(ru2, code, new_pw)
                        st.success("Password reset — log in with your new password now.")
                    except ValueError as e:
                        st.error(str(e))

    st.markdown('</div>', unsafe_allow_html=True)


def _candidate_login(key_prefix=""):
    st.markdown('<div class="arp-card">', unsafe_allow_html=True)
    st.caption("No password needed — just enter your email to continue.")

    with st.form(f"{key_prefix}cand_login_form"):
        email = st.text_input("Your Email", key=f"{key_prefix}cand_email")
        full_name = st.text_input("Your Name (only needed the first time)", key=f"{key_prefix}cand_name")
        if st.form_submit_button("Continue", use_container_width=True):
            try:
                user = auth.get_or_create_candidate(email, full_name=full_name or None)
                st.session_state["user"] = user
                st.rerun()
            except ValueError as e:
                st.error(str(e))

    st.markdown('</div>', unsafe_allow_html=True)
