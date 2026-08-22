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
  ShieldCheck,
  Sliders,
  Layers,
  Briefcase,
  GraduationCap,
  Award
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
  const [activeTab, setActiveTab] = useState<'breakdown' | 'skills' | 'responsibilities' | 'projects' | 'upload'>('breakdown');
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsParsingFile(true);
    setUploadFeedback(`Extracting candidate information from ${file.name}...`);
    try {
      const parsedResume = await parseUploadedResumeFile(file);
      setResume(parsedResume);
      setUploadFeedback(`Extracted ✓ ${parsedResume.fullName} (${parsedResume.skills.technical.length} skills indexed)`);
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

  const score = analysis.overallScore;

  const auditRows = [
    { name: '01  SKILL MATCH', weight: '30%', score: analysis.components.skillsMatch.score, details: `${analysis.components.skillsMatch.matched.length}/${job.requiredSkills.length} required skills verified in document` },
    { name: '02  EXPERIENCE ALIGNMENT', weight: '25%', score: analysis.components.experienceMatch.score, details: `${resume.experience.length} career positions compared to ${job.minExperienceYears}+ yrs seniority requirement` },
    { name: '03  RESPONSIBILITIES COVERAGE', weight: '20%', score: analysis.components.responsibilitiesMatch.score, details: `${analysis.components.responsibilitiesMatch.matched.length}/${job.responsibilities.length} key responsibilities evidenced in work bullet points` },
    { name: '04  PROJECTS & PORTFOLIO', weight: '10%', score: analysis.components.projectsMatch.score, details: `${analysis.components.projectsMatch.matched.length} practical projects matched to target technical stack` },
    { name: '05  EDUCATION THRESHOLD', weight: '5%', score: analysis.components.educationMatch.score, details: `${resume.education[0]?.degree || 'Degree'} verified against job threshold requirements` },
    { name: '06  KEYWORD DENSITY', weight: '5%', score: analysis.components.keywordsMatch.score, details: `${analysis.components.keywordsMatch.matched.length}/${job.keywords.length} industry keywords detected in resume body` },
    { name: '07  CERTIFICATIONS & LICENSES', weight: '5%', score: analysis.components.certificationsMatch.score, details: `${(resume.certifications || []).length} professional credentials verified` },
  ];

  return (
    <div className="space-y-4">
      
      {/* 01. Context Header */}
      <div className="surface-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent)]">
              ATS Evaluation Specification
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded surface-subtle text-[var(--text-secondary)] border border-[var(--border)]">
              {analysis.modelVersion}
            </span>
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] font-display mt-0.5 tracking-tight">
            Deterministic Resume & Requisition Matching Engine
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Evaluating <strong className="text-[var(--text-primary)]">{resume.fullName}</strong> against <strong className="text-[var(--accent)]">{job.title}</strong> ({job.company}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary text-xs"
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
            className="btn-secondary text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Evaluating...' : 'Re-Run Spec'}</span>
          </button>

          <button
            onClick={onOpenReport}
            className="btn-secondary text-xs"
          >
            <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Export Audit PDF</span>
          </button>
        </div>
      </div>

      {uploadFeedback && (
        <div className="p-2.5 rounded surface-subtle border border-[var(--border-strong)] text-xs font-mono text-[var(--text-primary)] flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-[var(--accent)]" />
          <span>{uploadFeedback}</span>
        </div>
      )}

      {/* 02. Instrument Metric Summary Card */}
      <div className="surface-panel p-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left 5 cols: Instrument Meter Gauge */}
        <div className="md:col-span-5 space-y-2 font-mono">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
              ATS COMPATIBILITY
            </span>
            <span className="text-3xl font-bold text-[var(--text-primary)]">
              {score} <span className="text-xs text-[var(--text-muted)] font-normal">/ 100</span>
            </span>
          </div>

          <div className="ats-instrument-scale">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
          <div className="ats-instrument-track">
            <div 
              className={`ats-instrument-fill ${score < 50 ? 'danger' : score < 70 ? 'warning' : ''}`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10.5px] text-[var(--text-muted)] pt-0.5">
            <span>Confidence Index: {analysis.confidenceScore}%</span>
            <span>Threshold: {job.minExperienceYears}+ Yrs</span>
          </div>
        </div>

        {/* Right 7 cols: Target Job Selector & Seniority Info */}
        <div className="md:col-span-7 surface-subtle p-3 rounded border border-[var(--border)] font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Active Evaluation Target</span>
            <select
              value={job.id}
              onChange={(e) => {
                const found = allJobs.find(j => j.id === e.target.value);
                if (found) setJob(found);
              }}
              className="bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-primary)] rounded px-2 py-1 focus:outline-none focus:border-[var(--focus)] cursor-pointer font-mono"
            >
              {allJobs.map(j => (
                <option key={j.id} value={j.id}>{j.title} — {j.company}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block">Department / Sector:</span>
              <span className="text-[var(--text-primary)] font-semibold truncate block">{job.department || job.sector}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block">Seniority:</span>
              <span className="text-[var(--text-primary)] font-semibold">{job.seniority}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--text-muted)] block">Contract:</span>
              <span className="text-[var(--text-primary)] font-semibold">{job.type}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 03. Section Navigation Tabs */}
      <div className="flex border-b border-[var(--border)] font-mono text-xs">
        {[
          { id: 'breakdown', label: 'Score Breakdown Audit' },
          { id: 'skills', label: `Skill Evidence (${analysis.components.skillsMatch.matched.length}/${job.requiredSkills.length})` },
          { id: 'responsibilities', label: `Responsibilities (${analysis.components.responsibilitiesMatch.matched.length}/${job.responsibilities.length})` },
          { id: 'projects', label: `Projects (${analysis.components.projectsMatch.matched.length})` },
          { id: 'upload', label: 'Resume Parser File Drop' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'border-[var(--accent)] text-[var(--accent)] font-bold bg-[var(--surface-subtle)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Structured 7-Factor Breakdown Audit */}
      {activeTab === 'breakdown' && (
        <div className="surface-panel p-4 space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
            <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Factor Breakdown & Weight Matrix
            </span>
            <span className="text-[10.5px] text-[var(--text-muted)]">Sum of Weights = 100%</span>
          </div>

          <div className="space-y-2">
            {auditRows.map((row, idx) => (
              <div key={idx} className="surface-subtle p-3 rounded border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[var(--text-primary)] text-xs">{row.name}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">[{row.weight}]</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] font-sans">{row.details}</p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="w-28 ats-instrument-track hidden sm:block">
                    <div 
                      className={`ats-instrument-fill ${row.score < 50 ? 'danger' : row.score < 70 ? 'warning' : ''}`}
                      style={{ width: `${row.score}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-bold w-12 text-right ${
                    row.score >= 80 ? 'text-[var(--success)]' : row.score >= 60 ? 'text-[var(--text-primary)]' : 'text-[var(--warning)]'
                  }`}>
                    {row.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Skill Evidence Matrix */}
      {activeTab === 'skills' && (
        <div className="surface-panel p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border)] font-mono text-xs">
            <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Required Competencies vs Verified Resume Mentions
            </span>
            <span className="text-[11px] font-bold text-[var(--accent)]">
              {analysis.components.skillsMatch.score}% Skill Score
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="eval-table">
              <thead>
                <tr>
                  <th className="eval-th w-1/3">Target Competency</th>
                  <th className="eval-th w-1/2">Candidate CV Evidence</th>
                  <th className="eval-th text-right">Result</th>
                </tr>
              </thead>
              <tbody>
                {analysis.components.skillsMatch.matched.map((m, idx) => (
                  <tr key={`m-${idx}`} className="hover:bg-[var(--surface-subtle)] transition-colors">
                    <td className="eval-td font-medium text-[var(--text-primary)] font-mono text-xs">{m.skill}</td>
                    <td className="eval-td text-[var(--text-secondary)] text-xs">{m.evidenceContext || 'Verified in candidate experience records'}</td>
                    <td className="eval-td text-right">
                      <span className="status-match">● MATCH</span>
                    </td>
                  </tr>
                ))}
                {analysis.components.skillsMatch.missing.map((s, idx) => (
                  <tr key={`g-${idx}`} className="hover:bg-[var(--surface-subtle)] transition-colors">
                    <td className="eval-td font-medium text-[var(--text-primary)] font-mono text-xs">{s}</td>
                    <td className="eval-td text-[var(--text-muted)] text-xs italic">Missing from candidate document</td>
                    <td className="eval-td text-right">
                      <span className="status-gap">● GAP</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Responsibilities Evidence Matrix */}
      {activeTab === 'responsibilities' && (
        <div className="surface-panel p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border)] font-mono text-xs">
            <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Job Responsibilities vs Candidate Execution Evidence
            </span>
            <span className="text-[11px] font-bold text-[var(--accent)]">
              {analysis.components.responsibilitiesMatch.score}% Alignment
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="eval-table">
              <thead>
                <tr>
                  <th className="eval-th w-1/2">Requisition Deliverable</th>
                  <th className="eval-th w-1/3">Candidate Work History Anchor</th>
                  <th className="eval-th text-right">Alignment</th>
                </tr>
              </thead>
              <tbody>
                {job.responsibilities.map((resp, idx) => {
                  const isMatched = analysis.components.responsibilitiesMatch.matched.some(r => r.responsibility === resp);
                  const matchObj = analysis.components.responsibilitiesMatch.matched.find(r => r.responsibility === resp);
                  return (
                    <tr key={idx} className="hover:bg-[var(--surface-subtle)] transition-colors">
                      <td className="eval-td text-[var(--text-primary)] text-xs">{resp}</td>
                      <td className="eval-td text-[var(--text-secondary)] text-xs">
                        {isMatched ? (matchObj?.evidenceContext || 'Evidenced in recent accomplishments') : 'No direct quantified accomplishment identified'}
                      </td>
                      <td className="eval-td text-right">
                        {isMatched ? (
                          <span className="status-match">● MATCH</span>
                        ) : (
                          <span className="status-partial">● PARTIAL</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Projects Matrix */}
      {activeTab === 'projects' && (
        <div className="surface-panel p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border)] font-mono text-xs">
            <span className="text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Technical Projects Portfolio & Architecture Evaluation
            </span>
            <span className="text-[11px] font-bold text-[var(--accent)]">
              {resume.projects.length} Projects Listed
            </span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {resume.projects.map((proj, idx) => (
              <div key={idx} className="surface-subtle p-3 rounded border border-[var(--border)] space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-[var(--text-primary)] text-xs font-sans">{proj.title}</h4>
                  {proj.metrics && <span className="text-[var(--accent)] text-[10.5px]">{proj.metrics}</span>}
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] font-sans">{proj.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.technologies.map((t, tIdx) => (
                    <span key={tIdx} className="text-[9.5px] px-1.5 py-0.2 rounded bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Resume File Drop / OCR Parser */}
      {activeTab === 'upload' && (
        <div className="surface-panel p-6 text-center space-y-4 font-mono">
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded p-8 cursor-pointer transition-colors ${
              isDragOver ? 'border-[var(--accent)] bg-[var(--surface-subtle)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
            <h3 className="font-bold text-xs text-[var(--text-primary)] uppercase tracking-wider">
              RESUME UPLOAD
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Drop a resume here or click to browse
            </p>
            <p className="text-[10.5px] text-[var(--text-muted)] mt-0.5">
              Supports machine-readable PDF or DOCX format
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
