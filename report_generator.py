from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch
from datetime import datetime
import os
import glob
import time

RETENTION_DAYS = int(os.environ.get("REPORT_RETENTION_DAYS", 90))


def purge_old_reports(retention_days=None):
    retention_days = retention_days if retention_days is not None else RETENTION_DAYS
    if not os.path.isdir("reports"):
        return 0

    cutoff = time.time() - retention_days * 86400
    deleted = 0
    for filepath in glob.glob("reports/*.pdf"):
        try:
            if os.path.getmtime(filepath) < cutoff:
                os.remove(filepath)
                deleted += 1
        except OSError:
            continue
    return deleted


def _table(rows, widths, header_bg):
    t = Table(rows, colWidths=widths)
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("BACKGROUND", (0, 0), (0, -1), header_bg),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


def generate_pdf_report(candidate, ats_result, skill_report, questions):
    os.makedirs("reports", exist_ok=True)
    purge_old_reports()

    filename = f"reports/{candidate['name'].replace(' ', '_')}_ATS_Report.pdf"
    doc = SimpleDocTemplate(filename)
    styles = getSampleStyleSheet()
    S = lambda h=0.3: Spacer(1, h * inch)
    H = lambda text: Paragraph(f"<b>{text}</b>", styles["Heading2"])
    P = lambda text: Paragraph(text, styles["BodyText"])

    story = [
        Paragraph("<b>Resume Analyzer</b>", styles["Title"]),
        Paragraph("Candidate ATS Analysis Report", styles["Heading2"]),
        S(),

        H("Candidate Details"),
        _table([["Name", candidate["name"]], ["Email", candidate["email"]],
                ["Phone", candidate["phone"]], ["Education", candidate["education"]]],
               [2 * inch, 4 * inch], colors.lightgrey),
        S(),

        H("ATS Score Summary"),
        _table([["Overall ATS Score", f"{ats_result['Final Score']}%"],
                ["Semantic Score", f"{ats_result['Semantic Score']}%"],
                ["Skill Score", f"{ats_result['Skill Score']}%"],
                ["Education Score", f"{ats_result['Education Score']}%"],
                ["Experience Score", f"{ats_result['Experience Score']}%"]],
               [3 * inch, 2 * inch], colors.lightblue),
        S(),

        H("AI Hiring Verdict"),
        P(ats_result.get("AI Feedback", "").replace("\n", "<br/>")),
        S(),

        H("Matched Skills"),
        P(", ".join(skill_report["Matched Skills"]) or "None"),
        S(0.15),
        H("Missing Skills"),
        P(", ".join(skill_report["Missing Skills"]) or "None"),
        S(),

        H("Recommendations"),
        *[P("• " + item) for item in skill_report["Recommendations"]],
        S(),

        H("Suggested Interview Questions"),
    ]

    for q in questions:
        story.append(P(f"<b>{q['type']}</b> | {q['difficulty']}<br/>{q['question']}"))
        story.append(S(0.1))

    story += [
        S(),
        Paragraph(f"Generated on: {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}", styles["Italic"]),
        Paragraph("Generated using Resume Analyzer", styles["Italic"]),
    ]

    doc.build(story)
    return filename
