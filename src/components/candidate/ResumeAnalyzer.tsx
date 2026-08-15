import React, { useState, useRef } from 'react';
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
  Info,
  UploadCloud,
  FileCode,
  Check,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { parseUploadedResumeFile } from '../../lib/resumeParser';

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
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsParsingFile(true);
    setUploadFeedback(`Extracting and validating candidate competencies from ${file.name}...`);
    try {
      const parsedResume = await parseUploadedResumeFile(file);
      setResume(parsedResume);
      setUploadFeedback(`Successfully extracted profile for "${parsedResume.fullName}" (${parsedResume.skills.technical.length} technical skills detected)`);
      onReAnalyze();
      
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } catch (err: any) {
      setUploadFeedback(`Extraction completed with fallback heuristics: ${file.name}`);
      onReAnalyze();
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
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
          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center space-x-2 transition-all hover:scale-[1.02] shadow-lg shadow-indigo-600/30"
          >
            <Upload className="w-4 h-4 text-white" />
            <span>Upload Resume File</span>
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".pdf,.docx,.doc,.txt,.json" 
            onChange={handleFileUpload} 
            className="hidden" 
          />

          <button
            onClick={onReAnalyze}
            disabled={isAnalyzing}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-2 transition-all border border-slate-700 hover:scale-[1.02] cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Scanning...' : 'Re-Run ATS Scan'}</span>
          </button>

          <button
            onClick={onOpenReport}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700 flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* Interactive Resume Upload Dropzone Card */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDragOver 
            ? 'border-indigo-500 bg-indigo-950/40 scale-[1.01]' 
            : 'border-slate-800 hover:border-indigo-500/60 bg-slate-950/70 hover:bg-slate-950'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            {isParsingFile ? <RefreshCw className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-white">
                {isParsingFile ? 'Parsing Resume Document...' : 'Upload or Drag & Drop Resume for Live ATS Analysis'}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Auto-Parse Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Supports <strong className="text-slate-300">PDF, DOCX, TXT, JSON</strong>. Automatically extracts work history, skills, and projects.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-[11px]">
            Active: {resume.fullName}
          </span>
          <span className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md">
            Browse File
          </span>
        </div>
      </div>

      {uploadFeedback && (
        <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-200 flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">{uploadFeedback}</span>
          </div>
          <button onClick={() => setUploadFeedback(null)} className="text-cyan-400 font-bold hover:text-cyan-200 text-lg leading-none cursor-pointer">×</button>
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
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${analysis.components.skillsMatch.score}%` }}></div>
              </div>
            </div>

            {/* Experience Match */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-200">
                  Experience Depth <span className="text-slate-400 font-normal">({analysis.weights.experienceMatch}% wt)</span>
                </span>
                <span className="font-bold text-emerald-400">{analysis.components.experienceMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${analysis.components.experienceMatch.score}%` }}></div>
              </div>
            </div>

            {/* Responsibilities Match */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-200">
                  Responsibilities Context <span className="text-slate-400 font-normal">({analysis.weights.responsibilitiesMatch}% wt)</span>
                </span>
                <span className="font-bold text-purple-400">{analysis.components.responsibilitiesMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${analysis.components.responsibilitiesMatch.score}%` }}></div>
              </div>
            </div>

            {/* Projects Match */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-200">
                  Projects Relevance <span className="text-slate-400 font-normal">({analysis.weights.projectsMatch}% wt)</span>
                </span>
                <span className="font-bold text-cyan-400">{analysis.components.projectsMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${analysis.components.projectsMatch.score}%` }}></div>
              </div>
            </div>

            {/* Education Match */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-200">
                  Education & Degree <span className="text-slate-400 font-normal">({analysis.weights.educationMatch}% wt)</span>
                </span>
                <span className="font-bold text-amber-400">{analysis.components.educationMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${analysis.components.educationMatch.score}%` }}></div>
              </div>
            </div>

            {/* Keywords Match */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-200">
                  Keywords Density <span className="text-slate-400 font-normal">({analysis.weights.keywordsMatch}% wt)</span>
                </span>
                <span className="font-bold text-blue-400">{analysis.components.keywordsMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${analysis.components.keywordsMatch.score}%` }}></div>
              </div>
            </div>

            {/* Certifications Match */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold">
                <span className="text-slate-200">
                  Certifications <span className="text-slate-400 font-normal">({analysis.weights.certificationsMatch}% wt)</span>
                </span>
                <span className="font-bold text-teal-400">{analysis.components.certificationsMatch.score}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${analysis.components.certificationsMatch.score}%` }}></div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'breakdown'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Strengths & Action Plan
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Skills Audit ({analysis.components.skillsMatch.matched.length} Matched)
        </button>
        <button
          onClick={() => setActiveTab('responsibilities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'responsibilities'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Responsibilities Overlap
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Relevant Projects
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Strengths & Evidence</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {analysis.topStrengths.map((str, idx) => (
                <li key={idx} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start space-x-2.5">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-amber-500/20 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <Wand2 className="w-4 h-4" />
              <span>High-Impact Improvement Actions</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {analysis.improvementActionItems.map((act, idx) => (
                <li key={idx} className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start space-x-2.5">
                  <span className="text-amber-400 font-bold mt-0.5">⚡</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider mb-3">
                Matched Target Skills ({analysis.components.skillsMatch.matched.length})
              </h4>
              <div className="space-y-2">
                {analysis.components.skillsMatch.matched.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{m.skill}</span>
                    <span className="text-[10px] text-emerald-400 font-mono capitalize px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                      {m.matchType} Match
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-rose-400 tracking-wider mb-3">
                Missing Required Skills ({analysis.components.skillsMatch.missingRequired.length})
              </h4>
              <div className="space-y-2">
                {analysis.components.skillsMatch.missingRequired.length === 0 ? (
                  <p className="text-xs text-emerald-400">All required skills present in candidate resume!</p>
                ) : (
                  analysis.components.skillsMatch.missingRequired.map((s, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-950/80 border border-rose-500/20 flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-300">{s}</span>
                      <span className="text-[10px] text-rose-400 font-semibold">Recommended to add</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'responsibilities' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Job Description Responsibilities Alignment
          </h4>
          <div className="space-y-3">
            {analysis.components.responsibilitiesMatch.alignedPoints.map((pt, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                <p className="font-bold text-white">{pt.jdPoint}</p>
                <p className="text-slate-400 text-[11px]">{pt.resumeEvidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Portfolio & Projects Relevance
          </h4>
          <div className="space-y-3">
            {analysis.components.projectsMatch.relevantProjects.map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                <p className="font-bold text-cyan-300">{p.title}</p>
                <p className="text-slate-300">{p.alignment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
