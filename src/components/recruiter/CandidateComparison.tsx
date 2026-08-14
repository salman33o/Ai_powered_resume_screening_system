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
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Candidate Comparison Matrix</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Comparing {candidates.length} Profiles
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Side-by-Side ATS Alignment for {activeJob.title}
            </h2>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {candidates.map((c) => {
          const ats = c.atsScore;
          return (
            <div 
              key={c.id} 
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Top Profile Card */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">{c.resume.fullName}</h3>
                    <p className="text-xs text-slate-400">{c.resume.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-400">{ats.overallScore}%</span>
                    <p className="text-[10px] text-slate-400">ATS Match</p>
                  </div>
                </div>

                {/* Subscores Grid */}
                <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                  <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-400">Skills ({ats.weights.skillsMatch}%)</span>
                    <p className="font-bold text-white text-sm mt-0.5">{ats.components.skillsMatch.score}%</p>
                  </div>
                  <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-400">Exp ({ats.weights.experienceMatch}%)</span>
                    <p className="font-bold text-white text-sm mt-0.5">{ats.components.experienceMatch.score}%</p>
                  </div>
                  <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-400">Responsibilities</span>
                    <p className="font-bold text-white text-sm mt-0.5">{ats.components.responsibilitiesMatch.score}%</p>
                  </div>
                  <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-400">Confidence</span>
                    <p className="font-bold text-cyan-400 text-sm mt-0.5">{ats.confidenceScore}%</p>
                  </div>
                </div>

                {/* Matched Skills List */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Matched Skills ({ats.components.skillsMatch.matched.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ats.components.skillsMatch.matched.map((m, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {m.skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills List */}
                <div className="space-y-2 text-xs mt-3">
                  <span className="font-bold text-rose-400 uppercase text-[10px] tracking-wider flex items-center space-x-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Missing Requirements ({ats.components.skillsMatch.missingRequired.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ats.components.skillsMatch.missingRequired.length > 0 ? (
                      ats.components.skillsMatch.missingRequired.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">None (All requirements met)</span>
                    )}
                  </div>
                </div>

                {/* Experience History Summary */}
                <div className="mt-3 pt-3 border-t border-slate-800 text-xs">
                  <span className="font-bold text-slate-300 uppercase text-[10px]">Recent Work History</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {c.resume.experience[0]?.jobTitle} at {c.resume.experience[0]?.company} (~{ats.components.experienceMatch.candidateYears} yrs total)
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => onSelectCandidate(c)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  View Full Candidate Profile
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
