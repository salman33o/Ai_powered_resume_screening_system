'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/lib/api';
import GlassCard from '@/components/GlassCard';

export default function LoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res: any = await loginUser(username, password);
      if (res.requires_2fa) {
        setError('2FA verification is required for this account.');
        setLoading(false);
        return;
      }

      setSession(res.user, res.session_token);
      
      // Redirect based on user role
      if (res.user.role === 'recruiter') {
        router.push('/recruiter/dashboard');
      } else {
        router.push('/candidate/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response) {
        try {
          const body = await err.response.json();
          setError(body.detail || 'Login failed.');
        } catch {
          setError('Invalid credentials.');
        }
      } else {
        setError('Connection error. Please try again.');
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
      <GlassCard style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sign in to continue to your dashboard</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {error}
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
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
            Sign up
          </Link>
        </div>
      </GlassCard>
    </main>
  );
}
