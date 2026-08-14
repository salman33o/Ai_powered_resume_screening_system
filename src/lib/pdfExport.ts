import jsPDF from 'jspdf';
import { ATSScoreBreakdown, StructuredResume, JobRequirement } from '../types';

export function exportATSReportPDF(resume: StructuredResume, job: JobRequirement, analysis: ATSScoreBreakdown) {
  const doc = new jsPDF();
  
  // Header banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 38, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('ATS & Resume Screening Audit Report', 14, 18);
  
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Engine: ${analysis.scoringEngineVersion} | Model: ${analysis.modelVersion} | Date: ${new Date(analysis.analyzedAt).toLocaleDateString()}`, 14, 28);
  
  // Overall Score Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 44, 182, 32, 3, 3, 'F');
  
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.text(`Candidate: ${resume.fullName}`, 20, 54);
  doc.text(`Target Job: ${job.title} (${job.company})`, 20, 62);
  
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text(`${analysis.overallScore}%`, 155, 58);
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Confidence: ${analysis.confidenceScore}%`, 148, 68);
  
  // Component Breakdown Table
  let y = 88;
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Deterministic Component Breakdown', 14, y);
  
  y += 8;
  doc.setFontSize(9);
  const comps = [
    { name: 'Skills Match', score: analysis.components.skillsMatch.score, weight: analysis.weights.skillsMatch },
    { name: 'Relevant Experience', score: analysis.components.experienceMatch.score, weight: analysis.weights.experienceMatch },
    { name: 'Responsibilities Alignment', score: analysis.components.responsibilitiesMatch.score, weight: analysis.weights.responsibilitiesMatch },
    { name: 'Project Portfolio', score: analysis.components.projectsMatch.score, weight: analysis.weights.projectsMatch },
    { name: 'Education Relevance', score: analysis.components.educationMatch.score, weight: analysis.weights.educationMatch },
    { name: 'Keywords Density', score: analysis.components.keywordsMatch.score, weight: analysis.weights.keywordsMatch },
    { name: 'Certifications', score: analysis.components.certificationsMatch.score, weight: analysis.weights.certificationsMatch },
  ];
  
  comps.forEach((c) => {
    doc.setTextColor(51, 65, 85);
    doc.text(`${c.name} (${c.weight}% wt)`, 20, y);
    doc.setTextColor(15, 23, 42);
    doc.text(`${c.score}%`, 175, y);
    doc.setDrawColor(226, 232, 240);
    doc.line(20, y + 2, 185, y + 2);
    y += 7;
  });
  
  // Skills Evidence
  y += 6;
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Skill Verification & Evidence', 14, y);
  
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52); // green
  doc.text(`Verified Skills (${analysis.components.skillsMatch.matched.length}):`, 20, y);
  y += 5;
  const verifiedList = analysis.components.skillsMatch.matched.map(m => m.skill).join(', ') || 'None';
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(verifiedList, 165), 20, y);
  
  y += 10;
  doc.setTextColor(185, 28, 28); // red
  doc.text(`Missing Required Skills (${analysis.components.skillsMatch.missingRequired.length}):`, 20, y);
  y += 5;
  const missingList = analysis.components.skillsMatch.missingRequired.join(', ') || 'None (All requirements satisfied)';
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(missingList, 165), 20, y);
  
  // AI Explanation & Guidance
  y += 14;
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Explainability & Human Recruiter Guidance', 14, y);
  
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const advice = analysis.aiExplanation || 'Deterministic scoring confirmed. AI assists with evidence synthesis but final decision rests with the human hiring committee.';
  const splitAdvice = doc.splitTextToSize(advice, 165);
  doc.text(splitAdvice, 20, y);
  
  // Footer notice
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Confidential recruitment decision-support audit. Generated under ethical AI scoring protocols.', 14, 285);
  
  doc.save(`${resume.fullName.replace(/\s+/g, '_')}_ATS_Score_Report.pdf`);
}

export function exportResumePDF(resume: StructuredResume) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text(resume.fullName, 14, 20);
  
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${resume.email} | ${resume.phone} | ${resume.location}`, 14, 26);
  if (resume.linkedin || resume.github) {
    doc.text(`${resume.linkedin || ''}  ${resume.github ? '| ' + resume.github : ''}`, 14, 31);
  }
  
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 35, 196, 35);
  
  let y = 43;
  // Professional Summary
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('PROFESSIONAL SUMMARY', 14, y);
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(resume.summary, 180);
  doc.text(summaryLines, 14, y);
  y += summaryLines.length * 4.5 + 4;
  
  // Technical Skills
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('TECHNICAL & PROFESSIONAL SKILLS', 14, y);
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Technical: ${resume.skills.technical.join(', ')}`, 14, y);
  y += 4.5;
  if (resume.skills.tools.length > 0) {
    doc.text(`Tools & Platforms: ${resume.skills.tools.join(', ')}`, 14, y);
    y += 4.5;
  }
  if (resume.skills.soft.length > 0) {
    doc.text(`Core Competencies: ${resume.skills.soft.join(', ')}`, 14, y);
    y += 4.5;
  }
  y += 4;
  
  // Work Experience
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('WORK EXPERIENCE', 14, y);
  y += 6;
  
  resume.experience.forEach(exp => {
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${exp.jobTitle} - ${exp.company}`, 14, y);
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}`, 155, y);
    y += 5;
    
    doc.setTextColor(51, 65, 85);
    const descLines = doc.splitTextToSize(exp.description, 180);
    doc.text(descLines, 14, y);
    y += descLines.length * 4.5 + 4;
  });
  
  // Education
  if (resume.education.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('EDUCATION', 14, y);
    y += 5;
    resume.education.forEach(edu => {
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(`${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution} (${edu.graduationYear})`, 14, y);
      y += 4.5;
    });
    y += 3;
  }
  
  // Projects
  if (resume.projects.length > 0 && y < 260) {
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('KEY PROJECTS', 14, y);
    y += 5;
    resume.projects.forEach(proj => {
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(proj.title, 14, y);
      y += 4;
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const pLines = doc.splitTextToSize(`${proj.description} [Tech: ${proj.technologies.join(', ')}]`, 180);
      doc.text(pLines, 14, y);
      y += pLines.length * 4 + 3;
    });
  }
  
  doc.save(`${resume.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
}
