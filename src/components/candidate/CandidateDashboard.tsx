import React from 'react';
import { 
  StructuredResume, 
  JobRequirement, 
  ATSScoreBreakdown 
} from '../../types';
import { 
  FileText, 
  Wand2, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Layers, 
  Briefcase,
  AlertCircle,
  HelpCircle,
  FileSearch,
  ExternalLink
} from 'lucide-react';

interface CandidateDashboardProps {
  resume: StructuredResume;
  job: JobRequirement;
  analysis: ATSScoreBreakdown;
  setActiveView: (view: string) => void;
  onOpenReport: () => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  resume,
  job,
  analysis,
  setActiveView,
  onOpenReport
}) => {
  const score = analysis.overallScore;

  // Breakdown items in numbered audit style
  const auditComponents = [
    { num: '01', name: 'SKILL MATCH', score: analysis.components.skillsMatch.score, weight: '30%' },
    { num: '02', name: 'EXPERIENCE RELEVANCE', score: analysis.components.experienceMatch.score, weight: '25%' },
    { num: '03', name: 'RESPONSIBILITIES ALIGNMENT', score: analysis.components.responsibilitiesMatch.score, weight: '20%' },
    { num: '04', name: 'PROJECTS EVIDENCE', score: analysis.components.projectsMatch.score, weight: '10%' },
    { num: '05', name: 'EDUCATION THRESHOLD', score: analysis.components.educationMatch.score, weight: '5%' },
    { num: '06', name: 'KEYWORD DENSITY', score: analysis.components.keywordsMatch.score, weight: '5%' },
    { num: '07', name: 'CERTIFICATIONS & LICENSES', score: analysis.components.certificationsMatch.score, weight: '5%' },
  ];

  return (
    <div className="space-y-4">
      
      {/* 01. Context Header: Technical Evaluation Banner */}
      <div className="surface-panel p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--accent)]">
                Evaluation Workspace
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded surface-subtle text-[var(--text-secondary)] border border-[var(--border)]">
                {resume.versionName}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] font-display mt-0.5 tracking-tight">
              Candidate: {resume.fullName}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-2xl">
              Target Position: <strong className="text-[var(--text-primary)]">{job.title}</strong> • {job.company} ({job.location})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('resume-analyzer')}
              className="btn-primary text-xs"
            >
              <span>Inspect Evaluation Spec</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveView('resume-optimizer')}
              className="btn-secondary text-xs"
            >
              <Wand2 className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Optimize Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* 02. ATS Compatibility Evaluation Instrument & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left 6 cols: Technical Instrument Gauge */}
        <div className="lg:col-span-6 surface-panel p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              ATS Compatibility Index
            </span>
            <span className="text-[11px] font-mono font-bold text-[var(--accent)]">
              {score >= 80 ? 'HIGH ALIGNMENT' : score >= 60 ? 'MODERATE ALIGNMENT' : 'REQUIRES GAP CLOSING'}
            </span>
          </div>

          {/* Instrument Reading Gauge */}
          <div className="space-y-1.5 font-mono">
            <div className="ats-instrument-scale">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
            <div className="ats-instrument-track">
              <div 
                className={`ats-instrument-fill ${score < 50 ? 'danger' : score < 70 ? 'warning' : ''}`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="text-[11px] text-[var(--text-muted)]">Certainty Index: {analysis.confidenceScore}%</span>
              <span className="text-2xl font-bold text-[var(--text-primary)]">
                {score} <span className="text-xs text-[var(--text-muted)] font-normal">/ 100</span>
              </span>
            </div>
          </div>

          <div className="hairline-divider"></div>

          {/* Structured Numbered Breakdown */}
          <div className="space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-bold pb-1 uppercase tracking-wider">
              <span>Component</span>
              <span>Weight & Score</span>
            </div>
            {auditComponents.map(item => (
              <div key={item.num} className="flex items-center justify-between py-1 border-b border-[var(--border)] text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="text-[var(--text-muted)]">{item.num}</span>
                  <span className="text-[var(--text-secondary)] font-medium">{item.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-[var(--text-muted)]">[{item.weight}]</span>
                  <span className={`font-bold ${item.score >= 80 ? 'text-[var(--success)]' : item.score >= 60 ? 'text-[var(--text-primary)]' : 'text-[var(--warning)]'}`}>
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1 flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
            <span>Deterministic Scoring Algorithm</span>
            <span className="text-[var(--text-primary)] font-semibold">ATS-Hybrid-v2.6</span>
          </div>
        </div>

        {/* Right 6 cols: Candidate Profile Snapshot & Quick Action Module */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Candidate Analysis Brief Card */}
          <div className="surface-panel p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Candidate Profile Metadata
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">
                ID: {resume.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Candidate Name</span>
                <p className="font-bold text-[var(--text-primary)] font-sans text-xs">{resume.fullName}</p>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Location</span>
                <p className="text-[var(--text-primary)]">{resume.location}</p>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Experience Records</span>
                <p className="text-[var(--text-primary)]">{resume.experience.length} Positions Cataloged</p>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block">Verified Skills</span>
                <p className="text-[var(--text-primary)]">{resume.skills.technical.length} Technical Skills</p>
              </div>
            </div>

            <div className="hairline-divider"></div>

            <div>
              <span className="text-[10px] text-[var(--text-muted)] block mb-1">Executive Summary Snippet</span>
              <p className="text-[11px] text-[var(--text-secondary)] font-sans leading-relaxed line-clamp-3">
                {resume.summary}
              </p>
            </div>
          </div>

          {/* Module Direct Jump Links */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveView('ai-interview')}
              className="surface-subtle p-3 rounded border border-[var(--border)] hover:border-[var(--border-strong)] text-left space-y-1 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[var(--accent)]">
                <span className="font-bold text-[11px]">Interview Prep</span>
                <Bot className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10.5px] text-[var(--text-muted)] font-sans">
                50+ Grounded questions tailored to {resume.fullName.split(' ')[0]}
              </p>
            </button>

            <button
              onClick={() => setActiveView('job-tracker')}
              className="surface-subtle p-3 rounded border border-[var(--border)] hover:border-[var(--border-strong)] text-left space-y-1 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-[var(--accent)]">
                <span className="font-bold text-[11px]">Job Directory</span>
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10.5px] text-[var(--text-muted)] font-sans">
                Browse 20 sectors and 80+ specialized positions
              </p>
            </button>
          </div>

        </div>

      </div>

      {/* 03. Skill Matching Evidence Audit Table */}
      <div className="surface-panel p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] font-mono">
          <div>
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Skill Alignment & Evidence Verification Audit
            </h3>
            <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">
              Deterministic verification of candidate skills against requirement specifications.
            </p>
          </div>
          <span className="text-[11px] font-bold text-[var(--accent)]">
            {analysis.components.skillsMatch.matched.length} of {job.requiredSkills.length} Matched
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="eval-table">
            <thead>
              <tr>
                <th className="eval-th w-1/3">Required Competency</th>
                <th className="eval-th w-1/2">Candidate CV Evidence</th>
                <th className="eval-th text-right">Verification Result</th>
              </tr>
            </thead>
            <tbody>
              {analysis.components.skillsMatch.matched.map((m, idx) => (
                <tr key={`matched-${idx}`} className="hover:bg-[var(--surface-subtle)] transition-colors">
                  <td className="eval-td font-medium text-[var(--text-primary)]">
                    {m.skill}
                  </td>
                  <td className="eval-td text-[var(--text-secondary)] font-sans text-xs">
                    {m.evidenceContext || `Verified in candidate work history and profile skills.`}
                  </td>
                  <td className="eval-td text-right">
                    <span className="status-match">
                      <span>●</span>
                      <span>MATCH</span>
                    </span>
                  </td>
                </tr>
              ))}

              {analysis.components.skillsMatch.missing.map((sk, idx) => (
                <tr key={`missing-${idx}`} className="hover:bg-[var(--surface-subtle)] transition-colors">
                  <td className="eval-td font-medium text-[var(--text-primary)]">
                    {sk}
                  </td>
                  <td className="eval-td text-[var(--text-muted)] font-sans text-xs italic">
                    Not detected in parsed resume sections.
                  </td>
                  <td className="eval-td text-right">
                    <span className="status-gap">
                      <span>●</span>
                      <span>GAP</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
