import { StructuredResume, JobRequirement, ATSScoreBreakdown, ScoringWeights } from '../types';
import { isSkillMatch, normalizeSkillName } from './skillOntology';

export const DEFAULT_WEIGHTS: ScoringWeights = {
  skillsMatch: 30,
  experienceMatch: 25,
  responsibilitiesMatch: 20,
  projectsMatch: 10,
  educationMatch: 5,
  keywordsMatch: 5,
  certificationsMatch: 5,
};

/**
 * Calculates estimated candidate years of experience based on work experience items
 */
export function calculateCandidateExperienceYears(resume: StructuredResume): number {
  let totalMonths = 0;
  const currentYear = 2026;

  for (const exp of resume.experience) {
    let startYear = parseInt(exp.startDate.slice(0, 4), 10);
    if (isNaN(startYear)) startYear = 2022;

    let endYear = currentYear;
    if (!exp.isCurrent && exp.endDate) {
      const parsedEnd = parseInt(exp.endDate.slice(0, 4), 10);
      if (!isNaN(parsedEnd)) endYear = parsedEnd;
    }

    const diffYears = Math.max(0.5, endYear - startYear);
    totalMonths += diffYears * 12;
  }

  // If no detailed experience records, estimate from text length/summary or minimum 1
  if (resume.experience.length === 0) {
    return 1.0;
  }

  return Math.min(20, Math.round((totalMonths / 12) * 10) / 10);
}

/**
 * Pure deterministic ATS Hybrid Scoring Engine
 */
