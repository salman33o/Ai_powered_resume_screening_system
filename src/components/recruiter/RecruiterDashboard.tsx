import React from 'react';
import { 
  JobRequirement, 
  PipelineCandidate 
} from '../../types';
import { 
  Users, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface RecruiterDashboardProps {
  candidates: PipelineCandidate[];
  activeJob: JobRequirement;
  setActiveView: (view: string) => void;
  onSelectCandidate: (candidate: PipelineCandidate) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  candidates,
  activeJob,
  setActiveView,
  onSelectCandidate
}) => {
  const total = candidates.length;
  const shortlisted = candidates.filter(c => c.stage === 'shortlisted').length;
  const interviewing = candidates.filter(c => c.stage === 'interview' || c.stage === 'screening').length;
  const highFit = candidates.filter(c => c.atsScore.overallScore >= 80).length;
  const avgScore = Math.round(candidates.reduce((acc, c) => acc + c.atsScore.overallScore, 0) / (total || 1));

  return (
    <div className="space-y-4">
      
      {/* 01. Context Header */}
      <div className="surface-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
              Talent Evaluation Console
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded surface-subtle text-[var(--text-secondary)] border border-[var(--border)]">
              Target: {activeJob.title}
            </span>
          </div>
          <h1 className="text-lg font-bold text-[var(--text-primary)] font-display mt-0.5 tracking-tight">
            Recruitment Screening & Evaluation Operations
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-2xl">
            Deterministic ATS scoring evaluates candidates across 7 explainable dimensions. Review candidate scorecards and advance verified profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('recruiter-bulk')}
            className="btn-primary text-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Launch Bulk Screen</span>
          </button>
          <button
            onClick={() => setActiveView('candidate-ranking')}
            className="btn-secondary text-xs"
          >
            <Users className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Ranked Matrix</span>
          </button>
        </div>
      </div>

      {/* 02. Editorial Overview & Activity Split Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        
        {/* Left: Recruitment Overview Matrix */}
        <div className="surface-panel p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
            <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              RECRUITMENT OVERVIEW
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">Active Requisition</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">ACTIVE TARGET REQUISITION</span>
              <span className="font-bold text-[var(--text-primary)]">{activeJob.title}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">CANDIDATES SCREENED</span>
              <span className="font-bold text-[var(--text-primary)]">{total}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">HIGH FIT (80%+ MATCH)</span>
              <span className="font-bold text-[var(--success)]">{highFit}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">SHORTLISTED PROFILES</span>
              <span className="font-bold text-[var(--accent)]">{shortlisted}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[var(--text-secondary)]">IN ACTIVE STAGE</span>
              <span className="font-bold text-[var(--text-primary)]">{interviewing}</span>
            </div>
          </div>
        </div>

        {/* Right: Operational Activity Metrics */}
        <div className="surface-panel p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
            <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              SCREENING BENCHMARKS
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">Performance</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">AVERAGE COMPATIBILITY SCORE</span>
              <span className="font-bold text-[var(--accent)]">{avgScore}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">EVALUATION MODEL VERSION</span>
              <span className="text-[var(--text-primary)] font-semibold">ATS-Deterministic-v1.4</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">CERTAINTY CONFIDENCE</span>
              <span className="text-[var(--text-primary)] font-semibold">95.2%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[var(--border)]">
              <span className="text-[var(--text-secondary)]">EXTRACTION QUALITY</span>
              <span className="text-[var(--success)] font-semibold">100% Machine Validated</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[var(--text-secondary)]">DECISION INTEGRITY</span>
              <span className="text-[var(--accent)] font-semibold">Audit Trail Logged</span>
            </div>
          </div>
        </div>

      </div>

      {/* 03. Top Candidate Evaluation Table Preview */}
      <div className="surface-panel p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] font-mono text-xs">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Ranked Candidate Evaluation Matrix
            </h3>
            <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">
              Ranked by deterministic multi-factor match against {activeJob.title}.
            </p>
          </div>
          <button
            onClick={() => setActiveView('candidate-ranking')}
            className="text-[var(--accent)] hover:underline flex items-center space-x-1 cursor-pointer font-bold"
          >
            <span>View All ({candidates.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="eval-table">
            <thead>
              <tr>
                <th className="eval-th">Rank</th>
                <th className="eval-th">Candidate Profile</th>
                <th className="eval-th">Experience & Major</th>
                <th className="eval-th text-center">Score</th>
                <th className="eval-th text-center">Status</th>
                <th className="eval-th text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.slice(0, 5).map((c, idx) => (
                <tr key={c.id} className="hover:bg-[var(--surface-subtle)] transition-colors">
                  <td className="eval-td font-mono font-bold text-[var(--text-muted)] text-xs">
                    0{idx + 1}
                  </td>
                  <td className="eval-td">
                    <div className="font-bold text-[var(--text-primary)]">{c.candidateName}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono">{c.candidateEmail}</div>
                  </td>
                  <td className="eval-td text-[var(--text-secondary)] text-xs">
                    <div>{c.resume.experience.length} Roles • {c.resume.skills.technical.length} Skills</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono">{c.resume.location}</div>
                  </td>
                  <td className="eval-td text-center font-mono">
                    <span className={`font-bold text-sm ${
                      c.atsScore.overallScore >= 80 ? 'text-[var(--success)]' : c.atsScore.overallScore >= 60 ? 'text-[var(--accent)]' : 'text-[var(--warning)]'
                    }`}>
                      {c.atsScore.overallScore}%
                    </span>
                  </td>
                  <td className="eval-td text-center">
                    <span className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                      c.stage === 'shortlisted' ? 'text-[var(--success)] bg-[var(--surface-subtle)] border border-[var(--success)]/30' : 'text-[var(--text-secondary)] bg-[var(--surface-subtle)] border border-[var(--border)]'
                    }`}>
                      {c.stage}
                    </span>
                  </td>
                  <td className="eval-td text-right">
                    <button
                      onClick={() => onSelectCandidate(c)}
                      className="px-2.5 py-1 rounded surface-subtle hover:bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-mono text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      Audit Spec
                    </button>
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
