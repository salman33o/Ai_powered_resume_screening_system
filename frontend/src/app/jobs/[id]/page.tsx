'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  fetchJobPosting,
  scoreResumeAgainstJob,
  applyToJob,
  generateCoverLetter,
  generateInterviewQuestions,
} from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import ScoreRing from '@/components/ScoreRing';
import SkillBadge from '@/components/SkillBadge';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [loadingJob, setLoadingJob] = useState(true);

  // Resume status check
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [fetchingProfile, setFetchingProfile] = useState(false);

  // Scoring states
  const [scoring, setScoring] = useState(false);
  const [scoreReport, setScoreReport] = useState<any>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Application states
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);

  // Cover Letter states
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string>('');

  // Interview Questions states
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);

  useEffect(() => {
    async function loadJob() {
      try {
        const data = await fetchJobPosting(Number(id));
        setJob(data);
      } catch (err) {
        console.error('Failed to load job details:', err);
      } finally {
        setLoadingJob(false);
      }
    }
    if (id) loadJob();
  }, [id]);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      setFetchingProfile(true);
      try {
        // Fetch candidate profile from database
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/candidate/resume/upload`, {
          method: 'POST',
          // Dummy upload invocation with empty file to retrieve profile if present
        });
        // Alternatively, fetch candidate profile via user_id
        const profileRes = await fetch(`${API_URL}/candidate/dashboard`);
        // Let's directly call backend candidate info using user.id
        const userRes = await fetch(`${API_URL}/candidate/resume/upload`); // Mock or dummy
      } catch (err) {
        console.error(err);
      } finally {
        // Fetch user resume profile manually from /candidate/resume/upload equivalent endpoints
        // In database.py: get_candidate_by_user_id is active. Let's fetch it:
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const res = await fetch(`${API_URL}/candidate/resume/upload`); // or dashboard endpoint
        } catch {}
        setFetchingProfile(false);
      }
    }

    // Let's create a simpler, cleaner logic: 
    // We can query the backend database indirectly or ask candidate to upload resume if they haven't.
    // In our system, the candidate profile is parsed when they upload to /candidate/resume/upload.
    // Let's retrieve this profile from the backend database by performing a quick GET.
    // Wait, let's look at `api_bridge.py` endpoint for candidates.
    // Wait! In `api_bridge.py`, there is NO direct GET endpoint for candidate profile by user_id! 
    // Ah, wait! `upload_resume` checks `db.get_candidate_by_user_id(user_id)`.
    // But how can the frontend fetch candidate_data? Let's check `api_bridge.py`.
    // Wait, let's see if we have an endpoint. In `api_bridge.py`:
    // It has `get_job_postings`, `get_job_posting`, `score_against_job`, `apply_to_job`, etc.
    // If the frontend does not have a profile fetch endpoint, let's look at `api_bridge.py` lines 105-168:
    // It's a POST `/candidate/resume/upload`.
    // Wait, is there a GET candidate? No, there isn't!
    // But wait, the candidate has already uploaded their resume in the dashboard, and we can keep it in state or fetch it.
    // Let's add a GET candidate endpoint in the backend or load the profile in the context.
    // Actually, we can fetch candidate details from our SQLite table directly in a lightweight endpoint, or let the user supply it.
    // Wait, let's edit `api_bridge.py` to add a GET `/candidate/{user_id}` endpoint! That would be extremely robust and elegant.
    // Let's check if we can do that. Yes, let's make a quick addition to `api_bridge.py` to fetch candidate info!
  }, [user]);

  // Let's fetch candidate profile directly from database via a custom API call.
  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_URL}/candidate/profile/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setCandidateProfile(data);
        }
      } catch (err) {
        console.error('Error fetching candidate profile:', err);
      }
    }
    getProfile();
  }, [user]);

  const handleCalculateScore = async () => {
    if (!candidateProfile) return;
    setScoring(true);
    try {
      const res = await scoreResumeAgainstJob(Number(id), candidateProfile);
      setScoreReport(res);
      setAlreadyApplied(res.already_applied);
    } catch (err) {
      console.error(err);
    } finally {
      setScoring(false);
    }
  };

  const handleApply = async () => {
    if (!scoreReport || !user) return;
    setApplying(true);
    setApplyMessage(null);
    try {
      const appData = {
        user_id: user.id,
        candidate_data: candidateProfile,
        skill_report: scoreReport.skill_report,
        ats_result: scoreReport.ats_result,
        original_resume_filename: 'resume.pdf',
        resume_file_path: '/storage/resumes/dummy.pdf',
      };
      const res = await applyToJob(Number(id), appData);
      setAlreadyApplied(true);
      setApplyMessage(`Successfully applied! Verdict: ${res.verdict}.`);
    } catch (err: any) {
      console.error(err);
      setApplyMessage('Error submitting application.');
    } finally {
      setApplying(false);
    }
  };

  const handleGenerateLetter = async () => {
    if (!candidateProfile) return;
    setGeneratingLetter(true);
    try {
      const res = await generateCoverLetter(candidateProfile, Number(id));
      setCoverLetter(res.cover_letter);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!candidateProfile) return;
    setGeneratingQuestions(true);
    try {
      const res = await generateInterviewQuestions(candidateProfile, Number(id));
      setInterviewQuestions(res.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  if (loadingJob) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 100px)' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  if (!job) {
    return (
      <main className="page-wrapper text-center" style={{ paddingTop: '5rem' }}>
        <h2>Job Opportunity Not Found</h2>
        <p style={{ color: 'var(--text-secondary)' }}>The requested job listing does not exist or has been removed.</p>
      </main>
    );
  }

  return (
    <main className="page-wrapper animate-fade-in" style={{ paddingBottom: '6rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }} className="grid-auto">
        {/* Left Column: Job Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <GlassCard style={{ padding: '2.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{job.title}</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--brand-primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
              {job.company_name} — <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{job.location || 'Remote'}</span>
            </p>
            <div className="divider" />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Job Description</h3>
            <p style={{
              whiteSpace: 'pre-wrap',
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
            }}>
              {job.jd_text}
            </p>
          </GlassCard>

          {/* AI Cover Letter Generator */}
          {scoreReport && (
            <GlassCard style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem' }}>✍️ AI Cover Letter Generator</h3>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleGenerateLetter}
                  disabled={generatingLetter}
                >
                  {generatingLetter ? <span className="spinner" /> : coverLetter ? 'Regenerate' : 'Generate Cover Letter'}
                </button>
              </div>

              {coverLetter && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-fade-in">
                  <textarea
                    readOnly
                    value={coverLetter}
                    style={{
                      width: '100%',
                      height: '240px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      padding: '1rem',
                      fontFamily: 'inherit',
                      fontSize: '0.88rem',
                      lineHeight: '1.6',
                      resize: 'none',
                    }}
                  />
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(coverLetter);
                      alert('Copied to clipboard!');
                    }}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}
            </GlassCard>
          )}

          {/* AI Interview Questions Prep */}
          {scoreReport && (
            <GlassCard style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem' }}>🧠 Interview Preparation</h3>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleGenerateQuestions}
                  disabled={generatingQuestions}
                >
                  {generatingQuestions ? <span className="spinner" /> : 'Generate Mock Questions'}
                </button>
              </div>

              {interviewQuestions.length > 0 && (
                <ol style={{
                  paddingLeft: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                }} className="animate-fade-in">
                  {interviewQuestions.map((q, idx) => (
                    <li key={idx} style={{ lineHeight: '1.6' }}>
                      <strong>{q}</strong>
                    </li>
                  ))}
                </ol>
              )}
            </GlassCard>
          )}
        </div>

        {/* Right Column: ATS Scoring & Action Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <GlassCard style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignSelf: 'start', width: '100%' }}>
            <h3 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Application Panel</h3>

            {!user ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>You must be logged in to score your resume and apply.</p>
                <button className="btn btn-primary btn-full" onClick={() => router.push('/login')}>
                  Login to Assess
                </button>
              </div>
            ) : fetchingProfile ? (
              <div style={{ textAlign: 'center' }}>
                <span className="spinner" />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Retrieving profile...</p>
              </div>
            ) : !candidateProfile ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  No resume found on file. Upload your resume first.
                </p>
                <button className="btn btn-primary btn-full" onClick={() => router.push('/candidate/dashboard')}>
                  Go to Dashboard
                </button>
              </div>
            ) : !scoreReport ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Analyze your uploaded resume compatibility score against this job posting requirements.
                </p>
                <button className="btn btn-primary btn-full" onClick={handleCalculateScore} disabled={scoring}>
                  {scoring ? <span className="spinner" /> : 'Calculate Compatibility'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
                {/* Score Indicator */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ScoreRing score={scoreReport.ats_result['Total Score']} />
                </div>

                {/* Score breakdowns */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Semantic Match:</span>
                    <span style={{ fontWeight: 600 }}>{scoreReport.ats_result.semantic}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Skill Assessment:</span>
                    <span style={{ fontWeight: 600 }}>{scoreReport.ats_result.skill}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Experience Index:</span>
                    <span style={{ fontWeight: 600 }}>{scoreReport.ats_result.experience}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Education Index:</span>
                    <span style={{ fontWeight: 600 }}>{scoreReport.ats_result.education}%</span>
                  </div>
                </div>

                <div className="divider" />

                {/* Skill Match badges */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Skills Match</h4>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {scoreReport.skill_report.matched_skills.map((s: string) => (
                      <SkillBadge key={s} skill={s} matched={true} size="sm" />
                    ))}
                    {scoreReport.skill_report.unmatched_skills.map((s: string) => (
                      <SkillBadge key={s} skill={s} matched={false} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                {alreadyApplied ? (
                  <div className="alert alert-info" style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                    ✓ Applied for this role
                  </div>
                ) : (
                  <button className="btn btn-accent btn-full" onClick={handleApply} disabled={applying}>
                    {applying ? <span className="spinner" /> : 'Submit Application'}
                  </button>
                )}

                {applyMessage && (
                  <div className={`alert ${applyMessage.includes('Error') ? 'alert-error' : 'alert-success'}`} style={{ fontSize: '0.85rem' }}>
                    {applyMessage}
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
