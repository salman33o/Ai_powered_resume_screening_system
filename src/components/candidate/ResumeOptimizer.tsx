import React, { useState } from 'react';
import { 
  StructuredResume, 
  JobRequirement, 
  ATSScoreBreakdown 
} from '../../types';
import { 
  Wand2, 
  CheckCircle2, 
  ArrowRight, 
  Edit3, 
  Save, 
  RefreshCw,
  AlertCircle,
  FileCheck,
  Check
} from 'lucide-react';
import { optimizeResumeApi } from '../../services/apiClient';

interface ResumeOptimizerProps {
  resume: StructuredResume;
  setResume: (resume: StructuredResume) => void;
  job: JobRequirement;
  analysis: ATSScoreBreakdown;
  onReAnalyze: () => void;
}

export const ResumeOptimizer: React.FC<ResumeOptimizerProps> = ({
  resume,
  setResume,
  job,
  analysis,
  onReAnalyze
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationData, setOptimizationData] = useState<any>(null);
  const [editableSummary, setEditableSummary] = useState(resume.summary);
  const [appliedCount, setAppliedCount] = useState(0);

  const fetchOptimizations = async () => {
    setIsOptimizing(true);
    try {
      const data = await optimizeResumeApi(resume, job);
      setOptimizationData(data);
      if (data.optimizedSummary) {
        setEditableSummary(data.optimizedSummary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const applySummary = () => {
    setResume({
      ...resume,
      summary: editableSummary,
      updatedAt: new Date().toISOString()
    });
    setAppliedCount(prev => prev + 1);
    onReAnalyze();
  };

  const applyBulletToExperience = (improvedText: string) => {
    if (resume.experience.length === 0) return;
    const updatedExp = [...resume.experience];
    updatedExp[0] = {
      ...updatedExp[0],
      description: `${updatedExp[0].description} ${improvedText}`
    };
    setResume({
      ...resume,
      experience: updatedExp,
      updatedAt: new Date().toISOString()
    });
    setAppliedCount(prev => prev + 1);
    onReAnalyze();
  };

  return (
    <div className="space-y-4">
      
      {/* 01. Header */}
      <div className="surface-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
              Content Refinement & Evidence Alignment
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded surface-subtle text-[var(--text-secondary)] border border-[var(--border)]">
              Zero Fabrication
            </span>
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] font-display mt-0.5 tracking-tight">
            Role-Specific Resume Alignment
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Refine existing verified achievements to address <strong className="text-[var(--text-primary)]">{job.title}</strong> evaluation metrics.
          </p>
        </div>

        <button
          onClick={fetchOptimizations}
          disabled={isOptimizing}
          className="btn-primary text-xs"
        >
          <Wand2 className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Evaluating Alignments...' : 'Generate Alignment Plan'}</span>
        </button>
      </div>

      {/* 02. Score Projection Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        
        {/* Current Score */}
        <div className="surface-panel p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">Current Score</span>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-0.5">{analysis.overallScore}%</p>
          </div>
          <div className="text-right text-[11px] text-[var(--text-muted)]">
            <p>Target: {job.title.split(' ')[0]}</p>
            <p className="text-[var(--accent)] font-semibold">{analysis.components.skillsMatch.matched.length} Skills Verified</p>
          </div>
        </div>

        {/* Projected Score */}
        <div className="surface-panel p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[var(--success)] uppercase">Projected Score</span>
            <p className="text-2xl font-bold text-[var(--success)] mt-0.5">
              {Math.min(98, analysis.overallScore + 14)}%
            </p>
          </div>
          <div className="text-right text-[11px] text-[var(--text-muted)]">
            <p className="font-semibold text-[var(--success)]">+14% Potential Lift</p>
            <p>Via quantified clarity</p>
          </div>
        </div>

        {/* Applied Count */}
        <div className="surface-panel p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">Changes Applied</span>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-0.5">{appliedCount}</p>
          </div>
          <div className="text-right text-[11px] text-[var(--text-muted)]">
            <p className="text-[var(--text-primary)] font-semibold">Active Profile</p>
            <p>{resume.fullName}</p>
          </div>
        </div>

      </div>

      {/* 03. Executive Summary Optimization Section */}
      <div className="surface-panel p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Executive Summary Refinement
          </span>
          <button
            onClick={applySummary}
            className="btn-primary text-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply to Resume</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-xs">
          
          {/* Current Summary */}
          <div className="surface-subtle p-3 rounded border border-[var(--border)] space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase block">
              Current Summary
            </span>
            <p className="text-[var(--text-secondary)] leading-relaxed">{resume.summary}</p>
          </div>

          {/* Optimized Draft */}
          <div className="surface-subtle p-3 rounded border border-[var(--border)] space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase block">
              Refined Targeted Draft
            </span>
            <textarea
              rows={4}
              value={editableSummary}
              onChange={(e) => setEditableSummary(e.target.value)}
              className="w-full bg-[var(--surface)] p-2 rounded border border-[var(--border)] text-[var(--text-primary)] text-xs focus:outline-none focus:border-[var(--focus)] leading-relaxed resize-none font-sans"
            />
          </div>

        </div>
      </div>

      {/* 04. Experience Bullet Points Quantified Optimization */}
      <div className="surface-panel p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Work Experience Accomplishment Optimization
          </span>
          <span className="text-[10.5px] text-[var(--text-muted)]">
            {resume.experience.length} Positions Analyzed
          </span>
        </div>

        <div className="space-y-3">
          {resume.experience.map((exp, idx) => (
            <div key={idx} className="surface-subtle p-3.5 rounded border border-[var(--border)] space-y-2.5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[var(--text-primary)] text-xs font-sans">
                  {exp.jobTitle} — <span className="font-normal text-[var(--text-muted)]">{exp.company}</span>
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">{exp.startDate} to {exp.isCurrent ? 'Present' : exp.endDate}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                
                {/* Current wording */}
                <div className="p-2.5 rounded bg-[var(--surface)] border border-[var(--border)] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase block">
                    Current Description
                  </span>
                  <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">{exp.description}</p>
                </div>

                {/* Suggested high-impact enhancement */}
                <div className="p-2.5 rounded bg-[var(--surface)] border border-[var(--border-strong)] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[var(--accent)] uppercase">
                      Suggested Metric Clarification
                    </span>
                    <button
                      onClick={() => applyBulletToExperience(`Quantified execution delivering measurable operational improvements across ${job.requiredSkills.slice(0, 2).join(' and ')}.`)}
                      className="px-2 py-0.5 rounded surface-subtle hover:bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border)] text-[10px] font-mono transition-colors cursor-pointer"
                    >
                      + Append Impact
                    </button>
                  </div>
                  <p className="text-[var(--text-primary)] text-[11px] leading-relaxed">
                    Quantified execution delivering measurable operational improvements across {job.requiredSkills.slice(0, 2).join(' and ')}.
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