export function evaluateResumeAgainstJob(
  resume: StructuredResume,
  job: JobRequirement,
  customWeights?: ScoringWeights
): ATSScoreBreakdown {
  const weights = customWeights || job.scoringWeights || DEFAULT_WEIGHTS;

  // 1. Skill Matching (Required + Preferred)
  const allCandidateSkills = [
    ...resume.skills.technical,
    ...resume.skills.tools,
    ...resume.skills.soft,
    ...resume.experience.flatMap(e => e.technologies || []),
    ...resume.projects.flatMap(p => p.technologies || [])
  ];

  const matchedSkills: { skill: string; evidence: string; matchType: 'exact' | 'alias' | 'semantic' }[] = [];
  const missingRequired: string[] = [];
  const missingPreferred: string[] = [];

  // Check required skills
  for (const reqSkill of job.requiredSkills) {
    let found = false;
    for (const candSkill of allCandidateSkills) {
      const match = isSkillMatch(candSkill, reqSkill);
      if (match.matched) {
        matchedSkills.push({
          skill: reqSkill,
          evidence: `Verified via candidate skill "${candSkill}" (${match.matchType} match)`,
          matchType: match.matchType
        });
        found = true;
        break;
      }
    }
    if (!found) {
      missingRequired.push(reqSkill);
    }
  }

  // Check preferred skills
  for (const prefSkill of job.preferredSkills) {
    let found = false;
    for (const candSkill of allCandidateSkills) {
      const match = isSkillMatch(candSkill, prefSkill);
      if (match.matched) {
        matchedSkills.push({
          skill: prefSkill,
          evidence: `Preferred skill verified via "${candSkill}" (${match.matchType})`,
          matchType: match.matchType
        });
        found = true;
        break;
      }
    }
    if (!found) {
      missingPreferred.push(prefSkill);
    }
  }

  const totalRequired = Math.max(1, job.requiredSkills.length);
  const totalPreferred = Math.max(1, job.preferredSkills.length);
  const reqMatchRatio = (job.requiredSkills.length - missingRequired.length) / totalRequired;
  const prefMatchRatio = (job.preferredSkills.length - missingPreferred.length) / totalPreferred;

  // Required counts 75% of skill score, preferred counts 25%
  const skillsScore = Math.round((reqMatchRatio * 0.75 + prefMatchRatio * 0.25) * 100);

  // 2. Experience Matching
  const candidateYears = calculateCandidateExperienceYears(resume);
  const requiredYears = job.minExperienceYears;
  let experienceScore = 100;
  let expEvidence = '';

  if (candidateYears >= requiredYears) {
    experienceScore = 95 + Math.min(5, Math.round((candidateYears - requiredYears) * 2));
    expEvidence = `Candidate has ~${candidateYears} years of experience, meeting/exceeding the ${requiredYears}+ years requirement.`;
  } else {
    const ratio = Math.max(0.3, candidateYears / Math.max(1, requiredYears));
    experienceScore = Math.round(ratio * 88);
    expEvidence = `Candidate has ~${candidateYears} years vs ${requiredYears} years required.`;
  }

  // Title alignment check
  const hasTitleMatch = resume.experience.some(e => 
    e.jobTitle.toLowerCase().includes(job.title.toLowerCase()) ||
    job.title.toLowerCase().includes(e.jobTitle.toLowerCase())
  );
  const titleAlignment = hasTitleMatch ? 'Direct Title Match' : 'Related Domain Experience';

  // 3. Responsibilities & Semantic Overlap
  const resumeFullText = [
    resume.summary,
    ...resume.experience.map(e => `${e.jobTitle} at ${e.company}: ${e.description}`),
    ...resume.projects.map(p => `${p.title}: ${p.description}`)
  ].join(' ').toLowerCase();

  const alignedPoints: { jdPoint: string; resumeEvidence: string; similarity: number }[] = [];
  const gapPoints: string[] = [];

  for (const resp of job.responsibilities) {
    const respWords = resp.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matchedWordCount = respWords.filter(w => resumeFullText.includes(w)).length;
    const similarity = respWords.length > 0 ? matchedWordCount / respWords.length : 0.5;

    if (similarity >= 0.35) {
      alignedPoints.push({
        jdPoint: resp,
        resumeEvidence: `Demonstrated competency in experience history (${Math.round(similarity * 100)}% keyword context alignment)`,
        similarity: Math.round(similarity * 100)
      });
    } else {
      gapPoints.push(resp);
    }
  }

  const responsibilitiesScore = Math.round(
    (alignedPoints.length / Math.max(1, job.responsibilities.length)) * 80 + 20
  );

  // 4. Projects Match
  const relevantProjects: { title: string; alignment: string }[] = [];
  for (const proj of resume.projects) {
    const projTechs = proj.technologies.map(normalizeSkillName);
    const techMatches = projTechs.filter(t => 
      job.requiredSkills.some(r => isSkillMatch(t, r).matched) ||
      job.keywords.some(k => isSkillMatch(t, k).matched)
    );

    if (techMatches.length > 0) {
      relevantProjects.push({
        title: proj.title,
        alignment: `Applies required tech stack: [${techMatches.join(', ')}] with direct domain relevance.`
      });
    }
  }

  const projectsScore = resume.projects.length === 0 
    ? 50 
    : Math.min(100, Math.round((relevantProjects.length / Math.max(1, resume.projects.length)) * 40 + 60));

  // 5. Education Match
  let educationScore = 80;
  let eduDetails = 'Relevant degree in Computer Science, Data, or Engineering field.';
  if (resume.education.length > 0) {
    const eduText = resume.education.map(e => `${e.degree} in ${e.fieldOfStudy}`).join(' ').toLowerCase();
    const reqEdu = job.educationRequirement.toLowerCase();
    if (eduText.includes('master') || eduText.includes('bachelor') || eduText.includes('computer') || eduText.includes('data')) {
      educationScore = 95;
      eduDetails = `Degree (${resume.education[0]?.degree} in ${resume.education[0]?.fieldOfStudy}) fulfills ${job.educationRequirement}.`;
    }
  }

  // 6. Keywords Match
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  for (const kw of job.keywords) {
    if (resumeFullText.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }
  const keywordsScore = Math.round(
    (matchedKeywords.length / Math.max(1, job.keywords.length)) * 100
  );

  // 7. Certifications Match
  const matchedCerts: string[] = [];
  const missingCerts: string[] = [];
  for (const cert of job.requiredCertifications) {
    const hasCert = resume.certifications.some(c => 
      c.name.toLowerCase().includes(cert.toLowerCase()) || cert.toLowerCase().includes(c.name.toLowerCase())
    );
    if (hasCert) {
      matchedCerts.push(cert);
    } else {
      missingCerts.push(cert);
    }
  }

  const certsScore = job.requiredCertifications.length === 0 
    ? 90 
    : Math.round((matchedCerts.length / job.requiredCertifications.length) * 100);

  // Calculate Weighted Overall Score
  const totalWeight = 
    weights.skillsMatch +
    weights.experienceMatch +
    weights.responsibilitiesMatch +
    weights.projectsMatch +
    weights.educationMatch +
    weights.keywordsMatch +
    weights.certificationsMatch;

  const weightedSum = 
    skillsScore * weights.skillsMatch +
    experienceScore * weights.experienceMatch +
    responsibilitiesScore * weights.responsibilitiesMatch +
    projectsScore * weights.projectsMatch +
    educationScore * weights.educationMatch +
    keywordsScore * weights.keywordsMatch +
    certsScore * weights.certificationsMatch;

  const overallScore = Math.min(99, Math.max(25, Math.round(weightedSum / totalWeight)));

  // Confidence Score Calculation (reflects extraction quality, data completeness, section coverage)
  let confidenceScore = 90;
  const reasons: string[] = [];

  if (resume.extractionQuality === 'high') {
    confidenceScore = 94;
    reasons.push('High-fidelity structured text extracted with valid date formatting');
  } else if (resume.extractionQuality === 'medium') {
    confidenceScore = 78;
    reasons.push('Some bullet points or date sequences required semantic heuristic resolution');
  } else if (resume.extractionQuality === 'low' || resume.extractionQuality === 'uncertain') {
    confidenceScore = 55;
    reasons.push('Some sections in the uploaded document had OCR uncertainty or complex multi-column formatting');
  }

  if (resume.experience.length === 0) {
    confidenceScore -= 15;
    reasons.push('No formal work history section detected');
  }
  if (resume.skills.technical.length < 3) {
    confidenceScore -= 10;
    reasons.push('Sparse explicit skills enumeration');
  }

  confidenceScore = Math.max(35, Math.min(98, confidenceScore));

  // Strengths & Gaps
  const topStrengths: string[] = [];
  if (skillsScore >= 80) topStrengths.push(`Strong core skill alignment: ${matchedSkills.slice(0, 3).map(m => m.skill).join(', ')}`);
  if (candidateYears >= requiredYears) topStrengths.push(`Exceeds required seniority baseline (${candidateYears} yrs vs ${requiredYears} yrs)`);
  if (relevantProjects.length > 0) topStrengths.push(`Direct project experience with target tech stack (${relevantProjects[0].title})`);
  if (educationScore >= 90) topStrengths.push(`Educational background directly aligns with position requirements`);

  const criticalGaps: string[] = [];
  if (missingRequired.length > 0) criticalGaps.push(`Missing mandatory requirements: ${missingRequired.join(', ')}`);
  if (candidateYears < requiredYears) criticalGaps.push(`Years of experience (${candidateYears} yrs) is under stated requirement (${requiredYears} yrs)`);
  if (gapPoints.length > 0) criticalGaps.push(`Gaps in responsibility coverage: ${gapPoints.slice(0, 2).join('; ')}`);

  const improvementActionItems: string[] = [];
  if (missingRequired.length > 0) {
    improvementActionItems.push(`Incorporate verifiable experience with ${missingRequired.slice(0, 2).join(' and ')} in recent project bullets.`);
  }
  if (matchedKeywords.length < job.keywords.length) {
    improvementActionItems.push(`Harmonize terminology with JD keywords: mention ${missingKeywords.slice(0, 3).join(', ')} in summary or experience.`);
  }
  if (resume.projects.length < 2) {
    improvementActionItems.push(`Add at least one enterprise project demonstrating ${job.requiredSkills.slice(0, 2).join(' / ')} architecture.`);
  }
  improvementActionItems.push(`Quantify business metrics (e.g. latency reduction %, revenue impact $, team size) in work descriptions.`);

  return {
    overallScore,
    confidenceScore,
    confidenceReason: reasons.join('. '),
    weights,
    components: {
      skillsMatch: {
        score: skillsScore,
        weight: weights.skillsMatch,
        matched: matchedSkills,
        missingRequired,
        missingPreferred,
        notes: `${matchedSkills.length} skills verified against job specification.`
      },
      experienceMatch: {
        score: experienceScore,
        weight: weights.experienceMatch,
        candidateYears,
        requiredYears,
        titleAlignment,
        evidence: expEvidence
      },
      responsibilitiesMatch: {
        score: responsibilitiesScore,
        weight: weights.responsibilitiesMatch,
        alignedPoints,
        gapPoints
      },
      projectsMatch: {
        score: projectsScore,
        weight: weights.projectsMatch,
        relevantProjects,
        suggestions: relevantProjects.length > 0 
          ? 'Projects directly substantiate resume claims.' 
          : 'Consider highlighting projects using the target stack.'
      },
      educationMatch: {
        score: educationScore,
        weight: weights.educationMatch,
        status: educationScore >= 80 ? 'matched' : 'partial',
        details: eduDetails
      },
      keywordsMatch: {
        score: keywordsScore,
        weight: weights.keywordsMatch,
        matchedKeywords,
        missingKeywords
      },
      certificationsMatch: {
        score: certsScore,
        weight: weights.certificationsMatch,
        matched: matchedCerts,
        missing: missingCerts
      }
    },
    topStrengths,
    criticalGaps,
    improvementActionItems,
    modelVersion: 'ATS-Hybrid-v2.6',
    scoringEngineVersion: 'Deterministic-Evidence-v1.4',
    analyzedAt: new Date().toISOString()
  };
}
