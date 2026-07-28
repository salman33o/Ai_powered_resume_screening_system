'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchRecruiterAnalytics } from '@/lib/api';
import GlassCard from '@/components/GlassCard';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export default function RecruiterDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'recruiter')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    async function loadData() {
      if (!user || user.role !== 'recruiter') return;
      try {
        const res = await fetchRecruiterAnalytics();
        setStats(res.stats);
        setApplications(res.applications || []);
      } catch (err) {
        console.error('Failed to load recruiter analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (isLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 100px)' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  // Pre-process chart data: group scores into ranges
  const scoreDistribution = [
    { range: '0-49', count: 0, color: '#ef4444' },
    { range: '50-74', count: 0, color: '#f59e0b' },
    { range: '75-100', count: 0, color: '#10b981' },
  ];

  applications.forEach((app) => {
    const score = app.ats_score || 0;
    if (score < 50) scoreDistribution[0].count++;
    else if (score < 75) scoreDistribution[1].count++;
    else scoreDistribution[2].count++;
  });

  return (
    <main className="page-wrapper animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Recruiter Command Center</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Monitor inbound applicant pipelines, analyze scoring distributions, and make data-driven hiring decisions.
        </p>
      </div>

      {stats && (
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }} className="grid-auto">
          <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Applicants
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stats.total_applications}</span>
          </GlassCard>

          <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Postings
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{stats.active_jobs}</span>
          </GlassCard>

          <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Registered Candidates
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--brand-accent)' }}>{stats.total_candidates}</span>
          </GlassCard>

          <GlassCard style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Avg. Matching Score
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>{stats.avg_ats_score}%</span>
          </GlassCard>
        </section>
      )}

      {/* Chart Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '3rem' }}>
        <GlassCard style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>ATS Match Rating Distribution</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <XAxis dataKey="range" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{
                    background: 'var(--bg-raised)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>

      {/* Applications Table */}
      <section>
        <GlassCard style={{ padding: '2rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Pipeline Candidates</h3>
          {applications.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Candidate</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Target Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Applied On</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Score Rating</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{app.candidate_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.candidate_email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>{app.job_title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.company_name}</div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <span className={`badge ${
                        app.ats_score >= 75 ? 'badge-success' : app.ats_score >= 50 ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {app.ats_score !== null ? `${Math.round(app.ats_score)}%` : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
              No applications received in the dashboard pipeline yet.
            </p>
          )}
        </GlassCard>
      </section>
    </main>
  );
}
