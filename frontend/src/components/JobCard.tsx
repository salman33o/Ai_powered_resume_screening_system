'use client';

import React from 'react';
import Link from 'next/link';

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company_name: string;
    location?: string;
    jd_text?: string;
    status?: string;
  };
  matchScore?: number;
}

function scoreColor(score: number) {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export default function JobCard({ job, matchScore }: JobCardProps) {
  const excerpt = job.jd_text
    ? job.jd_text.replace(/\n+/g, ' ').slice(0, 120) + '...'
    : 'View job details to learn more about this position.';

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {job.title}
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--brand-primary)', fontWeight: 500 }}>
            {job.company_name}
          </p>
        </div>
        {matchScore !== undefined && (
          <div style={{
            flexShrink: 0,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: `conic-gradient(${scoreColor(matchScore)} ${matchScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: scoreColor(matchScore),
          }}>
            {Math.round(matchScore)}
          </div>
        )}
      </div>

      {/* Location */}
      {job.location && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <span>📍</span>
          <span>{job.location}</span>
        </div>
      )}

      {/* Excerpt */}
      <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
        {excerpt}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span className={`badge ${job.status === 'Published' ? 'badge-success' : 'badge-muted'}`}>
          {job.status || 'Published'}
        </span>
        <Link href={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
          View & Apply →
        </Link>
      </div>
    </div>
  );
}
