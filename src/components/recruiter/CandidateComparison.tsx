import React from 'react';
import { PipelineCandidate, JobRequirement } from '../../types';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Award,
  Briefcase
} from 'lucide-react';

interface CandidateComparisonProps {
  candidates: PipelineCandidate[];
  activeJob: JobRequirement;
  onBack: () => void;
  onSelectCandidate: (candidate: PipelineCandidate) => void;
}

export const CandidateComparison: React.FC<CandidateComparisonProps> = ({
  candidates,
  activeJob,
  onBack,
  onSelectCandidate
}) => {
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded bg-[#0E1A29] hover:bg-[#17263B] text-[#E6EAF0] border border-[#223348] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Spec Comparison Audit</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
                {candidates.length} Profiles Selected
              </span>
            </div>
            <h2 className="text-base font-bold text-[#E6EAF0] font-display mt-0.5">
              Side-by-Side ATS Alignment — {activeJob.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {candidates.map((c) => {
          const ats = c.atsScore;
          return (
            <div 
              key={c.id} 
              className="bg-[#131F30] rounded-lg border border-[#223348] p-4 space-y-3 flex flex-col justify-between"
            >
              <div>
                {/* Top Profile Card */}
                <div className="flex items-start justify-between border-b border-[#223348] pb-2.5">
                  <div>
                    <h3 className="font-bold text-[#E6EAF0] text-sm font-display">{c.resume.fullName}</h3>
                    <p className="text-[11px] font-mono text-[#8A97A8]">{c.resume.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-mono font-bold text-teal-400">{ats.overallScore}%</span>
                    <p className="text-[9px] font-mono text-[#8A97A8]">ATS Match</p>
                  </div>
                </div>

                {/* Subscores Grid */}
                <div className="grid grid-cols-2 gap-2 my-2.5 text-xs font-mono">
                  <div className="p-2 bg-[#0E1A29] rounded border border-[#223348]">
                    <span className="text-[9px] uppercase text-[#8A97A8] block">Skills ({ats.weights.skillsMatch}%)</span>
                    <p className="font-bold text-[#E6EAF0] text-xs mt-0.5">{ats.components.skillsMatch.score}%</p>
                  </div>
                  <div className="p-2 bg-[#0E1A29] rounded border border-[#223348]">
                    <span className="text-[9px] uppercase text-[#8A97A8] block">Exp ({ats.weights.experienceMatch}%)</span>
                    <p className="font-bold text-[#E6EAF0] text-xs mt-0.5">{ats.components.experienceMatch.score}%</p>
                  </div>
                  <div className="p-2 bg-[#0E1A29] rounded border border-[#223348]">
                    <span className="text-[9px] uppercase text-[#8A97A8] block">Responsibilities</span>
                    <p className="font-bold text-[#E6EAF0] text-xs mt-0.5">{ats.components.responsibilitiesMatch.score}%</p>
                  </div>
                  <div className="p-2 bg-[#0E1A29] rounded border border-[#223348]">
                    <span className="text-[9px] uppercase text-[#8A97A8] block">Confidence</span>
                    <p className="font-bold text-teal-300 text-xs mt-0.5">{ats.confidenceScore}%</p>
                  </div>
                </div>

                {/* Matched Skills List */}
                <div className="space-y-1.5 text-xs font-mono">
                  <span className="font-bold text-emerald-400 uppercase text-[9px] tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Matched Skills ({ats.components.skillsMatch.matched.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ats.components.skillsMatch.matched.map((m, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-[#0E1A29] text-emerald-300 border border-emerald-500/30">
                        {m.skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills List */}
                <div className="space-y-1.5 text-xs font-mono mt-2.5">
                  <span className="font-bold text-rose-400 uppercase text-[9px] tracking-wider flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>Missing ({ats.components.skillsMatch.missingRequired.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ats.components.skillsMatch.missingRequired.length > 0 ? (
                      ats.components.skillsMatch.missingRequired.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-[#0E1A29] text-rose-300 border border-rose-500/30">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-[#8A97A8] italic">All requirements present</span>
                    )}
                  </div>
                </div>

                {/* Experience History Summary */}
                <div className="mt-2.5 pt-2.5 border-t border-[#223348] text-xs">
                  <span className="font-bold font-mono text-[#8A97A8] uppercase text-[9px] block">Recent Track Record</span>
                  <p className="text-[#E6EAF0] text-[11px] mt-0.5">
                    {c.resume.experience[0]?.jobTitle} at {c.resume.experience[0]?.company} (~{ats.components.experienceMatch.candidateYears} yrs)
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2.5 border-t border-[#223348]">
                <button
                  onClick={() => onSelectCandidate(c)}
                  className="w-full py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded text-xs font-bold font-mono transition-colors cursor-pointer"
                >
                  Inspect Audit Record
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
