import { StructuredResume, JobRequirement, ATSScoreBreakdown, ScoringWeights } from '../types';
import { evaluateResumeAgainstJob } from '../lib/atsEngine';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '';

export async function analyzeResumeApi(
  resume: StructuredResume,
  job: JobRequirement,
  customWeights?: ScoringWeights
): Promise<ATSScoreBreakdown> {
  try {
    const res = await fetch(`${API_BASE}/api/ats/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, job, customWeights }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API request offline/failed, running local deterministic ATS engine:', err);
  }

  // Graceful deterministic fallback
  return evaluateResumeAgainstJob(resume, job, customWeights);
}

export async function optimizeResumeApi(resume: StructuredResume, job: JobRequirement): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/api/ats/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, job }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Optimization API fallback:', err);
  }

  const analysis = evaluateResumeAgainstJob(resume, job);
  return {
    optimizedSummary: `High-impact ${job.title} specialist with proven expertise in ${job.requiredSkills.slice(0, 3).join(', ')}. Demonstrated success architecting scalable data solutions, driving quantitative metrics, and empowering cross-functional business execution.`,
    bulletImprovements: [
      {
        original: resume.experience[0]?.description || 'Led analytics and reporting deliverables.',
        improved: `Architected and optimized high-throughput ${job.requiredSkills[0] || 'SQL'} data workflows, accelerating report delivery cycles by 35% across critical operational funnels.`,
        reasoning: 'Highlights action verbs and quantitative efficiency gains directly matching job requirements.'
      }
    ],
    keywordIntegrationAdvice: [
      `Naturally weave ${analysis.components.skillsMatch.missingRequired.slice(0, 2).join(' and ') || 'target tools'} into your current project technical achievements.`
    ],
    potentialScoreLift: `+${Math.min(15, 100 - analysis.overallScore)}% ATS Match Lift`
  };
}

export async function generateInterviewQuestionsApi(resume: StructuredResume, job: JobRequirement): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/api/ats/generate-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, job }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.questions || [];
    }
  } catch (err) {
    console.warn('Questions API fallback:', err);
  }

  return [
    {
      id: 'q-fall-1',
      category: 'technical',
      question: `How would you architect a production ${job.requiredSkills[0] || 'SQL'} data pipeline to ensure data consistency and sub-second query performance?`,
      contextWhyAsked: `Verifies fundamental system design skills for ${job.title}.`,
      expectedKeyPoints: ['Data partitioning', 'Indexing strategy', 'Schema normalization vs denormalization'],
      candidateBackgroundEvidence: `Matches background in ${resume.fullName}'s resume.`,
      difficulty: 'Mid'
    },
    {
      id: 'q-fall-2',
      category: 'project_deep_dive',
      question: `In your project "${resume.projects[0]?.title || 'Recent Project'}", what was the most difficult architectural bottleneck and how did you resolve it?`,
      contextWhyAsked: 'Measures root-cause problem solving and technical resilience.',
      expectedKeyPoints: ['Root cause diagnosis', 'Performance benchmarking', 'Measurable outcome'],
      candidateBackgroundEvidence: `Cited in projects portfolio.`,
      difficulty: 'Senior'
    }
  ];
}
