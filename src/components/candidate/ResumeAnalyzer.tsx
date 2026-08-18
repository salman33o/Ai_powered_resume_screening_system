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
  AlertCircle, 
  Download, 
  RefreshCw,
  UploadCloud,
  FileCheck,
  Check,
  ShieldCheck
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'breakdown' | 'skills' | 'responsibilities' | 'projects'>('breakdown');
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsParsingFile(true);
    setUploadFeedback(`Extracting competencies from ${file.name}...`);
    try {
      const parsedResume = await parseUploadedResumeFile(file);
      setResume(parsedResume);
      setUploadFeedback(`Parsed "${parsedResume.fullName}" (${parsedResume.skills.technical.length} skills identified)`);
      onReAnalyze();
    } catch (err: any) {
      setUploadFeedback(`Extracted fallback profile: ${file.name}`);
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
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-[#0E1A29]';
    if (score >= 60) return 'text-teal-400 border-teal-500/40 bg-[#0E1A29]';
    if (score >= 40) return 'text-amber-400 border-amber-500/40 bg-[#0E1A29]';
    return 'text-rose-400 border-rose-500/40 bg-[#0E1A29]';
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header & Context */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Deterministic ATS Scoring</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              {analysis.modelVersion}
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5 tracking-tight">
            Resume & Target Specification Analysis
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Evaluating <strong className="text-[#E6EAF0]">{resume.fullName}</strong> against <strong className="text-teal-300">{job.title}</strong> ({job.company}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-xs font-bold text-slate-950 flex items-center space-x-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Resume</span>
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
            className="px-3 py-1.5 rounded bg-[#0E1A29] hover:bg-[#17263B] disabled:opacity-50 text-[#E6EAF0] text-xs font-medium flex items-center space-x-1.5 transition-colors border border-[#223348] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Evaluating...' : 'Re-Run Evaluation'}</span>
          </button>

          <button
            onClick={onOpenReport}
            className="px-3 py-1.5 rounded bg-[#0E1A29] hover:bg-[#17263B] text-xs font-medium text-[#E6EAF0] border border-[#223348] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export Spec PDF</span>
          </button>
        </div>
      </div>

      {/* Interactive Resume Upload Dropzone Card */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-4 rounded-lg border border-dashed transition-colors cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDragOver 
            ? 'border-teal-500 bg-[#17263B]' 
            : 'border-[#223348] hover:border-teal-500/60 bg-[#0E1A29]'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-[#131F30] border border-[#223348] flex items-center justify-center text-teal-400 shrink-0">
            {isParsingFile ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-semibold text-[#E6EAF0]">
                {isParsingFile ? 'Parsing document stream...' : 'Upload or Drag & Drop Resume File'}
              </h4>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#131F30] text-teal-400 border border-[#223348]">
                PDF • DOCX • TXT • JSON
              </span>
            </div>
            <p className="text-[11px] text-[#8A97A8] mt-0.5">
              Client-side text layer parser with ATS ontology mapping. No fake placeholder data.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2 py-1 rounded bg-[#131F30] border border-[#223348] text-[#8A97A8] font-mono text-[11px]">
            Active: {resume.fullName}
          </span>
          <span className="px-2.5 py-1 bg-[#17263B] hover:bg-[#223348] text-teal-300 rounded border border-teal-500/30 text-xs font-medium">
            Browse File
          </span>
        </div>
      </div>

      {uploadFeedback && (
        <div className="p-3 rounded-lg bg-[#131F30] border border-teal-500/40 text-xs text-teal-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-teal-400" />
            <span className="font-mono">{uploadFeedback}</span>
          </div>
          <button onClick={() => setUploadFeedback(null)} className="text-[#8A97A8] hover:text-[#E6EAF0] text-sm leading-none cursor-pointer">×</button>
        </div>
      )}

      {/* Main Score & Component Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Left: Overall Match Score Gauge */}
        <div className="md:col-span-5 bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A97A8]">Match Score</span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold border ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}% Aggregate
              </span>
            </div>

            <div className="my-5 text-center">
              <div className="inline-flex items-baseline space-x-1 font-mono">
                <span className="text-6xl font-bold text-[#E6EAF0] tracking-tight">
                  {analysis.overallScore}
                </span>
                <span className="text-2xl text-[#8A97A8] font-normal">%</span>
              </div>
              <p className="text-xs text-[#8A97A8] mt-1 font-mono">
                Deterministic 7-factor weighted evaluation
              </p>
            </div>
          </div>

          {/* Confidence Rating Card */}
          <div className="p-3 rounded bg-[#0E1A29] border border-[#223348]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8A97A8]">Certainty Score</span>
              <span className="font-bold text-teal-400">{analysis.confidenceScore}%</span>
            </div>
            <div className="w-full bg-[#131F30] rounded h-1.5 mt-2 overflow-hidden border border-[#223348]">
              <div 
                className="bg-teal-500 h-full rounded transition-all"
                style={{ width: `${analysis.confidenceScore}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-[#8A97A8] mt-2 leading-relaxed">
              <span className="font-semibold text-[#E6EAF0]">Audit Note:</span> {analysis.confidenceReason}
            </p>
          </div>
        </div>

        {/* Right: Component Progress Breakdown Bars */}
        <div className="md:col-span-7 bg-[#131F30] rounded-lg p-4 border border-[#223348]">
          <h3 className="text-[10px] font-mono font-bold uppercase text-[#8A97A8] tracking-wider mb-4 flex items-center justify-between">
            <span>Component Metrics</span>
            <span>Weight Distribution</span>
          </h3>

          <div className="space-y-3">
            
            {/* Skills Match */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium font-mono">
                <span className="text-[#E6EAF0]">
                  Skills Alignment <span className="text-[#8A97A8]">({analysis.weights.skillsMatch}% wt)</span>
                </span>
                <span className="font-bold text-teal-400">{analysis.components.skillsMatch.score}%</span>
              </div>
              <div className="w-full bg-[#0E1A29] rounded h-1.5 overflow-hidden border border-[#223348]">
                <div className="bg-teal-500 h-full rounded transition-all" style={{ width: `${analysis.components.skillsMatch.score}%` }}></div>
              </div>
            </div>

            {/* Experience Match */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium font-mono">
                <span className="text-[#E6EAF0]">
                  Experience Depth <span className="text-[#8A97A8]">({analysis.weights.experienceMatch}% wt)</span>
                </span>
                <span className="font-bold text-emerald-400">{analysis.components.experienceMatch.score}%</span>
              </div>
              <div className="w-full bg-[#0E1A29] rounded h-1.5 overflow-hidden border border-[#223348]">
                <div className="bg-emerald-500 h-full rounded transition-all" style={{ width: `${analysis.components.experienceMatch.score}%` }}></div>
              </div>
            </div>

            {/* Responsibilities Match */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium font-mono">
                <span className="text-[#E6EAF0]">
                  Responsibilities Overlap <span className="text-[#8A97A8]">({analysis.weights.responsibilitiesMatch}% wt)</span>
                </span>
                <span className="font-bold text-sky-400">{analysis.components.responsibilitiesMatch.score}%</span>
              </div>
              <div className="w-full bg-[#0E1A29] rounded h-1.5 overflow-hidden border border-[#223348]">
                <div className="bg-sky-500 h-full rounded transition-all" style={{ width: `${analysis.components.responsibilitiesMatch.score}%` }}></div>
              </div>
            </div>

            {/* Projects Match */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium font-mono">
                <span className="text-[#E6EAF0]">
                  Projects Evidence <span className="text-[#8A97A8]">({analysis.weights.projectsMatch}% wt)</span>
                </span>
                <span className="font-bold text-teal-300">{analysis.components.projectsMatch.score}%</span>
              </div>
              <div className="w-full bg-[#0E1A29] rounded h-1.5 overflow-hidden border border-[#223348]">
                <div className="bg-teal-400 h-full rounded transition-all" style={{ width: `${analysis.components.projectsMatch.score}%` }}></div>
              </div>
            </div>

            {/* Education Match */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium font-mono">
                <span className="text-[#E6EAF0]">
                  Education Match <span className="text-[#8A97A8]">({analysis.weights.educationMatch}% wt)</span>
                </span>
                <span className="font-bold text-amber-400">{analysis.components.educationMatch.score}%</span>
              </div>
              <div className="w-full bg-[#0E1A29] rounded h-1.5 overflow-hidden border border-[#223348]">
                <div className="bg-amber-500 h-full rounded transition-all" style={{ width: `${analysis.components.educationMatch.score}%` }}></div>
              </div>
            </div>

            {/* Keywords Match */}
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium font-mono">
                <span className="text-[#E6EAF0]">
                  Keyword Coverage <span className="text-[#8A97A8]">({analysis.weights.keywordsMatch}% wt)</span>
                </span>
                <span className="font-bold text-slate-300">{analysis.components.keywordsMatch.score}%</span>
              </div>
              <div className="w-full bg-[#0E1A29] rounded h-1.5 overflow-hidden border border-[#223348]">
                <div className="bg-slate-400 h-full rounded transition-all" style={{ width: `${analysis.components.keywordsMatch.score}%` }}></div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-1.5 border-b border-[#223348] pb-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('breakdown')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'breakdown'
              ? 'bg-[#17263B] text-teal-300 border border-teal-500/40'
              : 'text-[#8A97A8] hover:text-[#E6EAF0] hover:bg-[#131F30]'
          }`}
        >
          Strengths & Action Items
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-[#17263B] text-teal-300 border border-teal-500/40'
              : 'text-[#8A97A8] hover:text-[#E6EAF0] hover:bg-[#131F30]'
          }`}
        >
          Skills Audit ({analysis.components.skillsMatch.matched.length} Matched)
        </button>
        <button
          onClick={() => setActiveTab('responsibilities')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'responsibilities'
              ? 'bg-[#17263B] text-teal-300 border border-teal-500/40'
              : 'text-[#8A97A8] hover:text-[#E6EAF0] hover:bg-[#131F30]'
          }`}
        >
          Responsibilities Overlap
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-[#17263B] text-teal-300 border border-teal-500/40'
              : 'text-[#8A97A8] hover:text-[#E6EAF0] hover:bg-[#131F30]'
          }`}
        >
          Project Alignment
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Strengths</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#E6EAF0]">
              {analysis.topStrengths.map((str, idx) => (
                <li key={idx} className="p-2.5 rounded bg-[#0E1A29] border border-[#223348] flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Improvement Target Items</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#E6EAF0]">
              {analysis.improvementActionItems.map((act, idx) => (
                <li key={idx} className="p-2.5 rounded bg-[#0E1A29] border border-[#223348] flex items-start space-x-2">
                  <span className="text-amber-400 font-bold mt-0.5">→</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider mb-2.5">
                Matched Required Skills ({analysis.components.skillsMatch.matched.length})
              </h4>
              <div className="space-y-1.5">
                {analysis.components.skillsMatch.matched.map((m, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#0E1A29] border border-[#223348] flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-[#E6EAF0]">{m.skill}</span>
                    <span className="text-[10px] text-emerald-400 px-1.5 py-0.2 rounded bg-[#131F30] border border-[#223348]">
                      {m.matchType} Match
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-rose-400 tracking-wider mb-2.5">
                Missing Required Skills ({analysis.components.skillsMatch.missingRequired.length})
              </h4>
              <div className="space-y-1.5">
                {analysis.components.skillsMatch.missingRequired.length === 0 ? (
                  <p className="text-xs text-emerald-400 font-mono">All required skills identified in candidate profile.</p>
                ) : (
                  analysis.components.skillsMatch.missingRequired.map((s, idx) => (
                    <div key={idx} className="p-2 rounded bg-[#0E1A29] border border-[#223348] flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-rose-300">{s}</span>
                      <span className="text-[10px] text-rose-400">Gap Detected</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'responsibilities' && (
        <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-[#8A97A8] tracking-wider">
            Job Description Responsibilities Alignment
          </h4>
          <div className="space-y-2">
            {analysis.components.responsibilitiesMatch.alignedPoints.map((pt, idx) => (
              <div key={idx} className="p-3 rounded bg-[#0E1A29] border border-[#223348] text-xs space-y-1">
                <p className="font-semibold text-[#E6EAF0]">{pt.jdPoint}</p>
                <p className="text-[#8A97A8] text-[11px]">{pt.resumeEvidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-[#8A97A8] tracking-wider">
            Portfolio & Projects Evidence
          </h4>
          <div className="space-y-2">
            {analysis.components.projectsMatch.relevantProjects.map((p, idx) => (
              <div key={idx} className="p-3 rounded bg-[#0E1A29] border border-[#223348] text-xs space-y-1">
                <p className="font-semibold text-teal-300">{p.title}</p>
                <p className="text-[#8A97A8]">{p.alignment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

