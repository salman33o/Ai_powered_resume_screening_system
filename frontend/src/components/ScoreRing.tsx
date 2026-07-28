'use client';

import React, { useEffect, useRef } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showVerdict?: boolean;
}

function getColor(score: number) {
  if (score >= 75) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function getVerdict(score: number) {
  if (score >= 75) return 'Strong Match';
  if (score >= 50) return 'Potential Match';
  return 'Weak Match';
}

export default function ScoreRing({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'ATS Score',
  showVerdict = true,
}: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getColor(score);
  const verdict = getVerdict(score);
  const progress = Math.min(100, Math.max(0, score));

  useEffect(() => {
    if (!circleRef.current) return;
    const offset = circumference - (progress / 100) * circumference;
    circleRef.current.style.strokeDashoffset = `${circumference}`;
    circleRef.current.style.transition = 'none';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!circleRef.current) return;
        circleRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        circleRef.current.style.strokeDashoffset = `${offset}`;
      });
    });
  }, [progress, circumference]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          boxShadow: `0 0 30px ${color}40`,
          pointerEvents: 'none',
        }} />
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        {/* Center text */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: size * 0.22,
            fontWeight: 800,
            fontFamily: 'Outfit, sans-serif',
            color,
            lineHeight: 1,
          }}>
            {Math.round(score)}
          </span>
          <span style={{
            fontSize: size * 0.1,
            color: 'var(--text-muted)',
            fontWeight: 500,
            marginTop: 2,
          }}>/ 100</span>
        </div>
      </div>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        {label}
      </span>
      {showVerdict && (
        <span className={`badge ${score >= 75 ? 'badge-success' : score >= 50 ? 'badge-warning' : 'badge-danger'}`}>
          {verdict}
        </span>
      )}
    </div>
  );
}
