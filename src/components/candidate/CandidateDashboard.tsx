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
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Layers, 
  ChevronRight 
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
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-[#0E1A29]';
    if (score >= 60) return 'text-teal-400 border-teal-500/40 bg-[#0E1A29]';
    if (score >= 40) return 'text-amber-400 border-amber-500/40 bg-[#0E1A29]';
    return 'text-rose-400 border-rose-500/40 bg-[#0E1A29]';
  };

  return (
    <div className="space-y-4">
      
      {/* Top Hero Banner */}
      <div className="bg-[#131F30] rounded-lg p-5 border border-[#223348]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Candidate Workspace</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                {resume.versionName}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#E6EAF0] font-display mt-1 tracking-tight">
              Candidate: <span className="text-teal-300">{resume.fullName}</span>
            </h1>
            <p className="text-xs text-[#8A97A8] mt-1 max-w-2xl leading-relaxed">
              Target role: <strong className="text-[#E6EAF0]">{job.title}</strong> at <span className="text-teal-300 font-medium">{job.company}</span>. Deterministic hybrid evaluation and explainable ATS audit trail.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveView('resume-analyzer')}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <span>Inspect ATS Spec</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveView('resume-optimizer')}
              className="px-3.5 py-2 bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] rounded font-medium text-xs flex items-center space-x-1.5 border border-[#223348] transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Optimize Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 3-Card Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Overall Match Gauge Card */}
        <div className="bg-[#131F30] rounded-lg p-4 flex flex-col justify-between border border-[#223348]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">Overall ATS Match</span>
            <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore >= 80 ? 'High Fit' : analysis.overallScore >= 60 ? 'Moderate' : 'Needs Optimization'}
            </span>
          </div>

          <div className="flex items-baseline space-x-3 my-4">
            <span className="text-5xl font-bold font-mono text-[#E6EAF0] tracking-tight">
              {analysis.overallScore}%
            </span>
            <div className="text-[11px] text-[#8A97A8]">
              <p className="font-semibold text-[#E6EAF0]">Deterministic Model</p>
              <p>7-factor weighted</p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#223348] flex items-center justify-between text-xs text-[#8A97A8] font-mono">
            <span>Certainty Index:</span>
            <span className="font-bold text-teal-400">{analysis.confidenceScore}%</span>
          </div>
        </div>

        {/* Skill Alignment Snapshot */}
        <div className="bg-[#131F30] rounded-lg p-4 flex flex-col justify-between border border-[#223348]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">Skill Alignment</span>
            <span className="text-xs text-teal-400 font-mono font-bold">
              {analysis.components.skillsMatch.matched.length} Verified
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#8A97A8]">
              <span>Coverage Ratio</span>
              <span className="font-bold text-[#E6EAF0]">
                {analysis.components.skillsMatch.matched.length} / {job.requiredSkills.length}
              </span>
            </div>
            <div className="w-full bg-[#0E1A29] rounded h-1.5 overflow-hidden border border-[#223348]">
              <div 
                className="bg-teal-500 h-full rounded transition-all"
                style={{ width: `${analysis.components.skillsMatch.score}%` }}
              ></div>
            </div>

            <div className="flex flex-wrap gap-1 pt-1">
              {analysis.components.skillsMatch.matched.slice(0, 3).map((s, idx) => (
                <span key={idx} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0E1A29] text-teal-300 border border-[#223348] flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-400" />
                  <span>{s.skill}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#223348] flex items-center justify-between text-xs font-mono">
            <span className="text-rose-400 font-medium">
              {analysis.components.skillsMatch.missingRequired.length} missing skill(s)
            </span>
            <button 
              onClick={() => setActiveView('career-skill-gap')}
              className="text-teal-400 hover:text-teal-300 font-medium flex items-center space-x-1 transition-colors"
            >
              <span>Gap Analysis</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Experience & Seniority Alignment */}
        <div className="bg-[#131F30] rounded-lg p-4 flex flex-col justify-between border border-[#223348]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">Experience Seniority</span>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {analysis.components.experienceMatch.titleAlignment}
            </span>
          </div>

          <div className="my-3 space-y-1.5">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold font-mono text-[#E6EAF0]">
                ~{analysis.components.experienceMatch.candidateYears} yrs
              </span>
              <span className="text-xs text-[#8A97A8]">vs {job.minExperienceYears}+ yrs req</span>
            </div>
            <p className="text-xs text-[#8A97A8] leading-relaxed line-clamp-2">
              {analysis.components.experienceMatch.evidence}
            </p>
          </div>

          <div className="pt-2.5 border-t border-[#223348] flex items-center justify-between text-xs font-mono">
            <span className="text-[#8A97A8]">Projects Logged:</span>
            <span className="font-semibold text-[#E6EAF0]">{resume.projects.length} Verified</span>
          </div>
        </div>

      </div>

      {/* Quick Feature Action Launchpad */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveView('resume-analyzer')}
          className="bg-[#131F30] hover:bg-[#17263B] p-3.5 rounded-lg text-left transition-colors border border-[#223348] group"
        >
          <div className="w-8 h-8 rounded bg-[#0E1A29] border border-[#223348] text-teal-400 flex items-center justify-center mb-2">
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[#E6EAF0] group-hover:text-teal-300 transition-colors">ATS Breakdown</p>
          <p className="text-[11px] text-[#8A97A8] mt-0.5">Component audit & metrics</p>
        </button>

        <button
          onClick={() => setActiveView('resume-optimizer')}
          className="bg-[#131F30] hover:bg-[#17263B] p-3.5 rounded-lg text-left transition-colors border border-[#223348] group"
        >
          <div className="w-8 h-8 rounded bg-[#0E1A29] border border-[#223348] text-teal-400 flex items-center justify-center mb-2">
            <Wand2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[#E6EAF0] group-hover:text-teal-300 transition-colors">Resume Optimizer</p>
          <p className="text-[11px] text-[#8A97A8] mt-0.5">Keyword density & impact</p>
        </button>

        <button
          onClick={() => setActiveView('ai-interview')}
          className="bg-[#131F30] hover:bg-[#17263B] p-3.5 rounded-lg text-left transition-colors border border-[#223348] group"
        >
          <div className="w-8 h-8 rounded bg-[#0E1A29] border border-[#223348] text-teal-400 flex items-center justify-center mb-2">
            <Bot className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[#E6EAF0] group-hover:text-teal-300 transition-colors">Interview Prep</p>
          <p className="text-[11px] text-[#8A97A8] mt-0.5">Role-tailored simulation</p>
        </button>

        <button
          onClick={() => setActiveView('resume-builder')}
          className="bg-[#131F30] hover:bg-[#17263B] p-3.5 rounded-lg text-left transition-colors border border-[#223348] group"
        >
          <div className="w-8 h-8 rounded bg-[#0E1A29] border border-[#223348] text-teal-400 flex items-center justify-center mb-2">
            <Layers className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[#E6EAF0] group-hover:text-teal-300 transition-colors">Resume Builder</p>
          <p className="text-[11px] text-[#8A97A8] mt-0.5">Standards-compliant export</p>
        </button>
      </div>

      {/* Actionable Priority Improvement Checklist */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348]">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold text-[#E6EAF0] uppercase tracking-wider font-mono">
              Priority Improvement Checklist for {job.title}
            </h3>
          </div>
          <button
            onClick={onOpenReport}
            className="text-xs text-[#8A97A8] hover:text-[#E6EAF0] font-medium flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0E1A29] border border-[#223348] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Download Audit PDF</span>
          </button>
        </div>

        <div className="space-y-2">
          {analysis.improvementActionItems.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-start space-x-2.5 p-2.5 rounded bg-[#0E1A29] border border-[#223348] text-xs text-[#E6EAF0]"
            >
              <div className="w-5 h-5 rounded bg-[#131F30] border border-[#223348] text-teal-400 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                {idx + 1}
              </div>
              <p className="leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

