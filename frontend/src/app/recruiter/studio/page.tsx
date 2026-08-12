'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { queryMatchmaker } from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import SkillBadge from '@/components/SkillBadge';
import ScoreRing from '@/components/ScoreRing';

export default function RecruiterStudioPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [prompt, setPrompt] = useState('Senior Python Developer with FastAPI and Docker skills');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Comparer modal states
  const [selectedCandidates, setSelectedCandidates] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'recruiter')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setSearching(true);

    try {
      const res = await queryMatchmaker(prompt);
      setResults(res.results || []);
    } catch (err) {
      console.error('Matchmaker search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const toggleCompare = (candidate: any) => {
    if (selectedCandidates.some((c) => c.candidate_id === candidate.candidate_id)) {
      setSelectedCandidates(selectedCandidates.filter((c) => c.candidate_id !== candidate.candidate_id));
    } else {
      if (selectedCandidates.length >= 2) {
        alert('You can compare up to 2 candidates side-by-side.');
        return;
      }
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 100px)' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <main className="page-wrapper animate-fade-in" style={{ paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-accent" style={{ marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ✨ Mode 2 • AI Talent Headhunter Studio
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>AI Headhunter & Matchmaker</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Search candidates using natural language, analyze 3D skill vectors, and compare candidates side-by-side.
          </p>
        </div>
      </div>

      {/* AI Search Prompt Bar */}
      <GlassCard style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 340px' }} className="form-group">
            <label className="form-label">Natural Language Headhunting Query</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Senior React Engineer with TypeScript and GraphQL experience"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={searching}
            style={{ alignSelf: 'flex-end', height: '44px', padding: '0 2rem' }}
          >
            {searching ? <span className="spinner" /> : '🤖 AI Find Candidates'}
          </button>
        </form>
      </GlassCard>

      {/* Results Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Matched Talent Candidates ({results.length})
        </h2>

        {searching ? (
          <div className="grid-auto">
            {[1, 2].map((n) => (
              <div key={n} className="glass-card skeleton" style={{ height: '240px' }} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid-auto">
            {results.map((cand) => {
              const isComparing = selectedCandidates.some((c) => c.candidate_id === cand.candidate_id);
              return (
                <GlassCard key={cand.candidate_id} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>{cand.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--brand-primary)', fontWeight: 500 }}>{cand.email}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {cand.location}</p>
                    </div>
                    <div style={{
                      width: 46, height: 46, borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, color: 'var(--brand-primary)', fontSize: '0.85rem',
                    }}>
                      {Math.round(cand.match_score)}%
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5' }}>
                    "{cand.ai_highlight}"
                  </p>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {cand.all_skills.map((s: string) => (
                      <SkillBadge key={s} skill={s} matched={cand.matched_skills.includes(s)} size="sm" />
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      className={`btn btn-sm ${isComparing ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => toggleCompare(cand)}
                    >
                      {isComparing ? 'Remove' : '+ Compare Candidate'}
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <GlassCard style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              Type a role query above to search and rank candidate resumes with AI.
            </p>
          </GlassCard>
        )}
      </section>

      {/* Side-by-Side Comparer Modal / Panel */}
      {selectedCandidates.length > 0 && (
        <section className="animate-fade-in" style={{ marginTop: '3rem' }}>
          <GlassCard style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.08))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>⚔️ Side-by-Side Candidate Matrix Comparison</h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCandidates([])}>
                Clear Comparison
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selectedCandidates.length}, 1fr)`, gap: '2rem' }}>
              {selectedCandidates.map((cand) => (
                <div key={cand.candidate_id} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <ScoreRing score={cand.match_score} size={110} />
                    <h3 style={{ fontSize: '1.2rem', marginTop: '1rem', fontWeight: 700 }}>{cand.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cand.email}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                    <div>
                      <span className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Skills Fit</span>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {cand.all_skills.map((s: string) => (
                          <SkillBadge key={s} skill={s} matched={true} size="sm" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="form-label" style={{ display: 'block', marginBottom: '4px' }}>AI Match Assessment</span>
                      <p style={{ color: 'var(--text-secondary)' }}>{cand.ai_highlight}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>
      )}
    </main>
  );
}
