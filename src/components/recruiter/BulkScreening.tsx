import React, { useState } from 'react';
import { 
  JobRequirement, 
  PipelineCandidate, 
  StructuredResume 
} from '../../types';
import { 
  Layers, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import { generateBulkResumes } from '../../lib/mockData';
import { evaluateResumeAgainstJob } from '../../lib/atsEngine';

interface BulkScreeningProps {
  activeJob: JobRequirement;
  onScreeningComplete: (candidates: PipelineCandidate[]) => void;
  setActiveView: (view: string) => void;
}

export const BulkScreening: React.FC<BulkScreeningProps> = ({
  activeJob,
  onScreeningComplete,
  setActiveView
}) => {
  const [batchSize, setBatchSize] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [activeWorkers, setActiveWorkers] = useState(4);
  const [screenedResults, setScreenedResults] = useState<PipelineCandidate[]>([]);
  const [throughput, setThroughput] = useState<number>(0);

  const startScreeningJob = () => {
    setIsProcessing(true);
    setProcessedCount(0);
    setScreenedResults([]);

    const resumes = generateBulkResumes(batchSize);
    const startTime = performance.now();
    let current = 0;
    const step = 10;

    const interval = setInterval(() => {
      current += step;
      if (current >= resumes.length) {
        current = resumes.length;
        clearInterval(interval);

        // Process all via deterministic engine
        const processed: PipelineCandidate[] = resumes.map((r, idx) => {
          const atsScore = evaluateResumeAgainstJob(r, activeJob);
          let stage: any = 'applied';
          if (atsScore.overallScore >= 80) stage = 'shortlisted';
          else if (atsScore.overallScore >= 60) stage = 'screening';

          return {
            id: `cand-bulk-${idx}`,
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
            tags: atsScore.overallScore >= 80 ? ['High Match', 'Auto-Shortlist'] : ['Under Review'],
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
    }, 120);
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

  const progressPercent = Math.round((processedCount / batchSize) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">High-Throughput Batch Engine</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Worker Pool: 4 Concurrency Threads
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Bulk Candidate Screening Queue
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Screen large batches of incoming resumes against <span className="font-semibold text-white">{activeJob.title}</span> in seconds without API token rate limits.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Batch Size:</span>
            <select
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              disabled={isProcessing}
              aria-label="Screening Batch Size"
              className="bg-slate-900 text-white font-bold rounded px-2 py-1 border border-slate-700 focus:outline-none"
            >
              <option value={50}>50 Resumes</option>
              <option value={100}>100 Resumes</option>
              <option value={200}>200 Resumes</option>
              <option value={400}>400 Resumes (Enterprise)</option>
            </select>
          </div>

          <button
            onClick={startScreeningJob}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20"
          >
            {isProcessing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isProcessing ? 'Screening Batch...' : 'Start Screening'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Progress & Worker Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Screened / Total</span>
          <p className="text-2xl font-black text-white mt-1">{processedCount} / {batchSize}</p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Engine Throughput</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">
            {throughput > 0 ? `${throughput} CV/sec` : '~85 CV/sec'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Zero latency local NLP</p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Auto-Shortlisted (80%+)</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {screenedResults.filter(c => c.atsScore.overallScore >= 80).length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Ready for interview stage</p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Actionable Export</span>
          <button
            onClick={exportToCSV}
            disabled={screenedResults.length === 0}
            className="w-full mt-1.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* Screened Candidates Ranked Table */}
      {screenedResults.length > 0 && (
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Screening Results ({screenedResults.length} Candidates Screened)
            </h3>
            <button
              onClick={() => setActiveView('candidate-ranking')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Open Interactive Ranking Console →
            </button>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-900 z-10">
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="pb-2 font-semibold">Rank</th>
                  <th className="pb-2 font-semibold">Candidate</th>
                  <th className="pb-2 font-semibold">Overall ATS</th>
                  <th className="pb-2 font-semibold">Skills Match</th>
                  <th className="pb-2 font-semibold">Experience Match</th>
                  <th className="pb-2 font-semibold">Confidence</th>
                  <th className="pb-2 font-semibold">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {screenedResults.slice(0, 15).map((c, idx) => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-2.5 font-bold text-white">{c.resume.fullName}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                        c.atsScore.overallScore >= 80 ? 'text-emerald-400 bg-emerald-500/10' : 'text-blue-400 bg-blue-500/10'
                      }`}>
                        {c.atsScore.overallScore}%
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-300">{c.atsScore.components.skillsMatch.score}%</td>
                    <td className="py-2.5 text-slate-300">{c.atsScore.components.experienceMatch.score}%</td>
                    <td className="py-2.5 text-cyan-400 font-semibold">{c.atsScore.confidenceScore}%</td>
                    <td className="py-2.5">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
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
