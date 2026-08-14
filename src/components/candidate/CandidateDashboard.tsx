import React from 'react';
import { 
  StructuredResume, 
  JobRequirement, 
  ATSScoreBreakdown 
} from '../../types';
import { 
  Sparkles, 
  FileText, 
  Target, 
  Wand2, 
  Bot, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
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
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 rounded-2xl p-5 border border-indigo-500/20 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Candidate Intelligence</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {resume.versionName}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Welcome back, {resume.fullName}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Targeting <span className="font-semibold text-white">{job.title}</span> at <span className="text-indigo-300">{job.company}</span>. Your hybrid ATS scoring model provides explainable feedback without algorithmic bias.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveView('resume-analyzer')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
            >
              <span>Deep ATS Scan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveView('resume-optimizer')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-all"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Optimize Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 3-Card Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Overall Match Gauge Card */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Overall ATS Match</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore >= 80 ? 'High Fit' : analysis.overallScore >= 65 ? 'Moderate' : 'Needs Optimization'}
            </span>
          </div>

          <div className="flex items-baseline space-x-3 my-4">
            <span className="text-5xl font-black text-white tracking-tight">
              {analysis.overallScore}%
            </span>
            <div className="text-xs text-slate-400">
              <p className="font-semibold text-slate-200">Deterministic Engine</p>
              <p>Weighted 7-factor model</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Confidence Index:</span>
            <span className="font-semibold text-cyan-400">{analysis.confidenceScore}% (High Extraction Quality)</span>
          </div>
        </div>

        {/* Skill Verification Snapshot */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Skill Alignment</span>
            <span className="text-xs text-indigo-400 font-medium">
              {analysis.components.skillsMatch.matched.length} Verified
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Required Skills</span>
              <span className="font-semibold text-white">
                {analysis.components.skillsMatch.matched.length} / {job.requiredSkills.length}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${analysis.components.skillsMatch.score}%` }}
              ></div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.components.skillsMatch.matched.slice(0, 4).map((s, idx) => (
                <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{s.skill}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-rose-400">
              {analysis.components.skillsMatch.missingRequired.length} missing skills
            </span>
            <button 
              onClick={() => setActiveView('career-skill-gap')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              <span>View Gap Roadmap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Experience & Seniority Alignment */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Experience Seniority</span>
            <span className="text-xs text-emerald-400 font-medium">
              {analysis.components.experienceMatch.titleAlignment}
            </span>
          </div>

          <div className="my-3 space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-white">
                ~{analysis.components.experienceMatch.candidateYears} yrs
              </span>
              <span className="text-xs text-slate-400">vs {job.minExperienceYears}+ yrs required</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {analysis.components.experienceMatch.evidence}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Projects Evaluated:</span>
            <span className="font-semibold text-slate-200">{resume.projects.length} Portfolios Attached</span>
          </div>
        </div>

      </div>

      {/* Quick Action Feature Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveView('resume-analyzer')}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">ATS Breakdown</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Evidence & 7 component scores</p>
        </button>

        <button
          onClick={() => setActiveView('resume-optimizer')}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Wand2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Resume Optimizer</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Truthful bullet & keyword lift</p>
        </button>

        <button
          onClick={() => setActiveView('ai-interview')}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/40 text-left transition-all group shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Bot className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">AI Interview Prep</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Grounded role questions</p>
        </button>

        <button
          onClick={() => setActiveView('resume-builder')}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Resume Builder</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Clean ATS templates & PDF</p>
        </button>
      </div>

      {/* Actionable Improvement Checklist */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Priority Resume Improvements for {job.title}
            </h3>
          </div>
          <button
            onClick={onOpenReport}
            className="text-xs text-slate-400 hover:text-white font-medium flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit PDF</span>
          </button>
        </div>

        <div className="space-y-3">
          {analysis.improvementActionItems.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
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
