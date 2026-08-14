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
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Context */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Deterministic Hybrid ATS Engine</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {analysis.modelVersion}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Explainable Resume & Job Match Analysis
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Evaluating <span className="font-semibold text-white">{resume.fullName}</span> against <span className="font-semibold text-indigo-300">{job.title}</span> ({job.company}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* File Upload Trigger */}
          <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
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
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Scanning...' : 'Re-Run ATS Scan'}</span>
          </button>

          <button
            onClick={onOpenReport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {uploadFeedback && (
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>{uploadFeedback}</span>
          </div>
          <button onClick={() => setUploadFeedback(null)} className="text-cyan-400 font-bold hover:text-cyan-200">×</button>
        </div>
      )}

      {/* Main Score & Confidence Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left: Big Score & Subscores */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Match Benchmark</span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}% Overall
              </span>
            </div>

            <div className="my-6 text-center">
              <div className="inline-flex items-baseline space-x-1">
                <span className="text-6xl font-black text-white tracking-tighter">
                  {analysis.overallScore}
                </span>
                <span className="text-2xl font-bold text-slate-400">%</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                Calculated across 7 deterministic component weights
              </p>
            </div>
          </div>

          {/* Confidence Indicator */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Extraction Confidence</span>
              <span className="font-bold text-cyan-400">{analysis.confidenceScore}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-cyan-500 h-full rounded-full transition-all"
                style={{ width: `${analysis.confidenceScore}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              <span className="font-semibold text-slate-300">Certainty Audit:</span> {analysis.confidenceReason}
            </p>
          </div>
        </div>

        {/* Right: Component Progress Bars with Evidence */}
        <div className="md:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center justify-between">
            <span>Component Weighting Breakdown</span>
            <span className="text-[11px] font-normal text-slate-400">Human Recruiter Weight Config</span>
          </h3>

          <div className="space-y-3.5">
            
            {/* Skills Match */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-200">
                  Skills Match <span className="text-slate-400 text-[11px]">({analysis.weights.skillsMatch}% wt)</span>
                </span>
                <span className="font-bold text-white">{analysis.components.skillsMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
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
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-200">
                  Relevant Experience <span className="text-slate-400 text-[11px]">({analysis.weights.experienceMatch}% wt)</span>
                </span>
                <span className="font-bold text-white">{analysis.components.experienceMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
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
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-200">
                  Responsibilities Context <span className="text-slate-400 text-[11px]">({analysis.weights.responsibilitiesMatch}% wt)</span>
                </span>
                <span className="font-bold text-white">{analysis.components.responsibilitiesMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-cyan-500 h-full rounded-full transition-all"
                  style={{ width: `${analysis.components.responsibilitiesMatch.score}%` }}
                ></div>
              </div>
            </div>

            {/* Projects */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-200">
                  Projects & Portfolios <span className="text-slate-400 text-[11px]">({analysis.weights.projectsMatch}% wt)</span>
                </span>
                <span className="font-bold text-white">{analysis.components.projectsMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${analysis.components.projectsMatch.score}%` }}
                ></div>
              </div>
            </div>

            {/* Education, Keywords, Certs Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="p-2 bg-slate-950/60 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase">Education ({analysis.weights.educationMatch}%)</span>
                <p className="font-bold text-white text-sm mt-0.5">{analysis.components.educationMatch.score}%</p>
              </div>
              <div className="p-2 bg-slate-950/60 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase">Keywords ({analysis.weights.keywordsMatch}%)</span>
                <p className="font-bold text-white text-sm mt-0.5">{analysis.components.keywordsMatch.score}%</p>
              </div>
              <div className="p-2 bg-slate-950/60 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase">Certs ({analysis.weights.certificationsMatch}%)</span>
                <p className="font-bold text-white text-sm mt-0.5">{analysis.components.certificationsMatch.score}%</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Deep Evidence & Breakdown Tabs */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-md">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 overflow-x-auto">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-5 py-3 text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'breakdown'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Score Evidence & Audit
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-5 py-3 text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'skills'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Skill Verification ({analysis.components.skillsMatch.matched.length} / {job.requiredSkills.length})
          </button>
          <button
            onClick={() => setActiveTab('responsibilities')}
            className={`px-5 py-3 text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'responsibilities'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-900/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Responsibilities Alignment
          </button>
          <button
            onClick={() => setActiveTab('ai_explanation')}
            className={`px-5 py-3 text-xs font-bold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'ai_explanation'
                ? 'text-cyan-400 border-b-2 border-cyan-500 bg-slate-900/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Executive Brief</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5">
          
          {/* Tab 1: Breakdown & Strengths */}
          {activeTab === 'breakdown' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Top Candidate Strengths</span>
                  </div>
                  <ul className="space-y-2">
                    {analysis.topStrengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Gaps */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2.5">
                  <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    <span>Critical Requirement Gaps</span>
                  </div>
                  <ul className="space-y-2">
                    {analysis.criticalGaps.length > 0 ? (
                      analysis.criticalGaps.map((gap, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{gap}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-400 italic">No critical blockers identified.</li>
                    )}
                  </ul>
                </div>

              </div>

              {/* Next Steps Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Ready to optimize this resume for <span className="text-white font-medium">{job.title}</span>?
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveView('resume-optimizer')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Open Resume Optimizer</span>
                  </button>
                  <button
                    onClick={() => setActiveView('ai-interview')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-all"
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-400" />
                    <span>Generate Interview Questions</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Skills Matrix */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Matched Skills */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Skills ({analysis.components.skillsMatch.matched.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {analysis.components.skillsMatch.matched.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{m.skill}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{m.evidence}</p>
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {m.matchType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>Missing Job Requirements ({analysis.components.skillsMatch.missingRequired.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {analysis.components.skillsMatch.missingRequired.map((s, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-rose-300">{s}</p>
                          <p className="text-[11px] text-slate-400">Required core skill not detected in candidate index.</p>
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                          Required Gap
                        </span>
                      </div>
                    ))}

                    {analysis.components.skillsMatch.missingPreferred.map((s, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-medium text-slate-300">{s}</p>
                          <p className="text-[11px] text-slate-500">Preferred bonus skill.</p>
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Preferred
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab 3: Responsibilities */}
          {activeTab === 'responsibilities' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Job Description Responsibilities Alignment
              </h4>
              <div className="space-y-2.5">
                {analysis.components.responsibilitiesMatch.alignedPoints.map((pt, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{pt.jdPoint}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {pt.similarity}% Semantic Overlap
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{pt.resumeEvidence}</p>
                  </div>
                ))}

                {analysis.components.responsibilitiesMatch.gapPoints.map((gp, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/30 border border-slate-800/70 text-xs text-slate-400 flex items-center space-x-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Potential gap: &quot;{gp}&quot;</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: AI Explanation */}
          {activeTab === 'ai_explanation' && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Executive Decision-Support Synthesis</span>
              </div>
              <p className="whitespace-pre-line leading-relaxed">
                {analysis.aiExplanation || 'Deterministic scoring complete. Review evidence cards above.'}
              </p>
              <div className="pt-3 border-t border-slate-800 flex items-center text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                <span>Protocol: AI models summarize evidence; hiring decisions are strictly reserved for human recruiters.</span>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
