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
    <main className="page-wrapper animate-fade-in" style={{ paddingBottom: '6rem' }}>
      {/* Hero Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '5rem 1rem 4rem 1rem',
        position: 'relative',
      }}>
        {/* Glowing badge */}
        <div
          className="badge badge-primary animate-pulse-glow"
          style={{
            marginBottom: '1.75rem',
            padding: '6px 16px',
            fontSize: '0.78rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          ⚡ Human-Centric AI • Powered by Gemini 1.5 Flash
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: '3.8rem',
          lineHeight: '1.1',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
          maxWidth: '860px',
        }}>
          Transform Your Resume into a <span className="gradient-text">Career Magnet</span>
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          maxWidth: '640px',
          marginBottom: '2.5rem',
          lineHeight: '1.65',
        }}>
          Experience real-time ATS match scoring, empathetic skill-gap coaching, 1-click custom cover letters, and AI mock interview practice.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/candidate/dashboard" className="btn btn-primary btn-lg">
            🚀 Scan My Resume Free
          </Link>
          <Link href="/candidate/jobs" className="btn btn-secondary btn-lg">
            🔍 Explore Open Roles
          </Link>
        </div>

        {/* KPI Stat Pills */}
        <div style={{
          display: 'flex',
          gap: '2.5rem',
          marginTop: '4rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>98.4%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS Pass Accuracy</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--brand-accent)' }}>&lt; 3 Sec</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Parsing Speed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>100% Free</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zero Cost Forever</div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Cards */}
      <section style={{ marginTop: '3rem', marginBottom: '6rem' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', fontWeight: 800 }}>
          Human-Centric <span className="gradient-text">Intelligence Stack</span>
        </h2>

        <div className="grid-auto">
          <GlassCard style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '14px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem',
            }}>
              🎯
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Dual-Engine ATS Scorer</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Combines TF-IDF vectorization with pure-Python n-gram Jaccard fallbacks to measure true semantic alignment against HR tracking filters.
            </p>
          </GlassCard>

          <GlassCard style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '14px',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem',
            }}>
              🧠
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Empathetic AI Career Coach</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Gemini AI provides constructive, human-like feedback, identifying skill gaps, portfolio projects to build, and 4-step action roadmaps.
            </p>
          </GlassCard>

          <GlassCard style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '14px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem',
            }}>
              ✍️
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>1-Click Cover Letter & Interview Prep</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              Generates tailored cover letters with copy-to-clipboard functionality and generates custom mock interview questions for your targeted role.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Featured Active Postings</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Score your candidate profile against these roles immediately.</p>
          </div>
          <Link href="/candidate/jobs" style={{ fontSize: '0.9rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
            Browse All Opportunities →
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
            <p style={{ color: 'var(--text-secondary)' }}>No featured jobs active at the moment.</p>
          </GlassCard>
        )}
      </section>

      {/* Recruiter Callout Card */}
      <section style={{ marginTop: '7rem' }}>
        <GlassCard style={{
          padding: '3.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Hiring Managers & Recruiters</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '540px', marginBottom: '2rem', lineHeight: '1.6' }}>
            Access our Recruiter Command Center to track inbound candidate pipelines, analyze score distributions with charts, and evaluate applicants faster.
          </p>
          <Link href="/login" className="btn btn-primary btn-lg">
            Recruiter Login Workspace →
          </Link>
        </GlassCard>
      </section>
    </main>
  );
}
