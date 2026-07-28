'use client';

import React from 'react';

interface SkillBadgeProps {
  skill: string;
  matched?: boolean;
  size?: 'sm' | 'md';
}

export default function SkillBadge({ skill, matched = true, size = 'md' }: SkillBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'sm' ? '2px 8px' : '4px 12px',
        borderRadius: '999px',
        fontSize: size === 'sm' ? '0.7rem' : '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        border: '1px solid',
        transition: 'all 250ms ease',
        background: matched
          ? 'rgba(16, 185, 129, 0.12)'
          : 'rgba(239, 68, 68, 0.1)',
        borderColor: matched
          ? 'rgba(16, 185, 129, 0.35)'
          : 'rgba(239, 68, 68, 0.3)',
        color: matched ? '#6ee7b7' : '#fca5a5',
      }}
    >
      <span style={{ fontSize: '0.6em' }}>{matched ? '✓' : '✗'}</span>
      {skill}
    </span>
  );
}
