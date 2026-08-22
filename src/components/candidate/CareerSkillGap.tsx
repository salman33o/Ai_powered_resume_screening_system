import React from 'react';
import { StructuredResume, JobRequirement, ATSScoreBreakdown } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Award, 
  Zap 
} from 'lucide-react';

interface CareerSkillGapProps {
  resume: StructuredResume;
  job: JobRequirement;
  analysis: ATSScoreBreakdown;
  setActiveView: (view: string) => void;
}

export const CareerSkillGap: React.FC<CareerSkillGapProps> = ({
  resume,
  job,
  analysis,
  setActiveView
}) => {
  const missingSkills = analysis.components.skillsMatch.missingRequired;
  const preferredMissing = analysis.components.skillsMatch.missingPreferred;

  return (
    <div className="space-y-4">
      
      {/* 01. Header */}
      <div className="surface-panel p-4">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
            Competency Gap Analysis
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded surface-subtle text-[var(--text-secondary)] border border-[var(--border)]">
            Bridging Strategy
          </span>
        </div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] font-display mt-0.5 tracking-tight">
          Competency & Skill Gap Roadmap
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Actionable upskilling paths and verifiable project milestones to address detected criteria for <strong className="text-[var(--text-primary)]">{job.title}</strong>.
        </p>
      </div>

      {/* 02. Grid: Gap Overview vs Learning Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left 5 Cols: Detected Skill Gaps */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="surface-panel p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--danger)] flex items-center space-x-1.5 pb-2 border-b border-[var(--border)]">
              <XCircle className="w-3.5 h-3.5" />
              <span>Mandatory Gaps Detected ({missingSkills.length})</span>
            </h3>

            {missingSkills.length === 0 ? (
              <div className="p-3 rounded surface-subtle border border-[var(--success)]/30 text-xs font-mono text-[var(--success)] flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>All mandatory competencies verified in candidate profile.</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {missingSkills.map((sk, idx) => (
                  <div key={idx} className="p-2.5 rounded surface-subtle border border-[var(--border)] flex items-center justify-between text-xs font-mono">
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{sk}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">Priority requirement for ATS filter clearance</p>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded surface-panel text-[var(--danger)] border border-[var(--danger)]/30">
                      Tier 1
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Skill Gaps */}
          {preferredMissing.length > 0 && (
            <div className="surface-panel p-4 space-y-2.5 font-mono text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--warning)] pb-2 border-b border-[var(--border)]">
                Preferred Differentiators ({preferredMissing.length})
              </h3>
              <div className="space-y-1.5">
                {preferredMissing.map((sk, idx) => (
                  <div key={idx} className="p-2 rounded surface-subtle border border-[var(--border)] flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)] font-medium">{sk}</span>
                    <span className="text-[9px] text-[var(--text-muted)]">Optional</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 7 Cols: Recommended Step-by-Step Learning Path */}
        <div className="lg:col-span-7 space-y-3">
          <div className="surface-panel p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center space-x-1.5 pb-2 border-b border-[var(--border)]">
              <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Target Roadmap for {job.title}</span>
            </h3>

            <div className="space-y-2.5">
              
              {/* Step 1 */}
              <div className="p-3 rounded surface-subtle border border-[var(--border)] space-y-1 text-xs font-mono">
                <div className="flex items-center space-x-1.5 text-[var(--accent)] font-bold text-[11px]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Phase 1: Practical Stack Upskilling</span>
                </div>
                <p className="text-[var(--text-secondary)] font-sans leading-relaxed">
                  Focus on mastering <strong className="text-[var(--text-primary)]">{missingSkills.slice(0, 2).join(' & ') || 'cloud data platforms and dbt'}</strong> through hands-on benchmark implementations.
                </p>
                <div className="text-[10px] text-[var(--text-muted)] pt-0.5">
                  <span>Estimated commitment: 2-3 weeks</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 rounded surface-subtle border border-[var(--border)] space-y-1 text-xs font-mono">
                <div className="flex items-center space-x-1.5 text-[var(--accent)] font-bold text-[11px]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Phase 2: Verifiable Project Demonstration</span>
                </div>
                <p className="text-[var(--text-secondary)] font-sans leading-relaxed">
                  Publish a verified repository or portfolio artifact integrating <strong className="text-[var(--text-primary)]">{job.requiredSkills.slice(0, 2).join(', ')}</strong> with comprehensive documentation and performance benchmarks.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3 rounded surface-subtle border border-[var(--border)] space-y-1 text-xs font-mono">
                <div className="flex items-center space-x-1.5 text-[var(--success)] font-bold text-[11px]">
                  <Award className="w-3.5 h-3.5" />
                  <span>Phase 3: Industry Credential Target</span>
                </div>
                <p className="text-[var(--text-secondary)] font-sans leading-relaxed">
                  Validate domain mastery by taking a certified exam or accredited credential that substantiates keyword density during automated screening.
                </p>
              </div>

            </div>

            <div className="pt-2 border-t border-[var(--border)] flex justify-end">
              <button
                onClick={() => setActiveView('resume-optimizer')}
                className="btn-primary text-xs"
              >
                <span>Optimize Resume for Current Stack</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
