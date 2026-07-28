'use client';

import React, { useCallback, useRef, useState } from 'react';

interface ResumeUploaderProps {
  onFile: (file: File) => void;
  uploading?: boolean;
  uploadedName?: string;
}

export default function ResumeUploader({ onFile, uploading = false, uploadedName }: ResumeUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`drop-zone${dragging ? ' drag-over' : ''}`}
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        onChange={handleChange}
        disabled={uploading}
      />

      {uploading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
            Parsing your resume with AI…
          </p>
        </div>
      ) : uploadedName ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem',
          }}>✓</div>
          <p style={{ color: '#6ee7b7', fontWeight: 600, fontSize: '0.95rem' }}>
            {uploadedName}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Click to replace
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '2px dashed rgba(99, 102, 241, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem',
            animation: 'float 3s ease-in-out infinite',
          }}>
            📄
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '4px', fontSize: '1rem' }}>
              Drop your resume here
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              or <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>click to browse</span>
            </p>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            Supports PDF, DOCX, TXT
          </p>
        </div>
      )}
    </div>
  );
}
