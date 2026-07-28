'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/api';
import GlassCard from '@/components/GlassCard';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      await registerUser({ username, email, password, role });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      if (err.response) {
        try {
          const body = await err.response.json();
          setError(body.detail || 'Registration failed.');
        } catch {
          setError('Could not complete registration. Check fields.');
        }
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper animate-fade-in" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 100px)',
    }}>
      <GlassCard style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Get started with your resume assessment profile</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={success}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={success}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={success}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">I am a...</label>
            <select
              id="role"
              className="form-input form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={success}
            >
              <option value="candidate">Candidate (Job Seeker)</option>
              <option value="recruiter">Recruiter (Hiring Manager)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }} disabled={loading || success}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </GlassCard>
    </main>
  );
}
