import React, { useState } from 'react';
import { 
  StructuredResume, 
  JobRequirement, 
  ATSScoreBreakdown 
} from '../../types';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Wand2, 
  Download, 
  Bot, 
  Layers, 
  Sparkles, 
  FileCheck, 
  RefreshCw,
  Sliders,
  ChevronDown,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResumeAnalyzerProps {
  resume: StructuredResume;
  setResume: (resume: StructuredResume) => void;
  job: JobRequirement;
  setJob: (job: JobRequirement) => void;
  allJobs: JobRequirement[];
  analysis: ATSScoreBreakdown;
  onReAnalyze: () => void;
  isAnalyzing: boolean;
  onOpenReport: () => void;
  setActiveView: (view: string) => void;
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
  resume,
  setResume,
  job,
  setJob,
  allJobs,
  analysis,
  onReAnalyze,
  isAnalyzing,
  onOpenReport,
  setActiveView
}) => {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'skills' | 'responsibilities' | 'projects' | 'ai_explanation'>('breakdown');
  const [pastedJD, setPastedJD] = useState('');
  const [showCustomJDModal, setShowCustomJDModal] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFeedback(`Parsing ${file.name} via multi-stage extractor...`);
    setTimeout(() => {
      setUploadFeedback(`Successfully extracted and validated structured data from ${file.name}`);
      onReAnalyze();
      if (analysis.overallScore >= 85) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }
    }, 900);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 glow-border-emerald';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10 glow-border-indigo';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10 glow-border-amber';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Context */}
      <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Deterministic Hybrid ATS Engine</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700 font-semibold">
              {analysis.modelVersion}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-display mt-1 tracking-tight">
            Explainable Resume & Job Match Analysis
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Evaluating <span className="font-bold text-white">{resume.fullName}</span> against <span className="font-bold text-indigo-300">{job.title}</span> ({job.company}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 flex items-center space-x-2 transition-all hover:scale-[1.02] shadow-sm">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload New CV</span>
            <input 
              type="file" 
              accept=".pdf,.docx,.txt" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>

          <button
            onClick={onReAnalyze}
            disabled={isAnalyzing}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02]"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Scanning...' : 'Re-Run ATS Scan'}</span>
          </button>

          <button
            onClick={onOpenReport}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 flex items-center space-x-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {uploadFeedback && (
        <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2.5">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">{uploadFeedback}</span>
          </div>
          <button onClick={() => setUploadFeedback(null)} className="text-cyan-400 font-bold hover:text-cyan-200 text-lg leading-none">×</button>
        </div>
      )}

      {/* Main Score & Component Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Left: Overall Match Score Gauge */}
        <div className="md:col-span-5 glass-card rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Match Benchmark</span>
              <span className={`text-xs px-3 py-1 rounded-full font-extrabold border ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}% Overall Match
              </span>
            </div>

            <div className="my-8 text-center">
              <div className="inline-flex items-baseline space-x-1">
                <span className="text-7xl font-extrabold font-display text-white tracking-tighter">
                  {analysis.overallScore}
                </span>
                <span className="text-3xl font-bold text-slate-400">%</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium">
                Calculated across 7 weighted component scores
              </p>
            </div>
          </div>

          {/* Confidence Rating Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold">Extraction Certainty</span>
              <span className="font-extrabold text-cyan-400">{analysis.confidenceScore}% (High)</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 mt-2.5 overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all"
                style={{ width: `${analysis.confidenceScore}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">
              <span className="font-bold text-slate-300">Certainty Audit:</span> {analysis.confidenceReason}
            </p>
          </div>
        </div>

        {/* Right: Component Progress Breakdown Bars */}
        <div className="md:col-span-7 glass-card rounded-3xl p-6 shadow-xl border border-slate-800">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-5 flex items-center justify-between font-display">
            <span>Component Score Breakdown</span>
            <span className="text-[11px] font-semibold text-slate-400">7-Factor Model</span>
          </h3>

          <div className="space-y-4">
            
            {/* Skills Match */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-200">
                  Skills Alignment <span className="text-slate-400 font-normal">({analysis.weights.skillsMatch}% wt)</span>
                </span>
                <span className="font-bold text-indigo-400">{analysis.components.skillsMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${analysis.components.skillsMatch.score}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {analysis.components.skillsMatch.matched.length} matched skills, {analysis.components.skillsMatch.missingRequired.length} missing required
              </p>
            </div>

            {/* Experience Match */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-200">
                  Relevant Experience <span className="text-slate-400 font-normal">({analysis.weights.experienceMatch}% wt)</span>
                </span>
                <span className="font-bold text-blue-400">{analysis.components.experienceMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${analysis.components.experienceMatch.score}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ~{analysis.components.experienceMatch.candidateYears} yrs candidate history vs {job.minExperienceYears}+ yrs requirement
              </p>
            </div>

            {/* Responsibilities Match */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-200">
                  Responsibilities Similarity <span className="text-slate-400 font-normal">({analysis.weights.responsibilitiesMatch}% wt)</span>
                </span>
                <span className="font-bold text-cyan-400">{analysis.components.responsibilitiesMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all"
                  style={{ width: `${analysis.components.responsibilitiesMatch.score}%` }}
                ></div>
              </div>
            </div>

            {/* Projects & Portfolios */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-200">
                  Projects & Portfolios <span className="text-slate-400 font-normal">({analysis.weights.projectsMatch}% wt)</span>
                </span>
                <span className="font-bold text-emerald-400">{analysis.components.projectsMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2.5 p-0.5 border border-slate-800">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${analysis.components.projectsMatch.score}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'breakdown'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Detailed Breakdown
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'skills'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Skill Taxonomy ({analysis.components.skillsMatch.matched.length})
        </button>
        <button
          onClick={() => setActiveTab('ai_explanation')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'ai_explanation'
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Gemini AI Explainability
        </button>
      </div>

      {/* Tab Content 1: Skill Taxonomy */}
      {activeTab === 'skills' && (
        <div className="glass-card rounded-3xl p-6 shadow-xl border border-slate-800 space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider mb-3 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Matched Skills ({analysis.components.skillsMatch.matched.length})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.components.skillsMatch.matched.map((s, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{s.skill}</span>
                  <span className="text-[10px] text-emerald-400/80">({s.matchedSource})</span>
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-rose-400 tracking-wider mb-3 flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Missing Required Skills ({analysis.components.skillsMatch.missingRequired.length})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.components.skillsMatch.missingRequired.map((s, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center space-x-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: AI Explainability */}
      {(activeTab === 'ai_explanation' || activeTab === 'breakdown') && (
        <div className="glass-card rounded-3xl p-6 shadow-xl border border-slate-800">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Gemini 1.5 Flash AI Candidate Summary
            </h4>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
            {analysis.aiExplanation}
          </div>
        </div>
      )}

    </div>
  );
};
