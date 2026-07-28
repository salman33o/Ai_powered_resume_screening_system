import '../styles/globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ResumeAI — AI-Powered Resume Analyzer',
  description: 'Analyze your resume with Gemini AI. Get ATS scores, skill gap analysis, cover letters, and career suggestions — all free.',
  keywords: 'resume analyzer, ATS score, AI resume, job matching, cover letter generator',
  openGraph: {
    title: 'ResumeAI — AI-Powered Resume Analyzer',
    description: 'Analyze your resume with Gemini AI. Get ATS scores, skill gap analysis, and career suggestions — all free.',
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
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
