'use client';

import React, { useEffect, useState } from 'react';
import { fetchJobPostings } from '@/lib/api';
import JobCard from '@/components/JobCard';
import GlassCard from '@/components/GlassCard';

export default function CandidateJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await fetchJobPostings('Published');
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const loc = locationQuery.toLowerCase();
    const filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.company_name.toLowerCase().includes(query) ||
        job.jd_text.toLowerCase().includes(query);
      const matchesLoc = !loc || (job.location && job.location.toLowerCase().includes(loc));
      return matchesSearch && matchesLoc;
    });
    setFilteredJobs(filtered);
  }, [searchQuery, locationQuery, jobs]);

  return (
    <main className="page-wrapper animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Explore Opportunities</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Browse open roles and instantly assess matching index scores with your profile.
        </p>
      </div>

      {/* Filter controls */}
      <GlassCard style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '2 1 240px' }}>
            <label className="form-label">Search Job Title or Company</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Python, React, StartupHub"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: '1 1 180px' }}>
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Remote, Bangalore"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
        </div>
      </GlassCard>

      {/* Jobs grid */}
      {loading ? (
        <div className="grid-auto">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-card skeleton" style={{ height: '220px' }} />
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid-auto">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <GlassCard style={{ padding: '4rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No opportunities found matching your criteria.</p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setSearchQuery(''); setLocationQuery(''); }}
          >
            Clear Filters
          </button>
        </GlassCard>
      )}
    </main>
  );
}
