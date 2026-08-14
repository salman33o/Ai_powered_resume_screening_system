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
  ChevronRight,
  BarChart3
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
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 glow-border-emerald';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10 glow-border-indigo';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10 glow-border-amber';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 relative overflow-hidden shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Candidate Intelligence</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700 font-semibold">
                {resume.versionName}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display mt-1.5 tracking-tight">
              Welcome back, <span className="gradient-text-indigo">{resume.fullName}</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Targeting <span className="font-bold text-white">{job.title}</span> at <span className="text-indigo-300 font-medium">{job.company}</span>. Deterministic hybrid scoring model with explainable AI evaluation.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView('resume-analyzer')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
            >
              <span>Deep ATS Scan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('resume-optimizer')}
              className="px-5 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-2xl text-xs font-bold flex items-center space-x-2 border border-slate-700 transition-all hover:scale-[1.02]"
            >
              <Wand2 className="w-4 h-4 text-cyan-400" />
              <span>Optimize Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero 3-Card Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Overall Match Gauge Card */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall ATS Match</span>
            <span className={`text-xs px-3 py-1 rounded-full font-extrabold border ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore >= 80 ? 'High Fit' : analysis.overallScore >= 65 ? 'Moderate' : 'Needs Optimization'}
            </span>
          </div>

          <div className="flex items-baseline space-x-4 my-5">
            <span className="text-6xl font-extrabold font-display text-white tracking-tight">
              {analysis.overallScore}%
            </span>
            <div className="text-xs text-slate-400">
              <p className="font-bold text-slate-200">Deterministic Engine</p>
              <p>7-factor weighted evaluation</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Confidence Rating:</span>
            <span className="font-bold text-cyan-400">{analysis.confidenceScore}% (High Extraction)</span>
          </div>
        </div>

        {/* Skill Alignment Snapshot */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Skill Alignment</span>
            <span className="text-xs text-indigo-400 font-bold">
              {analysis.components.skillsMatch.matched.length} Verified
            </span>
          </div>

          <div className="my-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Required Skill Coverage</span>
              <span className="font-bold text-white">
                {analysis.components.skillsMatch.matched.length} / {job.requiredSkills.length}
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${analysis.components.skillsMatch.score}%` }}
              ></div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysis.components.skillsMatch.matched.slice(0, 4).map((s, idx) => (
                <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{s.skill}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-rose-400 font-semibold">
              {analysis.components.skillsMatch.missingRequired.length} missing skill(s)
            </span>
            <button 
              onClick={() => setActiveView('career-skill-gap')}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1 transition-colors"
            >
              <span>View Gap Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Experience & Seniority Alignment */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Experience Seniority</span>
            <span className="text-xs text-emerald-400 font-bold">
              {analysis.components.experienceMatch.titleAlignment}
            </span>
          </div>

          <div className="my-4 space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold font-display text-white">
                ~{analysis.components.experienceMatch.candidateYears} yrs
              </span>
              <span className="text-xs text-slate-400">vs {job.minExperienceYears}+ yrs required</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {analysis.components.experienceMatch.evidence}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Portfolios Attached:</span>
            <span className="font-bold text-slate-200">{resume.projects.length} Verified Projects</span>
          </div>
        </div>

      </div>

      {/* Quick Feature Action Launchpad */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveView('resume-analyzer')}
          className="glass-card p-5 rounded-3xl text-left transition-all group shadow-md hover:glow-border-indigo"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-white group-hover:text-indigo-300 transition-colors font-display">ATS Breakdown</p>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">Component scores & evidence</p>
        </button>

        <button
          onClick={() => setActiveView('resume-optimizer')}
          className="glass-card p-5 rounded-3xl text-left transition-all group shadow-md hover:glow-border-emerald"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wand2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-white group-hover:text-cyan-300 transition-colors font-display">Resume Optimizer</p>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">Keyword density & bullet lift</p>
        </button>

        <button
          onClick={() => setActiveView('ai-interview')}
          className="glass-card p-5 rounded-3xl text-left transition-all group shadow-md hover:glow-border-purple"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-white group-hover:text-purple-300 transition-colors font-display">AI Interview Prep</p>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">Tailored role Q&A simulator</p>
        </button>

        <button
          onClick={() => setActiveView('resume-builder')}
          className="glass-card p-5 rounded-3xl text-left transition-all group shadow-md hover:glow-border-amber"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-xs font-extrabold text-white group-hover:text-emerald-300 transition-colors font-display">Resume Builder</p>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug">Templates & PDF exporter</p>
        </button>
      </div>

      {/* Actionable Priority Improvement Checklist */}
      <div className="glass-card rounded-3xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2.5">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Priority Resume Improvements for {job.title}
            </h3>
          </div>
          <button
            onClick={onOpenReport}
            className="text-xs text-slate-300 hover:text-white font-bold flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download Audit PDF</span>
          </button>
        </div>

        <div className="space-y-3">
          {analysis.improvementActionItems.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-start space-x-3.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 transition-colors hover:border-indigo-500/30"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px] shadow-sm">
                {idx + 1}
              </div>
              <p className="leading-relaxed font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
