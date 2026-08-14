import React, { useState } from 'react';
import { StructuredResume, JobRequirement } from '../../types';
import { 
  Copy, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  TrendingUp, 
  FileText, 
  Trash2 
} from 'lucide-react';
import { evaluateResumeAgainstJob } from '../../lib/atsEngine';

interface ResumeVersionsProps {
  resumes: StructuredResume[];
  selectedResume: StructuredResume;
  setSelectedResume: (resume: StructuredResume) => void;
  targetJob: JobRequirement;
  onReAnalyze: () => void;
}

export const ResumeVersions: React.FC<ResumeVersionsProps> = ({
  resumes,
  selectedResume,
  setSelectedResume,
  targetJob,
  onReAnalyze
}) => {
  const [createdVersionName, setCreatedVersionName] = useState('');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Multi-Version Pipeline</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {resumes.length} Active Profiles
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Resume Version Management & Comparison
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Maintain specialized resumes tailored for different target roles (e.g. Data Analyst vs ML Engineer).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="e.g. Resume v4 — BI Lead"
            value={createdVersionName}
            onChange={(e) => setCreatedVersionName(e.target.value)}
            className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 w-52"
          />
          <button
            onClick={() => {
              if (!createdVersionName.trim()) return;
              const newVersion: StructuredResume = {
                ...selectedResume,
                id: `resume-v-${Date.now()}`,
                versionName: createdVersionName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              setSelectedResume(newVersion);
              setCreatedVersionName('');
              onReAnalyze();
            }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-indigo-600/20"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Fork Version</span>
          </button>
        </div>
      </div>

      {/* Version Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resumes.map((ver) => {
          const scoreAgainstJob = evaluateResumeAgainstJob(ver, targetJob).overallScore;
          const isSelected = ver.id === selectedResume.id;

          return (
            <div
              key={ver.id}
              onClick={() => {
                setSelectedResume(ver);
                onReAnalyze();
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    {ver.fullName}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white text-sm mt-1.5">{ver.versionName}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{ver.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Match for {targetJob.title.split(' ')[1] || 'Target'}:</span>
                  <p className="font-extrabold text-indigo-400 text-sm">{scoreAgainstJob}%</p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {ver.skills.technical.length} Skills Listed
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
