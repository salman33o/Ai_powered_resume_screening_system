'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchJobPostings } from '@/lib/api';
import JobCard from '@/components/JobCard';
import GlassCard from '@/components/GlassCard';

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const jobs = await fetchJobPostings('Published');
        setFeaturedJobs(jobs.slice(0, 3));
      } catch (error) {
        console.error('Failed to load featured jobs:', error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  return (
    <main className="page-wrapper animate-fade-in" style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '5rem 1rem 4rem 1rem',
        position: 'relative',
      }}>
        {/* Floating gradient glow behind hero */}
        <div style={{
          position: 'absolute',
          top: '20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, var(--brand-primary-glow) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: -1,
        }} />

        <div className="badge badge-primary animate-float" style={{ marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
          ✨ Powered by Gemini 1.5 Flash
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          lineHeight: '1.1',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
          maxWidth: '800px',
        }}>
          Land Your Dream Job with <span className="gradient-text">AI-Powered Resume Analysis</span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          marginBottom: '2.5rem',
          lineHeight: '1.6',
        }}>
          Upload your resume, analyze skill gaps, optimize for applicant tracking systems, and generate professional cover letters in seconds.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/candidate/dashboard" className="btn btn-primary btn-lg">
            Analyze Resume Now
          </Link>
          <Link href="/candidate/jobs" className="btn btn-secondary btn-lg">
            Explore Openings
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ marginTop: '3rem', marginBottom: '6rem' }}>
        <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '3rem' }}>
          Supercharge Your Job Search
        </h2>
        <div className="grid-auto">
          <GlassCard style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>📈</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>ATS Matching</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Get detailed matching scores calculated based on TF-IDF algorithms and machine learning classifiers to bypass HR screens.
            </p>
          </GlassCard>

          <GlassCard style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Skill Gap Analysis</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Identify missing keywords and technical credentials directly from descriptions, and instantly map them to your skills list.
            </p>
          </GlassCard>

          <GlassCard style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>📝</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>AI Tailored Letters</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Generate custom, highly persuasive cover letters tailored specifically to each individual posting using Gemini AI.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Featured Opportunities</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Explore roles currently hiring and verify matches instantly.</p>
          </div>
          <Link href="/candidate/jobs" style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
            View all jobs →
          </Link>
        </div>

        {loading ? (
          <div className="grid-auto">
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card skeleton" style={{ height: '220px' }} />
            ))}
          </div>
        ) : featuredJobs.length > 0 ? (
          <div className="grid-auto">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <GlassCard style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No featured jobs available right now.</p>
          </GlassCard>
        )}
      </section>

      {/* Recruiter Section */}
      <section style={{ marginTop: '8rem' }}>
        <GlassCard style={{
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
          border: '1px solid rgba(99, 102, 241, 0.15)',
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Are you a Recruiter?</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem' }}>
            Manage job postings, review automated resume matches, see deep analytics, and hire candidates with our seamless dashboards.
          </p>
          <Link href="/login" className="btn btn-secondary">
            Recruiter Workspace →
          </Link>
        </GlassCard>
      </section>
    </main>
  );
}
