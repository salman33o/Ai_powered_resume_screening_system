import '../styles/globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import ThreeCanvas from '@/components/ThreeCanvas';

export const metadata: Metadata = {
  title: 'ResumeAI — Next-Gen AI Resume Screening & Career Intelligence',
  description: 'Ultra-modern AI Resume Screening Platform powered by Gemini AI. Get instant ATS scores, human-centric skill gap analysis, custom cover letters, and mock interview prep.',
  keywords: 'resume analyzer, ATS score, AI resume reviewer, 3D resume scanner, job matching platform',
  openGraph: {
    title: 'ResumeAI — Next-Gen AI Resume Screening & Career Intelligence',
    description: 'Ultra-modern AI Resume Screening Platform powered by Gemini AI. Get instant ATS scores, human-centric skill gap analysis, and interview prep.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <ThreeCanvas />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Navbar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
