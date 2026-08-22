import React, { useState } from 'react';
import { StructuredResume, JobRequirement } from '../../types';
import { 
  Copy, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  TrendingUp, 
  FileText 
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
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Multi-Version Pipeline</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              {resumes.length} Profiles Indexed
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            Resume Version Management & Comparison
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Maintain specialized resumes tailored for different target roles (e.g. Data Analyst vs ML Engineer).
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono">
          <input
            type="text"
            placeholder="e.g. Resume v4 — Lead"
            value={createdVersionName}
            onChange={(e) => setCreatedVersionName(e.target.value)}
            className="bg-[#0E1A29] px-3 py-1.5 rounded border border-[#223348] text-xs text-[#E6EAF0] focus:outline-none focus:border-teal-500 w-48 font-sans"
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
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Fork Version</span>
          </button>
        </div>
      </div>

      {/* Version Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
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
              className={`p-4 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#17263B] border-teal-500/40'
                  : 'bg-[#131F30] border-[#223348] hover:border-[#334A66]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-[10px] font-bold uppercase text-[#8A97A8] tracking-wider">
                    {ver.fullName}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0E1A29] text-teal-400 font-semibold border border-teal-500/30">
                      Active
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-[#E6EAF0] text-sm mt-1 font-display">{ver.versionName}</h3>
                <p className="text-xs text-[#8A97A8] mt-1.5 line-clamp-2 leading-relaxed">{ver.summary}</p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-[#223348] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#8A97A8] block">Match for {targetJob.title.split(' ')[0]}:</span>
                  <p className="font-bold text-teal-400 text-sm">{scoreAgainstJob}%</p>
                </div>
                <span className="text-[10px] text-[#8A97A8]">
                  {ver.skills.technical.length} Skills
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
