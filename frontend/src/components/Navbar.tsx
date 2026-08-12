'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
        }}>
          ⚡
        </div>
        <span style={{
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 800,
          fontSize: '1.1rem',
          background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          ResumeAI
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <NavLink href="/candidate/jobs" active={isActive('/candidate/jobs')}>Jobs</NavLink>
        {user?.role === 'candidate' && (
          <NavLink href="/candidate/dashboard" active={isActive('/candidate/dashboard')}>Mode 1: Candidate Scan</NavLink>
        )}
        {user?.role === 'recruiter' && (
          <>
            <NavLink href="/recruiter/dashboard" active={isActive('/recruiter/dashboard')}>Dashboard</NavLink>
            <NavLink href="/recruiter/studio" active={isActive('/recruiter/studio')}>Mode 2: AI Studio</NavLink>
          </>
        )}
      </div>

      {/* Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '999px',
              padding: '6px 14px 6px 8px',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, color: '#fff',
              }}>
                {user.username[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {user.username}
              </span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={logout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-secondary btn-sm">Sign in</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        padding: '6px 14px',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: active ? 'var(--brand-primary)' : 'var(--text-secondary)',
        background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
        transition: 'all 200ms ease',
        textDecoration: 'none',
      }}
    >
      {children}
    </Link>
  );
}
