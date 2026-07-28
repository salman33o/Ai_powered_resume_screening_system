'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { uploadResume, generateResumeSummary, generateSuggestions } from '@/lib/api';
import ResumeUploader from '@/components/ResumeUploader';
import GlassCard from '@/components/GlassCard';
import SkillBadge from '@/components/SkillBadge';

export default function CandidateDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Resume states
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);

  // AI summary states
  const [aiSummary, setAiSummary] = useState<string>('');
  const [generatingSummary, setGeneratingSummary] = useState(false);

  // Career coach states
  const [preferredRole, setPreferredRole] = useState('Senior Python Developer');
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);

  // Active view section
  const [activeTab, setActiveTab] = useState<'profile' | 'coach'>('profile');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleFileUpload = async (selectedFile: File) => {
    if (!user) return;
    setFile(selectedFile);
    setUploading(true);
    setMessage(null);
    setAiSummary('');
    setSuggestions(null);

    try {
      const res = await uploadResume(user.id, selectedFile);
      setParsedData(res.parsed_data);
      setMessage('Resume successfully uploaded and parsed!');
      
      // Auto-trigger summary generation
      if (res.parsed_data?.resume_text) {
        triggerSummary(res.parsed_data.resume_text);
      }
    } catch (err: any) {
      console.error(err);
      setMessage('Error uploading or parsing resume.');
    } finally {
      setUploading(false);
    }
  };

  const triggerSummary = async (text: string) => {
    setGeneratingSummary(true);
    try {
      const res = await generateResumeSummary(text);
      setAiSummary(res.summary);
    } catch (err) {
      console.error('Summary error:', err);
      setAiSummary('Failed to generate summary.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const triggerSuggestions = async () => {
    if (!parsedData?.resume_text) return;
    setGeneratingSuggestions(true);
    try {
      const res = await generateSuggestions(parsedData.resume_text, preferredRole);
      setSuggestions(res);
    } catch (err) {
      console.error('Suggestions error:', err);
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 100px)' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <main className="page-wrapper animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Welcome header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Hello, <span className="gradient-text">{user.username}</span>
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Upload your resume to check matching index scores and get customized recommendations.
          </p>
        </div>
        <Link href="/candidate/jobs" className="btn btn-primary">
          Browse All Jobs →
        </Link>
      </div>

      {/* Upload Zone */}
      <section style={{ marginBottom: '3rem' }}>
        <ResumeUploader
          onFile={handleFileUpload}
          uploading={uploading}
          uploadedName={file?.name}
        />
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`} style={{ marginTop: '1.25rem' }}>
            {message}
          </div>
        )}
      </section>

      {parsedData && (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'profile' ? '2px solid var(--brand-primary)' : '2px solid transparent',
                color: activeTab === 'profile' ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📄 Profile & Summary
            </button>
            <button
              onClick={() => setActiveTab('coach')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'coach' ? '2px solid var(--brand-primary)' : '2px solid transparent',
                color: activeTab === 'coach' ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🤖 AI Career Coach
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', flexWrap: 'wrap' }} className="grid-auto">
                {/* Candidate Info card */}
                <GlassCard style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                    Parsed Metadata
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
                    <div>
                      <span className="form-label" style={{ display: 'block', marginBottom: '2px' }}>Full Name</span>
                      <span style={{ fontWeight: 600 }}>{parsedData.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="form-label" style={{ display: 'block', marginBottom: '2px' }}>Email Address</span>
                      <span style={{ fontWeight: 600 }}>{parsedData.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="form-label" style={{ display: 'block', marginBottom: '2px' }}>Phone Number</span>
                      <span style={{ fontWeight: 600 }}>{parsedData.phone || 'N/A'}</span>
                    </div>
                  </div>
                </GlassCard>

                {/* AI Summary card */}
                <GlassCard style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>AI Professional Summary</span>
                    {generatingSummary && <span className="spinner" style={{ width: 14, height: 14 }} />}
                  </h3>
                  {generatingSummary ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div className="skeleton" style={{ height: '16px', width: '100%' }} />
                      <div className="skeleton" style={{ height: '16px', width: '95%' }} />
                      <div className="skeleton" style={{ height: '16px', width: '80%' }} />
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', fontStyle: 'italic' }}>
                      "{aiSummary || 'No summary generated yet.'}"
                    </p>
                  )}
                </GlassCard>
              </div>

              {/* Skills card */}
              <GlassCard style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Identified Skills ({parsedData.skills?.length || 0})</h3>
                {parsedData.skills && parsedData.skills.length > 0 ? (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {parsedData.skills.map((skill: string) => (
                      <SkillBadge key={skill} skill={skill} matched={true} />
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No skills identified in the resume text.</p>
                )}
              </GlassCard>
            </div>
          )}

          {/* AI Career Coach Tab */}
          {activeTab === 'coach' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <GlassCard style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Interactive Career Advisory</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Choose your target role below to generate automated skill-gap learning suggestions, coding project suggestions, and structured roadmap steps from Gemini.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ flex: '1 1 300px' }}>
                    <label className="form-label">Target Role Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={preferredRole}
                      onChange={(e) => setPreferredRole(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={triggerSuggestions}
                    disabled={generatingSuggestions}
                    style={{ height: '42px' }}
                  >
                    {generatingSuggestions ? <span className="spinner" /> : 'Optimize Profile'}
                  </button>
                </div>

                {generatingSuggestions && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '2rem' }}>
                    <div className="skeleton" style={{ height: '100px' }} />
                    <div className="skeleton" style={{ height: '100px' }} />
                  </div>
                )}

                {suggestions && !generatingSuggestions && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginTop: '2rem' }} className="animate-fade-in">
                    {/* Skill Upgrades */}
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'var(--brand-accent)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        💡 Targeted Skill Recommendations
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.92rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {suggestions.skill_suggestions?.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Projects */}
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'var(--brand-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🛠️ Portfolio Projects to Build
                      </h4>
                      <div className="grid-auto">
                        {suggestions.project_recommendations?.map((item: string, idx: number) => (
                          <GlassCard key={idx} style={{ padding: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item}</p>
                          </GlassCard>
                        ))}
                      </div>
                    </div>

                    {/* Learning Roadmap */}
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'var(--brand-gold)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        🗺️ Step-by-Step Roadmap
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {suggestions.learning_roadmap?.map((item: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'var(--brand-gold)',
                              color: 'var(--bg-base)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '0.85rem',
                              flexShrink: 0,
                            }}>
                              {item.step || idx + 1}
                            </div>
                            <div>
                              <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                                {item.topic}
                              </p>
                              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                                Suggested Resource: <span style={{ color: 'var(--text-secondary)' }}>{item.resource}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          )}
        </>
      )}
    </main>
  );
}
