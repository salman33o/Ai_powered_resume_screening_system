import React, { useState, useRef } from 'react';
import { 
  JobRequirement, 
  PipelineCandidate, 
  StructuredResume,
  TokenUsageState 
} from '../../types';
import { 
  Layers, 
  Play, 
  CheckCircle2, 
  Download, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  ArrowRight, 
  Coins 
} from 'lucide-react';
import { generateBulkResumes } from '../../lib/mockData';
import { evaluateResumeAgainstJob } from '../../lib/atsEngine';
import { parseUploadedResumeFile } from '../../lib/resumeParser';
import JSZip from 'jszip';

interface BulkScreeningProps {
  activeJob: JobRequirement;
  onScreeningComplete: (candidates: PipelineCandidate[]) => void;
  setActiveView: (view: string) => void;
  tokenState?: TokenUsageState;
  onDeductTokens?: (amount: number, actionName: string, targetName: string, category: any) => boolean;
  onOpenTokenModal?: () => void;
}

export const BulkScreening: React.FC<BulkScreeningProps> = ({
  activeJob,
  onScreeningComplete,
  setActiveView,
  tokenState,
  onDeductTokens,
  onOpenTokenModal
}) => {
  const [sourceMode, setSourceMode] = useState<'upload' | 'synthetic'>('synthetic');
  const [batchSize, setBatchSize] = useState<number>(100);
  const [uploadedRawFiles, setUploadedRawFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [activeWorkers, setActiveWorkers] = useState(8);
  const [screenedResults, setScreenedResults] = useState<PipelineCandidate[]>([]);
  const [throughput, setThroughput] = useState<number>(0);
  const [tokenDeductedThisRun, setTokenDeductedThisRun] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_LIMIT = 600;

  const processIncomingFiles = async (fileList: FileList | File[]) => {
    const rawFiles: File[] = [];
    const countToTake = Math.min(MAX_LIMIT, fileList.length);

    for (let i = 0; i < countToTake; i++) {
      const f = fileList[i];
      const isZip = f.name.toLowerCase().endsWith('.zip') || f.type.includes('zip');

      if (isZip) {
        try {
          const zip = await JSZip.loadAsync(f);
          const zipEntries = Object.keys(zip.files);
          for (const filename of zipEntries) {
            const entry = zip.files[filename];
            if (!entry.dir && !filename.startsWith('__MACOSX') && !filename.startsWith('.')) {
              const lowerName = filename.toLowerCase();
              if (
                lowerName.endsWith('.pdf') ||
                lowerName.endsWith('.docx') ||
                lowerName.endsWith('.doc') ||
                lowerName.endsWith('.txt') ||
                lowerName.endsWith('.json')
              ) {
                const blob = await entry.async('blob');
                const baseName = filename.split('/').pop() || filename;
                const unzippedFile = new File([blob], baseName, { type: blob.type || 'application/octet-stream' });
                rawFiles.push(unzippedFile);
                if (rawFiles.length >= MAX_LIMIT) break;
              }
            }
          }
        } catch (err) {
          console.error('Failed to unpack ZIP archive:', err);
        }
      } else {
        rawFiles.push(f);
      }
      if (rawFiles.length >= MAX_LIMIT) break;
    }

    const displayList = rawFiles.map(f => ({
      name: f.name,
      size: `${Math.round(f.size / 1024)} KB`
    }));

    setUploadedRawFiles(rawFiles);
    setUploadedFiles(displayList);
    setBatchSize(rawFiles.length);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processIncomingFiles(files);
  };

  const handleDropFiles = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    await processIncomingFiles(files);
  };

  const startScreeningJob = async () => {
    const isUpload = sourceMode === 'upload' && uploadedRawFiles.length > 0;
    const totalToScreen = isUpload ? uploadedRawFiles.length : batchSize;
    
    const tokensRequired = totalToScreen;
    if (tokenState && tokenState.availableTokens < tokensRequired) {
      alert(`Insufficient AI tokens. You need ${tokensRequired.toLocaleString()} tokens to screen ${totalToScreen} resumes (Available: ${tokenState.availableTokens.toLocaleString()}). Please top up your token quota.`);
      if (onOpenTokenModal) onOpenTokenModal();
      return;
    }

    if (onDeductTokens) {
      const ok = onDeductTokens(tokensRequired, `Bulk ATS Batch Screening (${totalToScreen} Resumes)`, activeJob.title, 'screening');
      if (!ok) return;
    }

    setTokenDeductedThisRun(tokensRequired);
    setIsProcessing(true);
    setProcessedCount(0);
    setScreenedResults([]);

    const startTime = performance.now();

    if (isUpload) {
      const processed: PipelineCandidate[] = [];
      for (let idx = 0; idx < uploadedRawFiles.length; idx++) {
        const file = uploadedRawFiles[idx];
        try {
          const parsedResume = await parseUploadedResumeFile(file);
          const atsScore = evaluateResumeAgainstJob(parsedResume, activeJob);
          let stage: any = 'applied';
          if (atsScore.overallScore >= 80) stage = 'shortlisted';
          else if (atsScore.overallScore >= 60) stage = 'screening';

          processed.push({
            id: `cand-bulk-${Date.now()}-${idx}`,
            candidateId: parsedResume.id,
            candidateName: parsedResume.fullName,
            candidateEmail: parsedResume.email,
            candidatePhone: parsedResume.phone,
            jobId: activeJob.id,
            jobTitle: activeJob.title,
            companyName: activeJob.company,
            appliedDate: new Date(Date.now() - idx * 3600000).toISOString(),
            stage,
            resume: parsedResume,
            atsAnalysis: atsScore,
            atsScore,
            recruiterNotes: [],
            tags: atsScore.overallScore >= 80 ? ['High Match', 'Auto-Shortlist'] : ['Processed'],
            recruiterRating: atsScore.overallScore >= 85 ? 5 : atsScore.overallScore >= 70 ? 4 : 3
          });
        } catch (err) {
          console.error(`Error processing file ${file.name}:`, err);
        }
        setProcessedCount(idx + 1);
      }

      processed.sort((a, b) => b.atsScore.overallScore - a.atsScore.overallScore);
      setScreenedResults(processed);
      setIsProcessing(false);
      const elapsed = (performance.now() - startTime) / 1000;
      setThroughput(Math.round(processed.length / (elapsed || 0.1)));
      onScreeningComplete(processed);
    } else {
      const resumes = generateBulkResumes(totalToScreen);
      let current = 0;
      const chunkStep = Math.max(10, Math.floor(resumes.length / 25));

      const interval = setInterval(() => {
        current += chunkStep;
        if (current >= resumes.length) {
          current = resumes.length;
          clearInterval(interval);

          const processed: PipelineCandidate[] = resumes.map((r, idx) => {
            const atsScore = evaluateResumeAgainstJob(r, activeJob);
            let stage: any = 'applied';
            if (atsScore.overallScore >= 80) stage = 'shortlisted';
            else if (atsScore.overallScore >= 60) stage = 'screening';

            return {
              id: `cand-bulk-${Date.now()}-${idx}`,
              candidateId: r.id,
              candidateName: r.fullName,
              candidateEmail: r.email,
              candidatePhone: r.phone,
              jobId: activeJob.id,
              jobTitle: activeJob.title,
              companyName: activeJob.company,
              appliedDate: new Date(Date.now() - idx * 3600000).toISOString(),
              stage,
              resume: r,
              atsAnalysis: atsScore,
              atsScore,
              recruiterNotes: [],
              tags: atsScore.overallScore >= 80 ? ['High Match', 'Auto-Shortlist'] : ['Processed'],
              recruiterRating: atsScore.overallScore >= 85 ? 5 : atsScore.overallScore >= 70 ? 4 : 3
            };
          });

          processed.sort((a, b) => b.atsScore.overallScore - a.atsScore.overallScore);
          setScreenedResults(processed);
          setProcessedCount(resumes.length);
          setIsProcessing(false);
          const elapsed = (performance.now() - startTime) / 1000;
          setThroughput(Math.round(resumes.length / (elapsed || 0.1)));
          onScreeningComplete(processed);
        } else {
          setProcessedCount(current);
        }
      }, 60);
    }
  };

  const exportToCSV = () => {
    if (screenedResults.length === 0) return;
    const headers = 'Candidate Name,Email,Overall ATS Score,Skills Score,Experience Score,Confidence,Stage\n';
    const rows = screenedResults.map(c => 
      `"${c.resume.fullName}","${c.resume.email}",${c.atsScore.overallScore},${c.atsScore.components.skillsMatch.score},${c.atsScore.components.experienceMatch.score},${c.atsScore.confidenceScore},"${c.stage}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bulk_ATS_Screening_${activeJob.title.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    link.click();
  };

  const progressPercent = Math.min(100, Math.round((processedCount / (sourceMode === 'upload' && uploadedFiles.length > 0 ? uploadedFiles.length : batchSize)) * 100));
  const totalSelectedBatch = sourceMode === 'upload' && uploadedFiles.length > 0 ? uploadedFiles.length : batchSize;

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">High-Throughput Ingestion</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              Batch Limit: {MAX_LIMIT} Docs
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Automated Bulk Resume Screening & Scoring
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Ingest candidate resumes in bulk via folder uploads or synthetic benchmarks. Applies deterministic 7-factor scoring.
          </p>
        </div>

        {/* Token Balance Indicator */}
        <div 
          onClick={onOpenTokenModal}
          className="flex items-center space-x-2.5 bg-[#0E1A29] px-3.5 py-2 rounded-lg border border-[#223348] cursor-pointer hover:border-[#334A66] transition-colors"
        >
          <Coins className="w-4 h-4 text-amber-400" />
          <div className="font-mono">
            <span className="text-[9px] uppercase text-[#8A97A8] block">AI Token Quota</span>
            <p className="text-xs font-bold text-[#E6EAF0]">
              {tokenState ? tokenState.availableTokens.toLocaleString() : '25,000'} tok
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selector & Configuration Card */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-4">
        
        {/* Source Mode Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#223348] pb-3">
          <div className="flex items-center space-x-1 bg-[#0E1A29] p-0.5 rounded border border-[#223348] font-mono text-xs">
            <button
              onClick={() => setSourceMode('synthetic')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                sourceMode === 'synthetic' ? 'bg-[#17263B] text-teal-300 border border-teal-500/30' : 'text-[#8A97A8] hover:text-[#E6EAF0]'
              }`}
            >
              Synthetic Benchmark ({batchSize})
            </button>
            <button
              onClick={() => setSourceMode('upload')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                sourceMode === 'upload' ? 'bg-[#17263B] text-teal-300 border border-teal-500/30' : 'text-[#8A97A8] hover:text-[#E6EAF0]'
              }`}
            >
              Upload Resumes / ZIP
            </button>
          </div>

          <div className="text-xs font-mono text-[#8A97A8] flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Target: <strong className="text-[#E6EAF0]">{activeJob.title}</strong></span>
          </div>
        </div>

        {/* Source Mode Details */}
        {sourceMode === 'upload' ? (
          <div className="space-y-3">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropFiles}
              onClick={() => fileInputRef.current?.click()}
              className="p-6 rounded-lg border border-dashed border-[#223348] hover:border-teal-500/50 bg-[#0E1A29] text-center transition-colors cursor-pointer space-y-2"
            >
              <UploadCloud className="w-8 h-8 text-teal-400 mx-auto" />
              <div>
                <h4 className="text-xs font-bold text-[#E6EAF0]">
                  Drop Resume Files (PDF, DOCX, TXT, JSON, ZIP Archive)
                </h4>
                <p className="text-[11px] text-[#8A97A8] mt-0.5">
                  Batch ingest up to 600 files per run with parallel worker threads.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.txt,.json,.zip"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="inline-block px-3 py-1 rounded bg-[#131F30] border border-[#223348] text-xs font-mono text-[#8A97A8]">
                Browse File System
              </span>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="p-3 rounded bg-[#0E1A29] border border-[#223348] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#E6EAF0]">
                    {uploadedFiles.length} Resumes Staged for Evaluation
                  </span>
                  <button 
                    onClick={() => { setUploadedRawFiles([]); setUploadedFiles([]); setBatchSize(100); }}
                    className="text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {uploadedFiles.map((f, fIdx) => (
                    <span key={fIdx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131F30] text-[#8A97A8] border border-[#223348] flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-teal-400" />
                      <span className="truncate max-w-[120px]">{f.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 font-mono">
            <div>
              <div className="flex justify-between items-center text-xs text-[#8A97A8] mb-1.5">
                <span>Batch Evaluation Size</span>
                <span className="font-bold text-teal-400 text-sm">
                  {batchSize} Resumes
                </span>
              </div>
              
              <input
                type="range"
                min="10"
                max={MAX_LIMIT}
                step="10"
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full h-1.5 bg-[#0E1A29] rounded appearance-none cursor-pointer accent-teal-500"
              />

              <div className="grid grid-cols-5 gap-1.5 mt-2">
                {[50, 100, 250, 500, 600].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setBatchSize(preset)}
                    className={`py-1.5 rounded text-xs font-bold border transition-colors cursor-pointer ${
                      batchSize === preset
                        ? 'bg-[#17263B] text-teal-300 border-teal-500/40'
                        : 'bg-[#0E1A29] text-[#8A97A8] border-[#223348] hover:text-[#E6EAF0]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Panel & Cost Calculation */}
        <div className="p-3.5 rounded bg-[#0E1A29] border border-[#223348] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-[#131F30] border border-[#223348] flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <p className="text-[#E6EAF0]">
                Telemetry Cost: <span className="text-amber-400 font-bold">{totalSelectedBatch.toLocaleString()} tok</span>
              </p>
              <p className="text-[#8A97A8] text-[10px]">
                Deterministic rate: 1 tok/doc • {activeWorkers} async workers
              </p>
            </div>
          </div>

          <button
            onClick={startScreeningJob}
            disabled={isProcessing}
            className="w-full sm:w-auto px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing {processedCount}/{totalSelectedBatch}...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Batch Run ({totalSelectedBatch})</span>
              </>
            )}
          </button>
        </div>

        {/* Live Processing Bar */}
        {isProcessing && (
          <div className="space-y-2 p-3.5 rounded bg-[#0E1A29] border border-teal-500/30 font-mono">
            <div className="flex justify-between items-center text-xs">
              <span className="text-teal-400 flex items-center space-x-1.5">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Executing Deterministic ATS Pipeline...</span>
              </span>
              <span className="text-[#E6EAF0] font-bold">
                {processedCount}/{totalSelectedBatch} ({progressPercent}%)
              </span>
            </div>
            
            <div className="instrument-gauge">
              <div 
                className="instrument-gauge-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

      </div>

      {/* Screened Results Summary */}
      {screenedResults.length > 0 && !isProcessing && (
        <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] space-y-4">
          
          {/* Metrics Topbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#223348] pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-[#E6EAF0] font-display">
                  Batch Execution Completed — {screenedResults.length} Candidate Records
                </h3>
              </div>
              <p className="text-[11px] font-mono text-[#8A97A8] mt-0.5">
                Screened at <strong className="text-teal-400">{throughput} docs/sec</strong> with zero hallucination guarantee.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={exportToCSV}
                className="px-3 py-1.5 bg-[#0E1A29] hover:bg-[#17263B] border border-[#223348] text-[#E6EAF0] rounded text-xs font-mono transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-teal-400" />
                <span>Export CSV</span>
              </button>
              
              <button
                onClick={() => setActiveView('candidate-pipeline')}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded text-xs transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>Hiring Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Distribution Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded bg-[#0E1A29] border border-[#223348]">
              <span className="text-[#8A97A8] block text-[10px] uppercase">High Match (&gt;=80%)</span>
              <p className="text-xl font-bold text-emerald-400 mt-0.5">
                {screenedResults.filter(c => c.atsScore.overallScore >= 80).length} Candidates
              </p>
              <span className="text-[10px] text-[#8A97A8]">Auto-shortlisted</span>
            </div>

            <div className="p-3 rounded bg-[#0E1A29] border border-[#223348]">
              <span className="text-[#8A97A8] block text-[10px] uppercase">Qualified Range (60-79%)</span>
              <p className="text-xl font-bold text-teal-400 mt-0.5">
                {screenedResults.filter(c => c.atsScore.overallScore >= 60 && c.atsScore.overallScore < 80).length} Candidates
              </p>
              <span className="text-[10px] text-[#8A97A8]">Review stage</span>
            </div>

            <div className="p-3 rounded bg-[#0E1A29] border border-[#223348]">
              <span className="text-[#8A97A8] block text-[10px] uppercase">Tokens Deducted</span>
              <p className="text-xl font-bold text-amber-400 mt-0.5">
                {tokenDeductedThisRun.toLocaleString()} tok
              </p>
              <span className="text-[10px] text-[#8A97A8]">Telemetry logged</span>
            </div>
          </div>

          {/* Top Candidates Table Preview */}
          <div className="overflow-x-auto rounded border border-[#223348]">
            <table className="w-full text-left text-xs font-mono text-[#8A97A8]">
              <thead className="bg-[#0E1A29] text-[#8A97A8] border-b border-[#223348] text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-2.5 font-semibold">Candidate Profile</th>
                  <th className="p-2.5 font-semibold">Overall ATS Score</th>
                  <th className="p-2.5 font-semibold">Skills Score</th>
                  <th className="p-2.5 font-semibold">Experience</th>
                  <th className="p-2.5 font-semibold">Confidence</th>
                  <th className="p-2.5 font-semibold">Assigned Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#192738] bg-[#0B1420]">
                {screenedResults.slice(0, 8).map((c) => (
                  <tr key={c.id} className="hover:bg-[#0E1A29] transition-colors">
                    <td className="p-2.5 font-sans">
                      <span className="font-bold text-[#E6EAF0]">{c.resume.fullName}</span>
                      <span className="block text-[10px] font-mono text-[#8A97A8]">{c.resume.email}</span>
                    </td>
                    <td className="p-2.5">
                      <span className={`font-bold text-xs px-1.5 py-0.5 rounded border ${
                        c.atsScore.overallScore >= 80 
                          ? 'text-emerald-400 bg-[#0E1A29] border-emerald-500/30' 
                          : 'text-teal-400 bg-[#0E1A29] border-teal-500/30'
                      }`}>
                        {c.atsScore.overallScore}%
                      </span>
                    </td>
                    <td className="p-2.5 text-[#E6EAF0]">
                      {c.atsScore.components.skillsMatch.score}%
                    </td>
                    <td className="p-2.5 text-[#E6EAF0]">
                      {c.atsScore.components.experienceMatch.score}%
                    </td>
                    <td className="p-2.5 text-[#8A97A8]">
                      {c.atsScore.confidenceScore}%
                    </td>
                    <td className="p-2.5">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#131F30] text-[#E6EAF0] border border-[#223348]">
                        {c.stage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
